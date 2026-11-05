# MARINE AI — Frontend & Workflow Dashboard (Member 1)
### SIH Problem Statement ID: 26057
**AI-Powered Underwater Marine Debris and Anomaly Detection System**

---

## 🌊 Overview
This module represents the complete **Member 1 (Frontend & Workflow Dashboard)** deliverable for the SIH 26057 marine detection system. It features a tactical subsea hydrographic HUD with an animated **3D underwater seabed & moving water background** (Three.js), side-scan sonar (SSS) waterfall inspection, bounding box and acoustic shadow physics deduction, empirical model evaluation, and an interactive system workflow architecture.

---

## 🚀 Key Features Implemented

1. **3D Underwater Moving Water Background (`UnderwaterBackground3D.jsx`)**:
   - Built with **Three.js** and WebGL.
   - Deformed dynamic ocean floor seabed sand terrain with harmonic fluid undulation.
   - 750+ suspended bioluminescent marine snow particles drifting with realistic subsea currents.
   - Rising buoyant micro-bubbles and volumetric swaying caustic sun rays filtering down the water column.
   - Mouse parallax reaction matching ROV towfish navigation.

2. **Acoustic Detection Records & Granular Analysis (`DetectionResults.jsx`) — Pic 1 & Pic 4**:
   - Side-scan sonar waterfall canvas with specular metallic highlights and outward acoustic shadows.
   - Real-time zoom, contrast inversion, acoustic shadow isolation, and 10m graticule scale.
   - Hydrographic telemetry readout: `14°18'22.4"N, 74°29'08.1"E`, Seabed Depth `48.5m`, Salinity `35.0 PSU`, Temp `22.4°C`.
   - **Acoustic Backscatter Density Profiler**: Real-time cross-swath ping waveform with peak return indicator (`+28.4 dB @ Beam 140`).
   - Physical metrics deduction: estimated length (`6.1m`), width (`2.4m`), shadow length (`8.9m`), and height off seabed (`2.6m`).
   - Risk assessment and lead hydrographer sign-off verification.

3. **Sonar Image Upload & Real-Time Inference (`SonarAnalysis.jsx`) — Pic 3**:
   - Drag-and-drop dropzone supporting `.png`, `.jpg`, `.jpeg`, `.webp`, `.xtf`.
   - Quick benchmark sample loader (`Container & Ghost Net`).
   - Real-time inference tuning: Confidence threshold slider, IOU NMS overlap slider, Adaptive CLAHE filter, Slant-range geometric correction toggle.
   - Dual side-by-side comparison: **Raw Sonar Waterfall** vs **YOLOv8-Marine Annotated Detections**.
   - Mandatory official research notice: *"No detected objects does not guarantee that the seabed is free of debris."*

4. **Model Performance & Empirical Evaluation (`ModelEvaluation.jsx`) — Pic 2**:
   - Quantitative benchmarks: Precision (89.4%), Recall (84.7%), F1-Score (0.870), mAP@50-95 (68.2%), FP16 Latency (38.4ms).
   - Interactive PR-Curves and multi-loss convergence profiles (100 Epochs).
   - Normalized confusion matrix heatmap across 5 classes.
   - Per-class performance dissection table and hydroacoustic physics error analysis.
   - Toggle to live held-out test mode displaying honest *"Not evaluated yet"* status per Rule 2.

5. **End-to-End System Workflow Architecture (`SystemWorkflow.jsx`) — Pic 5**:
   - 6-Stage Interactive Node Pipeline: `Data Acqn` → `Preprocessing` → `Partitioning` → `ML Inference` → `Serving / App` → `Human Loop`.
   - Optional Cloud Sync module (Google Cloud Storage & Cloud Run batch synchronization).
   - Engineered 4-member tech stack breakdown and NVIDIA Jetson edge latency profiler.
   - Acoustic shadow height deduction formula:
     $$\mathbf{H_{obj} = \frac{L_s \times H_t}{R_s}}$$

6. **Centralized API Service (`src/services/api.js`) & Settings**:
   - Configurable environment variable `VITE_API_URL` (default: `http://localhost:8000`).
   - Backend health probe calling `GET /health` with automatic, calibrated offline fallback.
   - Multipart image submission to `POST /predict`.

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Tactical Glassmorphism
- **3D Graphics**: Three.js (WebGL 3D animated ocean floor, particles, water lighting)
- **Icons**: Lucide React
- **Typography**: Chakra Petch & JetBrains Mono

---

## 💻 Setup & Run Instructions (Windows / Linux / macOS)

### Prerequisites
- Node.js `v18+` or `v20+` (Tested on Node `v24.13.0` & npm `11.6.2`)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized bundle will be created in `frontend/dist/`.

---

## 👥 Four-Member Project Alignment
- **Member 1 (Current)**: Frontend Dashboard, 3D Underwater Moving Water HUD, Sonar Viewers, Workflow Architecture, Centralized API service.
- **Member 2 (Parallel)**: SSS Dataset Curation, Train/Val/Test Splits, YOLOv8 Model Baseline Training.
- **Member 3 (Parallel)**: FastAPI backend endpoints (`/health`, `/predict`), image validation, structured JSON inference.
- **Member 4 (Parallel)**: QA test verification, system architecture documentation, presentation slides.
