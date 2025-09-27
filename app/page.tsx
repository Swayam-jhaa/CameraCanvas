//import CameraCanvas from "@/app/component/CameraCanvas";

import CameraCanvas from "../components/ui/cameracanvas";

//import CameraCanvas from "@/components/ui/cameracanvas";

export default function Page() {
  return (
    <main className="h-screen w-screen relative overflow-hidden flex items-center justify-center">
      {/* Mind-blowing animated background */}
      <div className="absolute inset-0 bg-black">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-ping"></div>
        <div className="absolute -bottom-20 left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce"></div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Animated scan lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-32 animate-ping"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent w-32 animate-pulse"></div>
      </div>

      {/* Glassmorphism container */}
      <div className="relative w-full max-w-7xl h-[95vh] backdrop-blur-xl bg-gradient-to-br from-black/60 via-blue-900/20 to-purple-900/30 rounded-3xl p-8 shadow-2xl border border-white/10 overflow-hidden">
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>

        {/* Header with epic styling */}
        <div className="relative flex items-center justify-between mb-6 z-10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent animate-pulse">
                AirDraw
              </h1>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                ✨
              </div>
            </div>
            <div className="h-12 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            <div className="text-lg text-white/90 font-medium">
              <span className="text-cyan-400">AI-Powered</span> Hand Tracking
            </div>
          </div>

          <div className="text-right">
            <div className="text-white/80 text-sm font-medium mb-1">
              GESTURE CONTROLS
            </div>
            <div className="text-cyan-300 text-xs">
              Point finger ↗ Draw • Make fist ✊ Stop
            </div>
          </div>
        </div>

        {/* Camera component container */}
        <div className="relative h-[calc(100%-120px)] rounded-2xl overflow-hidden border border-white/20 shadow-inner">
          <CameraCanvas />

          {/* Holographic overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none rounded-2xl"></div>
        </div>
      </div>

      {/* Ambient light effects */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-sm"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-2 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent blur-sm"></div>
    </main>
  );
}