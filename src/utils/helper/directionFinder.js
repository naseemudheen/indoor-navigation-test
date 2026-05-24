export function calculateDirection(from, to) {
  // Extract coordinates
  console.log(from);
  console.log(to);

  if (!from?.coordinates || !to?.coordinates) {
    console.warn("calculateDirection: missing coordinates", { from, to });
    return 0;
  }

  const [x1, y1] = from.coordinates;
  const [x2, y2] = to.coordinates;

  // Calculate the vector components
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Calculate the angle in radians
  const angleRadians = Math.atan2(dy, dx);

  // Convert angle to degrees
  const angleDegrees = (angleRadians * 180) / Math.PI;

  // Calculate the Heading-Up angle
  // Map rotate(-theta) * [cos alpha, sin alpha] = [0, -1] -> theta = alpha + 90
  const headingUpAngle = (angleDegrees + 90 + 360) % 360;

  return headingUpAngle;
}
