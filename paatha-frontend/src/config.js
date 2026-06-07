export const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL || `http://${window.location.hostname}:8000`;

// Formula to transform SVG coordinate distance to actual meters
// Based on calibration: SVG distance 0.179948798400245 maps to 3.70 meters
export const SVG_DISTANCE_SCALE = 3.70 / 0.179948798400245;

export const convertSvgDistanceToMeters = (svgDistance) => {
  return svgDistance * SVG_DISTANCE_SCALE;
};
