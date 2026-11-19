/**
 * BIS IS 10500:2012 Drinking Water Specification Reference Configuration
 * Source of truth for monitored water quality parameters in AQUALYTICA.
 */

export const BIS_STANDARD_META = {
  standardNumber: "BIS IS 10500:2012",
  title: "Drinking Water — Specification",
  revision: "Second Revision",
  organization: "Bureau of Indian Standards (BIS), New Delhi, India",
  officialUrl:
    "https://standards.bis.gov.in/website/standard-details?encryptedId=eyJpdiI6IlhsVzR2UDd6SS9nZWU0VnpjY0NVV0E9PSIsInZhbHVlIjoiL1kwemJVeXZnVWExaElxeWtPeExqdz09IiwibWFjIjoiOGI2NDM3MmQzYjViM2NmZjdkODI3ZjczMGRkZTc5Y2RjNDA3ODA4NWM2MzZjYmNhYmMzNTZmYmU1YmVhNDU4MiIsInRhZyI6IiJ9",
  disclaimerText:
    "AQUALYTICA evaluates selected physical and chemical water quality parameters against relevant BIS reference limits. The system currently monitors pH, turbidity, TDS and temperature, with EC estimated from TDS. It does not perform microbiological, biological or comprehensive chemical testing. Therefore, the assessment of monitored parameters alone does not establish complete drinking-water safety or certify potability.",
  explanatoryNote:
    "The BIS acceptable limit is the recommended level. The permissible limit may apply only in the absence of an alternative source. Exceeding the permissible limit indicates that the water source does not meet the specified limit."
};

export const BIS_PARAMETERS = {
  ph: {
    id: "ph",
    name: "pH Level",
    unit: "pH",
    acceptableLimit: "6.5 – 8.5",
    permissibleLimit: "No relaxation",
    acceptableMin: 6.5,
    acceptableMax: 8.5,
    permissibleMin: null, // No relaxation
    permissibleMax: null,
    referenceCondition: "Specified at 25°C in BIS IS 10500:2012",
    hasComplianceStatus: true,
    sensorPin: "GPIO 34",
    sensingMethod: "Analog pH Sensor (50-sample arithmetic average)",
    description:
      "Indicates the hydrogen ion concentration (acidity or alkalinity) of the water sample.",
    healthSignificance:
      "Water with pH below 6.5 is corrosive and can leach toxic heavy metals from distribution pipes. A pH above 8.5 imparts a bitter taste and reduces chlorine disinfection efficacy.",
    relaxationNote:
      "Under BIS IS 10500:2012, there is no relaxation permitted for pH beyond the 6.5–8.5 range at 25°C."
  },
  turbidity: {
    id: "turbidity",
    name: "Turbidity",
    unit: "NTU",
    acceptableLimit: "Max 1.0 NTU",
    permissibleLimit: "Max 5.0 NTU (in absence of alternative source)",
    acceptableMin: 0.0,
    acceptableMax: 1.0,
    permissibleMin: null,
    permissibleMax: 5.0,
    referenceCondition: "Nephelometric optical measurement",
    hasComplianceStatus: true,
    sensorPin: "GPIO 35",
    sensingMethod:
      "Optical Infrared Turbidity Sensor (41 samples, 8 trimmed each side, 25-sample mean, piecewise linear interpolation via 6 calibration anchors: 2, 5, 10, 20, 75, 200 NTU)",
    description:
      "Measures the optical cloudiness or haziness caused by large numbers of individual suspended particulates.",
    healthSignificance:
      "Excessive turbidity shields pathogenic microorganisms from disinfection, provides adsorption surfaces for toxins, and causes adverse aesthetic and gastrointestinal effects.",
    relaxationNote:
      "Acceptable maximum is 1.0 NTU. Permissible up to 5.0 NTU only when no alternative water source is available."
  },
  totalDissolvedSolids: {
    id: "totalDissolvedSolids",
    name: "Total Dissolved Solids (TDS)",
    unit: "mg/L",
    sensorDisplayUnit: "ppm (mg/L)",
    acceptableLimit: "Max 500 mg/L",
    permissibleLimit: "Max 2000 mg/L (in absence of alternative source)",
    acceptableMin: 0.0,
    acceptableMax: 500.0,
    permissibleMin: null,
    permissibleMax: 2000.0,
    referenceCondition: "Thermally compensated to 25°C via DS18B20",
    hasComplianceStatus: true,
    sensorPin: "GPIO 32",
    sensingMethod:
      "Analog TDS Probe (30-sample acquisition, DS18B20 thermal compensation, operational saturation threshold guarded at ADC 2789)",
    unitEquivalenceNote:
      "BIS specifies TDS in mg/L. AQUALYTICA sensors report in ppm. For dilute aqueous solutions, the approximate equivalence 1 ppm ≈ 1 mg/L is applied as an indicative comparison.",
    description:
      "Represents the total concentration of dissolved inorganic salts and small amounts of organic matter.",
    healthSignificance:
      "High TDS can produce unpalatable mineral taste, gastrointestinal irritation, excessive pipe scaling, and indicates potential chemical runoff.",
    relaxationNote:
      "Acceptable maximum is 500 mg/L. Permissible up to 2000 mg/L only in the absence of an alternative source."
  },
  conductivity: {
    id: "conductivity",
    name: "Electrical Conductivity (EC)",
    unit: "µS/cm",
    acceptableLimit: "No numerical limit specified in relevant table",
    permissibleLimit: "No numerical limit specified in relevant table",
    referenceCondition: "Estimated from TDS at 25°C equivalent",
    hasComplianceStatus: false, // Informational only
    sensorPin: "Derived from TDS",
    sensingMethod: "Calculated from TDS using established factor: EC = TDS × 2.0 µS/cm",
    description:
      "A measure of the ability of water to pass electrical flow, directly related to dissolved ionic concentration.",
    healthSignificance:
      "Serves as an operational proxy for total dissolved ionic activity and salinity changes.",
    relaxationNote:
      "BIS IS 10500:2012 does not establish numerical acceptable or permissible thresholds for conductivity in the primary drinking-water specification table. Estimated in AQUALYTICA as informational only."
  },
  temperature: {
    id: "temperature",
    name: "Water Temperature",
    unit: "°C",
    acceptableLimit: "Not specified in relevant table",
    permissibleLimit: "Not specified in relevant table",
    referenceCondition: "In-situ digital probe measurement",
    hasComplianceStatus: false, // Informational only
    sensorPin: "GPIO 4",
    sensingMethod:
      "DS18B20 Waterproof 1-Wire Digital Probe (firmware accepts -10°C to < 85°C; rejects disconnects at -127°C and unready reset at 85°C)",
    description:
      "Governs chemical dissociation kinetics, microbial incubation rates, and gas solubility.",
    healthSignificance:
      "Warm water accelerates biological regrowth, increases chlorination decay, and alters taste palatability.",
    relaxationNote:
      "BIS IS 10500:2012 does not specify numerical acceptable or permissible drinking-water limits for temperature. Displayed as informational only."
  }
};
