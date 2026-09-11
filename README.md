# CameraCanvas — In-Air Hand Gesture Virtual Whiteboard

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-00F5D4?style=for-the-badge&logo=vercel&logoColor=black)](https://camera-canvas.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_15-Turbopack-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_19-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![MediaPipe](https://img.shields.io/badge/Google-MediaPipe_Hands-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**Interactive in-browser air-drawing whiteboard powered by Google MediaPipe computer vision hand tracking and HTML5 Canvas.**

[🌐 Try the Live Whiteboard](https://camera-canvas.vercel.app)

</div>

---

## 🖐️ Overview

**CameraCanvas** transforms any standard webcam into a touchless, in-air drawing tablet. Using **Google MediaPipe Hands**, it tracks 21 three-dimensional skeletal hand landmarks in real time directly inside the browser at 60 FPS — requiring zero external hardware, styluses, or special sensors.

### Highlights:
- **Zero-Latency In-Browser Vision**: Client-side inference via WebGL-accelerated MediaPipe pipelines.
- **Pinch-to-Draw Interaction**: Pinches between the thumb and index fingertip trigger real-time stroke interpolation; releasing the pinch suspends drawing.
- **Dual-Layer Canvas Architecture**:
  - *Skeletal Layer*: Displays real-time 21-point hand skeleton, tracking confidence, and active cursor feedback.
  - *Persistent Drawing Layer*: Retains vector-smooth freehand illustrations, annotations, and colored brush strokes.
- **Dark Mode Studio UI**: Clean, distraction-free creative interface designed for digital presentations, teaching, and gesture experimentation.

---

## 🏗️ Architecture

```
                    +------------------------+
                    |     Webcam Stream      |
                    +-----------+------------+
                                |
                                v
                    +------------------------+
                    | Google MediaPipe Hands |  (21 3D Landmarks @ 60 FPS)
                    +-----------+------------+
                                |
                    +-----------+------------+
                    | Pinch Distance Engine  |  (Euclidean ||Index - Thumb|| < Threshold)
                    +-----------+------------+
                                |
                +---------------+---------------+
                |                               |
                v                               v
    +-----------------------+       +-----------------------+
    | Skeletal Guide Canvas |       | Persistent Ink Canvas |
    | (Real-time Hand Mesh) |       | (Exportable Artwork)  |
    +-----------------------+       +-----------------------+
```

---

## 💻 Tech Stack

- **Framework**: Next.js 15 (App Router with Turbopack)
- **Library**: React 19, TypeScript 5
- **Vision Inference**: Google MediaPipe Hands (`@mediapipe/camera_utils`, `@mediapipe/hands`)
- **Styling**: Tailwind CSS v4, Lucide Icons, Radix UI Primitives
- **Deployment**: Vercel Edge

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- Modern browser with WebRTC webcam permissions (Chrome, Edge, Safari, Firefox)

### 1. Installation
```bash
git clone https://github.com/Swayam-jhaa/CameraCanvas.git
cd CameraCanvas

npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open `http://localhost:3000` in your browser and allow camera permissions when prompted.

---

## 🎮 How to Use

1. **Position Your Hand**: Hold your hand 1.5 to 3 feet in front of your camera.
2. **Pinch to Draw**: Bring your index finger and thumb tips close together (`pinch`) to start laying down ink.
3. **Move to Sketch**: Move your pinched fingers in mid-air to draw lines and curves.
4. **Release**: Separate your fingers to stop drawing and move your hand freely across the canvas.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
