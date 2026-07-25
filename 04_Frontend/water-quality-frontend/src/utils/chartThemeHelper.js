export const getChartThemeColors = () => {
  const theme = localStorage.getItem("wqms-chart-theme") || "ocean";
  switch (theme) {
    case "emerald":
      return {
        name: "Deep Emerald",
        primary: "#10b981", // teal
        secondary: "#22c55e", // green
        gradientStart: "#10b981",
        gradientEnd: "#22c55e"
      };
    case "cyber":
      return {
        name: "Neon Cyber",
        primary: "#8b5cf6", // purple
        secondary: "#d946ef", // fuchsia
        gradientStart: "#8b5cf6",
        gradientEnd: "#d946ef"
      };
    case "ocean":
    default:
      return {
        name: "Ocean Breeze",
        primary: "#06b6d4", // cyan
        secondary: "#10b981", // teal
        gradientStart: "#06b6d4",
        gradientEnd: "#10b981"
      };
  }
};
