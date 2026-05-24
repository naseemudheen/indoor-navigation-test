import { mergedData } from "../../constants/floors";

export const pathSeparator = (floors, result2) => {
  let result23 = [];
  console.log(result2);

  let currentFloor = null;
  let currentPath = [];

  // Iterate through result2 in order
  result2.forEach((id) => {
    const item = mergedData.find((data) => data.id === id);
    if (item && floors.includes(item.floor)) {
      if (item.floor !== currentFloor) {
        // We've reached a new floor
        if (currentPath.length > 0) {
          result23.push(currentPath);
        }
        currentFloor = item.floor;
        currentPath = [id];
      } else {
        // Continue the current floor's path
        currentPath.push(id);
      }
    }
  });

  // Add the last path if it exists
  if (currentPath.length > 0) {
    result23.push(currentPath);
  }

  console.log(result23);

  const pathWithFloors = result23.map((floorIds) => {
    const floor = mergedData.find((data) => data.id === floorIds[0])?.floor;
    return {
      floor,
      path: floorIds,
    };
  });
  console.log(pathWithFloors);
  return pathWithFloors;
};
