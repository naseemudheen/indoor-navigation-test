import groundData from "../data/maps/groundfloor_data.json";

export const floors = [0];
export const normalFloors = [0];
export const cancerFloors = [0];

export const mergedData = [
  ...(groundData.nodes || groundData),
  // ...basementData,
  // ...firstData,
  // ...secondData,
  // ...cancerFirst,
  // ...cancerSecond,
  // ...cancerThird,
];

export const mergedMarkers = [
  ...(groundData.markers || []),
];
