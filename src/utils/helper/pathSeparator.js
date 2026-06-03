import { mergedData } from "../../constants/floors";

export const pathSeparator = (floors, result2) => {
  let result23 = [];
  console.log("path separator input result2", result2);

  let currentFloor = null;
  let currentPath = [];

  // Iterate through result2 in order
  result2?.forEach((id) => {
    const item = mergedData.find((data) => data.id === id);
    if (item) {
      // Default to currentFloor if item.floor is missing (intermediate nodes)
      let itemFloor = item.floor;
      if (itemFloor === undefined || itemFloor === null) {
        itemFloor = currentFloor;
      }
      
      if (currentFloor === null) {
        currentFloor = itemFloor;
        currentPath.push(id);
      } else if (itemFloor !== currentFloor) {
        // We've reached a new floor
        if (currentPath.length > 0) {
          result23.push({ floor: currentFloor, path: currentPath });
        }
        currentFloor = itemFloor;
        // Include this point in the new floor path to connect properly (or just start new path)
        currentPath = [id];
      } else {
        // Continue the current floor's path
        currentPath.push(id);
      }
    }
  });

  // Add the last path if it exists
  if (currentPath.length > 0) {
    result23.push({ floor: currentFloor, path: currentPath });
  }

  console.log("path separator output", result23);
  return result23;
};
