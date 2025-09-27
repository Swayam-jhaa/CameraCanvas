// components/ui/cameracanvas.tsx
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import type { JSX } from "react";

export default function CameraCanvas(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const handsRef = useRef<any | null>(null);
  const cameraRef = useRef<any | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>("");

  // Utility: load a script tag once
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // If already loaded, resolve
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  };

  // Load MediaPipe scripts (runs client-side)
  useEffect(() => {
    let mounted = true;

    const loadMediaPipe = async () => {
      try {
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js");
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

        // Quick check: confirm classes are available on window
        if (!(window as any).Hands || !(window as any).Camera) {
          // Some CDNs may expose under different names; throw to show user friendly message
          throw new Error("MediaPipe classes not found on window after script load.");
        }

        if (mounted) setIsLoaded(true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load MediaPipe:", err);
        if (mounted) {
          setError("Failed to load hand tracking. Please check your internet connection.");
        }
      }
    };

    loadMediaPipe();

    return () => {
      mounted = false;
    };
  }, []);

  // Initialize MediaPipe Hands once scripts are loaded
  useEffect(() => {
    if (!isLoaded) return;
    if (!videoRef.current || !canvasRef.current || !drawingCanvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;

    // match desired resolution (you can adapt)
    const W = 1280;
    const H = 720;
    canvas.width = drawingCanvas.width = W;
    canvas.height = drawingCanvas.height = H;

    const canvasCtx = canvas.getContext("2d");
    const drawCtx = drawingCanvas.getContext("2d");
    if (!canvasCtx || !drawCtx) {
      setError("Unable to get canvas contexts.");
      return;
    }

    // Create Hands instance from window (type-cast to any)
    try {
      const HandsClass = (window as any).Hands;
      const CameraClass = (window as any).Camera;

      if (!HandsClass || !CameraClass) {
        throw new Error("Hands or Camera is not available on window");
      }

      const hands = new HandsClass({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results: any) => {
        // clear overlay canvas each frame
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
          lastPositionRef.current = null;
          isDrawingRef.current = false;
          return;
        }

        const landmarks = results.multiHandLandmarks[0];

        // landmark indices: 8 = index tip, 6 = index pip, 12 = middle tip, 10 = middle pip
        const indexTip = landmarks[8];
        const indexPip = landmarks[6];
        const middleTip = landmarks[12];
        const middlePip = landmarks[10];

        // convert normalized coords to canvas coords; flip X for mirrored interaction
        const x = canvas.width - indexTip.x * canvas.width;
        const y = indexTip.y * canvas.height;

        // gesture detection
        const indexUp = indexTip.y < indexPip.y;
        const middleDown = middleTip.y > middlePip.y;
        const isPointing = indexUp && middleDown;

        // debug indicator
        canvasCtx.fillStyle = isPointing ? "#00ff88" : "#ff6b6b";
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 10, 0, Math.PI * 2);
        canvasCtx.fill();

        // status text
        canvasCtx.fillStyle = "white";
        canvasCtx.font = "bold 16px Arial";
        canvasCtx.shadowColor = "black";
        canvasCtx.shadowBlur = 4;
        canvasCtx.fillText(isPointing ? "✏️ Drawing" : "👆 Point finger up to draw", x + 20, y - 10);
        canvasCtx.shadowBlur = 0;

        // drawing
        if (isPointing) {
          drawCtx.strokeStyle = "#00ff88";
          drawCtx.lineWidth = 5;
          drawCtx.lineCap = "round";
          drawCtx.lineJoin = "round";
          drawCtx.shadowColor = "#00ff88";
          drawCtx.shadowBlur = 2;

          if (lastPositionRef.current && isDrawingRef.current) {
            drawCtx.beginPath();
            drawCtx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
            drawCtx.lineTo(x, y);
            drawCtx.stroke();
            drawCtx.closePath();
          } else {
            drawCtx.beginPath();
            drawCtx.arc(x, y, 3, 0, Math.PI * 2);
            drawCtx.fill();
          }
          lastPositionRef.current = { x, y };
          isDrawingRef.current = true;
        } else {
          // pen up
          lastPositionRef.current = null;
          isDrawingRef.current = false;
        }

        drawCtx.shadowBlur = 0;
      });

      handsRef.current = hands;

      // initialize Camera helper (MediaPipe camera_utils must be loaded)
      const camera = new (window as any).Camera(video, {
        onFrame: async () => {
          try {
            await handsRef.current?.send({ image: video });
          } catch (e) {
            // swallow occasional frame send errors
            // eslint-disable-next-line no-console
            console.error("hands.send error:", e);
          }
        },
        width: canvas.width,
        height: canvas.height,
      });

      cameraRef.current = camera;
      camera.start().catch((err: any) => {
        // eslint-disable-next-line no-console
        console.error("Camera failed to start:", err);
        setError("Camera access denied. Please allow camera permissions and refresh.");
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to initialize MediaPipe Hands:", e);
      setError("Failed to initialize hand tracking.");
    }

    // cleanup on unmount
    return () => {
      try {
        cameraRef.current?.stop?.();
      } catch {}
      try {
        handsRef.current?.close?.();
      } catch {}
      cameraRef.current = null;
      handsRef.current = null;
    };
  }, [isLoaded]);

  const clearDrawing = useCallback(() => {
    const drawingCanvas = drawingCanvasRef.current;
    if (drawingCanvas) {
      const ctx = drawingCanvas.getContext("2d");
      ctx?.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    }
    isDrawingRef.current = false;
    lastPositionRef.current = null;
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-900/20 rounded-lg border border-red-500/30">
        <div className="text-center text-white p-6">
          <div className="text-red-400 text-2xl mb-4">⚠️ Error</div>
          <div className="mb-4">{error}</div>
          <button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-blue-900/20 rounded-lg border border-blue-500/30">
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-6"></div>
          <div className="text-lg mb-2">Loading AI Hand Tracking...</div>
          <div className="text-sm text-white/70">This may take a few seconds</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-black rounded-lg overflow-hidden border border-white/10">
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay playsInline muted style={{ transform: "scaleX(-1)" }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <canvas ref={drawingCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="absolute top-4 right-4 flex gap-3">
        <button onClick={clearDrawing} className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg backdrop-blur-sm transition-all duration-200 border border-white/20 font-medium">
          🗑️ Clear
        </button>
      </div>

      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-6 py-4 rounded-lg backdrop-blur-sm border border-white/20">
        <div className="text-sm space-y-2">
          <div className="text-green-400 font-medium">✓ Index finger up + middle down = Draw</div>
          <div className="text-gray-300">✗ Any other gesture = Stop drawing</div>
          <div className="text-yellow-400 text-xs mt-2">💡 Keep hand steady for best results</div>
        </div>
      </div>

      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg backdrop-blur-sm border border-white/20">
        <div className="text-xs text-green-400">🟢 AI Tracking Active</div>
      </div>
    </div>
  );
}
