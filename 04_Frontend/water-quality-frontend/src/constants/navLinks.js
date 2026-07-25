import {
  LayoutDashboard,
  Droplets,
  History,
  BarChart3,
  Settings,
  Activity,
  AlertTriangle,
  HelpCircle,
  BookOpen
} from "lucide-react";

const navLinks = [
  {
    path: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/prediction",
    label: "Water Analysis",
    icon: Droplets,
  },
  {
    path: "/telemetry",
    label: "Live Telemetry",
    icon: Activity,
  },
  {
    path: "/history",
    label: "Record Ledger",
    icon: History,
  },
  {
    path: "/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    path: "/errors",
    label: "Error Console",
    icon: AlertTriangle,
  },
  {
    path: "/about",
    label: "About System",
    icon: HelpCircle,
  },
  {
    path: "/handbook",
    label: "Handbook",
    icon: BookOpen,
  },
  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default navLinks;
