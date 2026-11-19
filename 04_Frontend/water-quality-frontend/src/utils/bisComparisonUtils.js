/**
 * Reusable BIS Comparison & Evaluation Engine
 * Strictly follows Bureau of Indian Standards BIS IS 10500:2012 Drinking Water Specification.
 */

/**
 * Extracts the actual sensor acquisition or backend persistence timestamp from a record.
 * Prioritizes `createdAt` (backend persistence time) -> `timestamp` (live test) -> `predictedAt`.
 * @param {Object} record Telemetry or history record
 * @returns {Date|null}
 */
export const getRecordAcquisitionTimestamp = (record) => {
  if (!record) return null;
  const raw = record.createdAt || record.timestamp || record.predictedAt;
  if (!raw) return null;

  // Handle ISO-8601 strings safely
  const parsed = new Date(raw.endsWith("Z") ? raw : raw);
  return isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Selects the chronologically latest valid record from an array of history/telemetry objects.
 * Does not assume any array sorting order.
 * @param {Array} records Array of telemetry objects
 * @returns {Object|null}
 */
export const getLatestRecord = (records) => {
  if (!Array.isArray(records) || records.length === 0) return null;
  return records.reduce((latest, current) => {
    const currentTs = getRecordAcquisitionTimestamp(current);
    if (!currentTs) return latest;
    if (!latest) return current;
    const latestTs = getRecordAcquisitionTimestamp(latest);
    if (!latestTs) return current;
    return currentTs.getTime() > latestTs.getTime() ? current : latest;
  }, null);
};

/**
 * Formats a record timestamp for display with timezone safety.
 * @param {Object} record
 * @returns {string}
 */
export const formatAcquisitionTimestamp = (record) => {
  const date = getRecordAcquisitionTimestamp(record);
  if (!date) return "Timestamp Unavailable";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};

/**
 * Evaluates pH against BIS IS 10500:2012 limits.
 * Acceptable: 6.5 to 8.5 at 25°C.
 * Permissible: No relaxation.
 */
export const evaluatePh = (rawVal) => {
  const val = Number(rawVal);
  if (rawVal === null || rawVal === undefined || isNaN(val) || val < 0.0 || val > 14.0) {
    return {
      status: "UNAVAILABLE",
      label: "Sensor Data Unavailable",
      value: null,
      unit: "pH",
      level: "error",
      explanation: "No valid pH telemetry received from hardware node."
    };
  }

  if (val >= 6.5 && val <= 8.5) {
    return {
      status: "WITHIN_ACCEPTABLE",
      label: "WITHIN BIS ACCEPTABLE RANGE",
      value: Number(val.toFixed(2)),
      unit: "pH",
      level: "success",
      explanation: "pH value is within the recommended 6.5–8.5 range (specified at 25°C)."
    };
  }

  if (val < 6.5) {
    return {
      status: "BELOW_RANGE",
      label: "BELOW BIS SPECIFIED RANGE",
      value: Number(val.toFixed(2)),
      unit: "pH",
      level: "danger",
      explanation: "pH is acidic (< 6.5). No relaxation permitted under BIS IS 10500:2012."
    };
  }

  return {
    status: "ABOVE_RANGE",
    label: "ABOVE BIS SPECIFIED RANGE",
    value: Number(val.toFixed(2)),
    unit: "pH",
    level: "danger",
    explanation: "pH is alkaline (> 8.5). No relaxation permitted under BIS IS 10500:2012."
  };
};

/**
 * Evaluates Turbidity against BIS IS 10500:2012 limits.
 * Acceptable: Max 1.0 NTU.
 * Permissible: Max 5.0 NTU (in absence of alternative source).
 */
export const evaluateTurbidity = (rawVal) => {
  const val = Number(rawVal);
  if (rawVal === null || rawVal === undefined || isNaN(val) || val < 0.0) {
    return {
      status: "UNAVAILABLE",
      label: "Sensor Data Unavailable",
      value: null,
      unit: "NTU",
      level: "error",
      explanation: "No valid turbidity telemetry received from optical probe."
    };
  }

  if (val <= 1.0) {
    return {
      status: "WITHIN_ACCEPTABLE",
      label: "WITHIN BIS ACCEPTABLE LIMIT",
      value: Number(val.toFixed(2)),
      unit: "NTU",
      level: "success",
      explanation: "Turbidity is at or below the recommended acceptable target (1.0 NTU)."
    };
  }

  if (val <= 5.0) {
    return {
      status: "PERMISSIBLE_ONLY",
      label: "ABOVE ACCEPTABLE LIMIT",
      subLabel: "Within permissible limit only in absence of alternative source",
      value: Number(val.toFixed(2)),
      unit: "NTU",
      level: "warning",
      explanation: "Exceeds 1.0 NTU acceptable target; permissible up to 5.0 NTU only if no alternative source is available."
    };
  }

  return {
    status: "ABOVE_PERMISSIBLE",
    label: "ABOVE BIS PERMISSIBLE LIMIT",
    value: Number(val.toFixed(2)),
    unit: "NTU",
    level: "danger",
    explanation: "Turbidity exceeds the absolute permissible maximum (> 5.0 NTU)."
  };
};

/**
 * Evaluates TDS against BIS IS 10500:2012 limits.
 * Acceptable: Max 500 mg/L.
 * Permissible: Max 2000 mg/L (in absence of alternative source).
 * Unit note: 1 ppm ≈ 1 mg/L for dilute aqueous solutions.
 */
export const evaluateTds = (rawVal) => {
  const val = Number(rawVal);
  if (rawVal === null || rawVal === undefined || isNaN(val) || val < 0.0) {
    return {
      status: "UNAVAILABLE",
      label: "Sensor Data Unavailable",
      value: null,
      unit: "mg/L (ppm)",
      level: "error",
      explanation: "No valid TDS telemetry received from sensor probe."
    };
  }

  if (val <= 500.0) {
    return {
      status: "WITHIN_ACCEPTABLE",
      label: "WITHIN BIS ACCEPTABLE LIMIT",
      value: Number(val.toFixed(1)),
      unit: "mg/L (ppm)",
      level: "success",
      explanation: "TDS is at or below the recommended acceptable target (500 mg/L)."
    };
  }

  if (val <= 2000.0) {
    return {
      status: "PERMISSIBLE_ONLY",
      label: "ABOVE ACCEPTABLE LIMIT",
      subLabel: "Within permissible limit only in absence of alternative source",
      value: Number(val.toFixed(1)),
      unit: "mg/L (ppm)",
      level: "warning",
      explanation: "Exceeds 500 mg/L acceptable target; permissible up to 2000 mg/L only if no alternative source is available."
    };
  }

  return {
    status: "ABOVE_PERMISSIBLE",
    label: "ABOVE BIS PERMISSIBLE LIMIT",
    value: Number(val.toFixed(1)),
    unit: "mg/L (ppm)",
    level: "danger",
    explanation: "TDS exceeds the absolute permissible maximum (> 2000 mg/L)."
  };
};

/**
 * Evaluates Electrical Conductivity (EC).
 * Informational measurement only; no compliance classification assigned.
 */
export const evaluateEc = (rawVal) => {
  const val = Number(rawVal);
  if (rawVal === null || rawVal === undefined || isNaN(val) || val < 0.0) {
    return {
      status: "INFORMATIONAL_ONLY",
      label: "INFORMATIONAL ONLY",
      value: null,
      unit: "µS/cm",
      level: "info",
      explanation: "Estimated EC measurement unavailable."
    };
  }

  return {
    status: "INFORMATIONAL_ONLY",
    label: "INFORMATIONAL ONLY",
    value: Number(val.toFixed(1)),
    unit: "µS/cm",
    level: "info",
    explanation: "Estimated from TDS using existing factor of 2.0 (µS/cm); not an independent physical probe measurement. No numerical BIS drinking-water limit."
  };
};

/**
 * Evaluates Temperature.
 * Informational measurement only; no compliance classification assigned.
 */
export const evaluateTemperature = (rawVal) => {
  const val = Number(rawVal);
  if (rawVal === null || rawVal === undefined || isNaN(val)) {
    return {
      status: "INFORMATIONAL_ONLY",
      label: "INFORMATIONAL ONLY",
      value: null,
      unit: "°C",
      level: "info",
      explanation: "DS18B20 digital temperature probe reading unavailable or disconnected."
    };
  }

  return {
    status: "INFORMATIONAL_ONLY",
    label: "INFORMATIONAL ONLY",
    value: Number(val.toFixed(1)),
    unit: "°C",
    level: "info",
    explanation: "Physical ambient/in-situ temperature. No numerical BIS drinking-water limit specified."
  };
};

/**
 * Overall BIS Parameter Assessment Engine.
 * Evaluates monitored compliance parameters: pH, Turbidity, and TDS.
 * CRITICAL RULE: Preserves and reports ALL detected violations simultaneously.
 * Missing data NEVER conceals or suppresses any detected violation.
 *
 * @param {Object} phEval Evaluated pH object
 * @param {Object} turbEval Evaluated Turbidity object
 * @param {Object} tdsEval Evaluated TDS object
 * @returns {Object} Comprehensive assessment result
 */
export const evaluateOverallBisStatus = (phEval, turbEval, tdsEval) => {
  const evaluations = [
    { name: "pH", eval: phEval, unit: "pH" },
    { name: "Turbidity", eval: turbEval, unit: "NTU" },
    { name: "TDS", eval: tdsEval, unit: "mg/L (ppm)" }
  ];

  // 1. Identify missing parameters
  const missingList = evaluations
    .filter((e) => e.eval.status === "UNAVAILABLE")
    .map((e) => e.name);
  const hasMissing = missingList.length > 0;

  // 2. Collect ALL violations across all available parameters
  const violations = [];

  // pH checks (No relaxation permitted in BIS IS 10500:2012)
  if (phEval.status === "BELOW_RANGE" || phEval.status === "ABOVE_RANGE") {
    violations.push({
      parameter: "pH",
      severity: "danger",
      type: "pH_SPECIFICATION_BREACH",
      message: `pH ${phEval.value ?? ""} is outside the acceptable range (6.5–8.5 at 25°C). No relaxation permitted.`
    });
  }

  // Turbidity checks
  if (turbEval.status === "ABOVE_PERMISSIBLE") {
    violations.push({
      parameter: "Turbidity",
      severity: "danger",
      type: "ABOVE_PERMISSIBLE_LIMIT",
      message: `Turbidity ${turbEval.value ?? ""} NTU exceeds maximum permissible limit (> 5.0 NTU).`
    });
  } else if (turbEval.status === "PERMISSIBLE_ONLY") {
    violations.push({
      parameter: "Turbidity",
      severity: "warning",
      type: "ABOVE_ACCEPTABLE_LIMIT",
      message: `Turbidity ${turbEval.value ?? ""} NTU exceeds acceptable limit (1.0 NTU); permissible only if no alternative source.`
    });
  }

  // TDS checks
  if (tdsEval.status === "ABOVE_PERMISSIBLE") {
    violations.push({
      parameter: "TDS",
      severity: "danger",
      type: "ABOVE_PERMISSIBLE_LIMIT",
      message: `TDS ${tdsEval.value ?? ""} mg/L exceeds maximum permissible limit (> 2000 mg/L).`
    });
  } else if (tdsEval.status === "PERMISSIBLE_ONLY") {
    violations.push({
      parameter: "TDS",
      severity: "warning",
      type: "ABOVE_ACCEPTABLE_LIMIT",
      message: `TDS ${tdsEval.value ?? ""} mg/L exceeds acceptable limit (500 mg/L); permissible only if no alternative source.`
    });
  }

  // 3. Determine Overall Title & Highest Severity State while PRESERVING ALL VIOLATIONS
  const hasDanger = violations.some((v) => v.severity === "danger");
  const hasWarning = violations.some((v) => v.severity === "warning");

  let statusKey = "ALL_ACCEPTABLE";
  let title = "ALL MONITORED PARAMETERS WITHIN BIS ACCEPTABLE LIMITS";
  let level = "success";

  if (hasDanger) {
    level = "danger";
    statusKey = "CRITICAL_BREACH";
    const dangerParams = violations
      .filter((v) => v.severity === "danger")
      .map((v) => v.parameter);
    title = `${dangerParams.join(" & ")} BREACH BIS SPECIFICATION LIMITS`;
  } else if (hasWarning) {
    level = "warning";
    statusKey = "ABOVE_ACCEPTABLE";
    const warnParams = violations
      .filter((v) => v.severity === "warning")
      .map((v) => v.parameter);
    title = `${warnParams.join(" & ")} EXCEED RECOMMENDED ACCEPTABLE LIMITS`;
  } else if (hasMissing) {
    level = "neutral";
    statusKey = "INSUFFICIENT_DATA";
    title = "INSUFFICIENT SENSOR DATA FOR COMPLETE ASSESSMENT";
  }

  return {
    statusKey,
    title,
    level,
    violations,       // Preserves EVERY detected breach with full details
    missingList,      // Lists every unavailable parameter
    hasViolations: violations.length > 0,
    hasMissing,
    timestampEvaluated: new Date().toISOString()
  };
};
