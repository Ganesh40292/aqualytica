import {
  Activity,
  Thermometer,
  Wind,
  Layers,
  Zap
} from "lucide-react";

export const sensorFields = [
  {
    name: "ph",
    label: "pH Level",
    unit: "pH",
    icon: Activity,
    min: 0.0,
    max: 14.0,
    step: 0.1,
    placeholder: "e.g. 7.2"
  },
  {
    name: "temperature",
    label: "Temperature",
    unit: "°C",
    icon: Thermometer,
    min: -10.0,
    max: 100.0,
    step: 0.1,
    placeholder: "e.g. 25.5"
  },
  {
    name: "turbidity",
    label: "Turbidity",
    unit: "NTU",
    icon: Wind,
    min: 0.0,
    max: 100.0,
    step: 0.1,
    placeholder: "e.g. 3.5"
  },
  {
    name: "totalDissolvedSolids",
    label: "Total Dissolved Solids",
    unit: "mg/L",
    icon: Layers,
    min: 0.0,
    max: 20000.0,
    step: 1.0,
    placeholder: "e.g. 350"
  },
  {
    name: "conductivity",
    label: "Conductivity",
    unit: "µS/cm",
    icon: Zap,
    min: 0.0,
    max: 10000.0,
    step: 1.0,
    placeholder: "e.g. 450"
  }
];
