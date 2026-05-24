import { configureStore } from "@reduxjs/toolkit";
import mapSlice from "./mapSlice";

const store = configureStore({
  reducer: {
    map: mapSlice,
  },
});

export default store;
