import store from "../redux/store";

export const floors = [0];
export const normalFloors = [0];
export const cancerFloors = [0];

export const getMergedData = () => {
  const state = store.getState();
  return state.map.mapData?.nodes || [];
};

export const getMergedMarkers = () => {
  const state = store.getState();
  return state.map.mapData?.markers || [];
};
