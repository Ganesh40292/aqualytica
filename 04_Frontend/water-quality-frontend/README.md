# Aqualytica - React Frontend Portal

This directory houses the dynamic client web application for **Aqualytica – AI-Powered Water Quality Intelligence Platform**. The dashboard provides interactive telemetry feeds, historical ledgers, analytics plots, and machine learning prediction forms.

---

## Technical Stack
- **Framework**: React.js with Vite builder tooling
- **Styling**: Tailwind CSS (with glassmorphic overlays and glowing neon effects)
- **Charts & Visualization**: Recharts (smooth line, spline, area charts)
- **Animations**: Framer Motion (page transitions, collapsible drawers, custom popups)
- **Icons**: Lucide React
- **Asset Bundling**: Rolldown (fast production minification)

---

## Key Interface Features

### 1. Cinematic AI Boot Sequence
- Plays an immersive 4-phase boot sequence representing enterprise AI system loading:
  - Microscopic drifting water molecules.
  - Interactive console logs scanning network connections and API health checks.
  - SVG morphing droplets with Concentric Orbit guides.
  - Smooth scaling exit blurs transitions.

### 2. Live Telemetry Simulators
- Real-time sensor stream charts representing incoming IoT packages.
- Dynamic wave height canvas simulation nodes reacting to metric values.
- Manual calibration sliders overriding real-time metrics.

### 3. Glassmorphic History Table
- Historical ledger sorting parameters (pH, TDS, Temperature, etc.).
- Multi-filter selection panel (safety status, minimum prediction confidence slider, start/end dates).
- Clean print styles triggering a landscape-formatted double-border Laboratory testing certificate.

### 4. Interactive Handbook Accordions
- Dedicated FAQ tab detailing optimal WHO guidelines and neutralization tips for key parameters.

---

## Directory Architecture
```
water-quality-frontend/
├── src/
│   ├── assets/            # Global styling sheets and icons
│   ├── components/
│   │   ├── common/        # Buttons, Status Badges, Page wrappers
│   │   ├── layout/        # Navbar bells, Collapsible sidebars
│   │   ├── dashboard/     # WQS gauges, Wave-fill canvases
│   │   ├── telemetry/     # Overrides, Particle logs stream
│   │   └── history/       # Records list, Export drawer
│   ├── constants/         # Sidebar paths, Sensor configurations
│   ├── pages/             # Page views (Dashboard, Analysis, Telemetry, Handbook)
│   ├── services/          # Axios HTTP endpoints configurations
│   └── utils/             # Web audio synthesizers and PDF generators
├── index.html
├── package.json
└── tailwind.config.js
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev server
```bash
npm run dev
```
The React application will launch at `http://localhost:5173/`.

### 3. Build Production Bundle
```bash
npm run build
```
Creates minified html, css, and js chunks inside the `/dist` directory.
