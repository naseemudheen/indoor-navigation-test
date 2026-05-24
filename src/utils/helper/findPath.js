import { floors, mergedData } from "../../constants/floors";
import { pathSeparator } from "./pathSeparator";
import dijkstrajs from "dijkstrajs";

export const findPath = (startPoint, endPoint) => {
  try {
    if (
      !mergedData.some(
        (item) => item.id === startPoint.id && item.floor === startPoint.floor,
      )
    ) {
      return new Error("Invalid start point");
    }
    if (
      !mergedData.some(
        (item) => item.id === endPoint.id && item.floor === endPoint.floor,
      )
    ) {
      return new Error("Invalid end point");
    }
    const simplifiedPathData = {};
    mergedData?.forEach((item) => {
      simplifiedPathData[item.id] = {};
      item.neighbors.forEach((item1) => {
        simplifiedPathData[item.id][item1.id] = { distance: item1.distance };
      });
    });
    console.log(simplifiedPathData);

    const result2 = dijkstrajs.find_path(
      simplifiedPathData,
      startPoint.id,
      endPoint.id,
    );
    console.log(result2);

    // separate path based on floors
    const pathWithFloors = pathSeparator(floors, result2);
    console.log(pathWithFloors);

    //each floor separated paths
    const startFloorData = pathWithFloors?.find(
      (item) => item.floor == startPoint.floor,
    );
    const endFloorData = pathWithFloors?.find(
      (item) => item.floor == endPoint.floor,
    );

    // each floor starting and ending point
    const selectedStartPathFloor_End = mergedData?.find(
      (item) => item.id == startFloorData?.path[startFloorData.path.length - 1],
    );
    const selectedEndPathFloor_Start = mergedData?.find(
      (item) => item.id == endFloorData?.path[endFloorData.path.length - 1],
    );

    // calculate total distance
    //   const totalDistance = calculateDistance(result2);
    console.log(pathWithFloors);

    return pathWithFloors;
  } catch (error) {
    console.log(error, "err");

    return error;
  }
};
