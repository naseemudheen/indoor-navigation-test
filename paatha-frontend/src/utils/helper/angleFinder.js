export const calculateAngle = (A, B, C) => {
  if (!A?.coordinates || !B?.coordinates || !C?.coordinates) {
    console.warn("calculateAngle: missing coordinates", { A, B, C });
    return 0;
  }
  const preNode = A;
  const currentNode = B;
  const postNode = C;
  let AB = [
    Number(currentNode.coordinates[0]).toFixed(3) - Number(preNode.coordinates[0]).toFixed(3),
    Number(currentNode.coordinates[1]).toFixed(3) - Number(preNode.coordinates[1]).toFixed(3),
  ];
  let BD = [
    Number(postNode.coordinates[0]).toFixed(3) - Number(currentNode.coordinates[0]).toFixed(3),
    Number(postNode.coordinates[1]).toFixed(3) - Number(currentNode.coordinates[1]).toFixed(3),
  ];
  console.log(AB);

  let crossProduct = AB[0] * BD[1] - AB[1] * BD[0];
  let dotProduct = AB[0] * BD[0] + AB[1] * BD[1];
  let magnitudeAB = Math.sqrt(Math.pow(AB[0], 2) + Math.pow(AB[1], 2));
  let magnitudeBD = Math.sqrt(Math.pow(BD[0], 2) + Math.pow(BD[1], 2));
  let angle = Math.atan2(crossProduct, dotProduct);
  let angleDegrees = ((angle * 180) / Math.PI) % 360;
  return angleDegrees;
};

export const calculateAngleBetweenTwoPoints = (point1, point2) => {
  if (!point1?.coordinates || !point2?.coordinates) {
    console.warn("calculateAngleBetweenTwoPoints: missing coordinates", { point1, point2 });
    return 0;
  }
  // Calculate the differences in coordinates
  const dx = point2.coordinates[0] - point1.coordinates[0];
  const dy = point2.coordinates[1] - point1.coordinates[1];

  // Calculate the angle in radians using Math.atan2
  // atan2 returns angle in radians in range (-π, π)
  let angle = Math.atan2(dy, dx);

  // Convert to degrees and normalize to range [0, 360)
  let angleDegrees = ((angle * 180) / Math.PI) % 360;

  // If angle is negative, add 360 to make it positive
  if (angleDegrees < 0) {
    angleDegrees += 360;
  }

  return angleDegrees;
};
