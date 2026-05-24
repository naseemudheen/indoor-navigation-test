import basementData from "../data/maps/basementData.json";
import groundData from "../data/maps/groundData.json";
import firstData from "../data/maps/firstFloorData.json";
import secondData from "../data/maps/secondFloorData.json";
import cancerFirst from "../data/maps/cancer1Data.json";
import cancerSecond from "../data/maps/cancer2Data.json";
import cancerThird from "../data/maps/cancer3Data.json";

export const floors = [-1, 0, 1, 2, "C1", "C2", "C3"];
export const normalFloors = [-1, 0, 1, 2];
export const cancerFloors = [0, "C1", "C2", "C3"];

export const mergedData = [
  ...groundData,
  ...basementData,
  ...firstData,
  ...secondData,
  ...cancerFirst,
  ...cancerSecond,
  ...cancerThird,
];
