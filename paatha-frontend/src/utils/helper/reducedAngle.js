export const reducedAngle = (angle) => {
  return ((angle % 360) + 360) % 360;
};
