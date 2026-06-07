import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to detect steps using the DeviceMotion API.
 * Uses a low-pass filter and dynamic thresholding on acceleration including gravity.
 * 
 * @param {Function} onStep - Callback triggered when a step is detected.
 */
export default function usePedometer(onStep) {
  const [isActive, setIsActive] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("default");
  const [stepCount, setStepCount] = useState(0);

  // Use refs for values needed in the high-frequency event listener to avoid re-binding
  const onStepRef = useRef(onStep);
  useEffect(() => {
    onStepRef.current = onStep;
  }, [onStep]);

  // Filtering variables
  const lastAccelFiltered = useRef(9.8);
  const accelBaseline = useRef(9.8);
  const lastStepTime = useRef(0);
  const isAboveThreshold = useRef(false);

  // Constants
  const ALPHA = 0.85; // Low-pass filter smoothing coefficient
  const BETA = 0.98;  // Baseline tracker smoothing coefficient (slow)
  const THRESHOLD_MARGIN = 1.25; // Acceleration difference (m/s^2) above baseline to count as a step
  const STEP_COOLDOWN_MS = 350; // Min time between steps (max ~2.8 steps/sec)

  const handleDeviceMotion = (event) => {
    const accel = event.accelerationIncludingGravity || event.acceleration;
    if (!accel) return;

    const x = accel.x || 0;
    const y = accel.y || 0;
    const z = accel.z || 0;

    // Calculate magnitude
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    // Apply low-pass filter to smooth high-frequency noise
    lastAccelFiltered.current = ALPHA * lastAccelFiltered.current + (1 - ALPHA) * magnitude;

    // Apply very slow low-pass filter to track gravity baseline (approx 9.8m/s^2)
    accelBaseline.current = BETA * accelBaseline.current + (1 - BETA) * magnitude;

    const diff = lastAccelFiltered.current - accelBaseline.current;
    const now = Date.now();

    if (diff > THRESHOLD_MARGIN) {
      if (!isAboveThreshold.current && now - lastStepTime.current > STEP_COOLDOWN_MS) {
        // Step detected!
        isAboveThreshold.current = true;
        lastStepTime.current = now;
        setStepCount((prev) => prev + 1);
        if (onStepRef.current) {
          onStepRef.current();
        }
      }
    } else if (diff < 0.2) {
      // Reset threshold trigger when signal returns near or below baseline
      isAboveThreshold.current = false;
    }
  };

  const requestPermission = async () => {
    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        setPermissionStatus(response);
        if (response === "granted") {
          setIsActive(true);
          return true;
        }
        return false;
      } catch (err) {
        console.error("DeviceMotionEvent permission request failed:", err);
        setPermissionStatus("denied");
        return false;
      }
    } else {
      // Standard browser, permission is implicitly granted
      setPermissionStatus("granted");
      setIsActive(true);
      return true;
    }
  };

  const stopTracking = () => {
    setIsActive(false);
  };

  useEffect(() => {
    if (!isActive) return;

    window.addEventListener("devicemotion", handleDeviceMotion);
    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, [isActive]);

  return {
    isActive,
    permissionStatus,
    stepCount,
    requestPermission,
    stopTracking,
    setStepCount,
  };
}
