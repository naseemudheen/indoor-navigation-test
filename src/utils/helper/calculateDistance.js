import { mergedData } from "../../constants/floors";

export const calculateDistance = (result2) => {
  const result = [];
  const seenPairs = new Set();
  let totalDistance = 0;

  mergedData.forEach((path) => {
    if (result2.includes(path.id)) {
      path.neighbors.forEach((neighbor) => {
        if (result2.includes(neighbor.id)) {
          const pair = `${path.id}-${neighbor.id}`;
          const reversePair = `${neighbor.id}-${path.id}`;

          // Only add if the reverse pair hasn't been added yet
          if (!seenPairs.has(reversePair)) {
            result.push({
              id1: path.id,
              id2: neighbor.id,
              distance: neighbor.distance,
            });
            totalDistance += neighbor.distance;
            seenPairs.add(pair); // Mark this pair as seen
          }
        }
      });
    }
  });

  return totalDistance;
};
