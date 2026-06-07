import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to track device compass heading using DeviceOrientation API.
 * Uses cartesian smoothing to handle 0/360 wrap-around seamlessly.
 * 
 * @param {Function} onHeadingChange - Callback triggered when heading changes.
 */
export default function useDeviceOrientation(onHeadingChange) {
  const [isActive, setIsActive] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("default");
  const [heading, setHeading] = useState(0);

  const onHeadingChangeRef = useRef(onHeadingChange);
  useEffect(() => {
    onHeadingChangeRef.current = onHeadingChange;
  }, [onHeadingChange]);

  // Cartesian smoothing variables to prevent jitter and handle wrap-around
  const smoothX = useRef(1);
  const smoothY = useRef(0);
  const BETA = 0.92; // Smoothing coefficient (higher = smoother, slower response)

  const handleOrientation = (event) => {
    let rawHeading = null;

    if (event.webkitCompassHeading !== undefined) {
      // iOS webkit compass heading is direct and accurate
      rawHeading = event.webkitCompassHeading;
    } else if (event.absolute === true && event.alpha !== null) {
      // Android absolute alpha is compass heading (0 = North)
      // Standard DeviceOrientation: alpha is counter-clockwise, compass heading is clockwise.
      rawHeading = (360 - event.alpha) % 360;
    } else if (event.alpha !== null) {
      // Fallback: non-absolute alpha (relative heading)
      rawHeading = (360 - event.alpha) % 360;
    }

    if (rawHeading === null) return;

    // Convert angle to radians for vector components
    const rad = (rawHeading * Math.PI) / 180;
    const x = Math.cos(rad);
    const y = Math.sin(rad);

    // Apply exponential smoothing to vector components
    smoothX.current = BETA * smoothX.current + (1 - BETA) * x;
    smoothY.current = BETA * smoothY.current + (1 - BETA) * y;

    // Reconstruct the smoothed angle
    let smoothedAngle = (Math.atan2(smoothY.current, smoothX.current) * 180) / Math.PI;
    if (smoothedAngle < 0) {
      smoothedAngle += 360;
    }

    setHeading(smoothedAngle);
    if (onHeadingChangeRef.current) {
      onHeadingChangeRef.current(smoothedAngle);
    }
  };

  const requestPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        setPermissionStatus(response);
        if (response === "granted") {
          setIsActive(true);
          return true;
        }
        return false;
      } catch (err) {
        console.error("DeviceOrientationEvent permission request failed:", err);
        setPermissionStatus("denied");
        return false;
      }
    } else {
      // Standard browser, permission implicitly granted
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

    // Use absolute orientation events if supported for true magnetic heading on Android
    const hasAbsoluteEvent = "ondeviceorientationabsolute" in window;
    const eventName = hasAbsoluteEvent ? "deviceorientationabsolute" : "deviceorientation";

    window.addEventListener(eventName, handleOrientation);
    return () => {
      window.removeEventListener(eventName, handleOrientation);
    };
  }, [isActive]);

  return {
    isActive,
    permissionStatus,
    heading,
    requestPermission,
    stopTracking,
  };
}
