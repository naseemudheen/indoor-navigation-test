function determineDirection(A, B, D) {
  console.log(A);

  // Calculate vectors AB and BD
  let AB = [B[0] - A[0], B[1] - A[1]];
  let BD = [D[0] - B[0], D[1] - B[1]];

  // Calculate cross product (AB x BD)
  let crossProduct = AB[0] * BD[1] - AB[1] * BD[0];
  console.log(crossProduct);

  // Determine direction
  if (crossProduct > 0) {
    return "Turn Left";
  } else if (crossProduct < 0) {
    return "Turn Right";
  } else {
    return "Go Straight";
  }
}
