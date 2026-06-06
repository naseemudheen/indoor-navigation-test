import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMapData = createAsyncThunk(
  "map/fetchMapData",
  async (floorId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/map/data/${floorId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch map data");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const mapSlice = createSlice({
  name: "map",
  initialState: {
    floor: 0,
    session_id: null,
    mapData: {
      nodes: [],
      markers: []
    },
    mapDataStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    mapDataError: null,
    initialPath: {
      path: null,
      floor: null,
      startPoint: null,
      endPoint: null,
    },
    intermediatePath: {
      path: null,
      floor: null,
      startPoint: null,
      endPoint: null,
    },
    finalPath: {
      path: null,
      floor: null,
      startPoint: null,
      endPoint: null,
    },
  },
  reducers: {
    setFloor: (state, action) => {
      state.floor = action.payload;
    },
    setSessionId: (state, action) => {
      console.log(action.payload,'payload');
      
      state.session_id = action.payload;
    },
    setInitialPath: (state, action) => {
      state.initialPath.floor = action.payload.floor;
      state.initialPath.path = action.payload.path;
      state.initialPath.startPoint = action.payload.startPoint;
      state.initialPath.endPoint = action.payload.endPoint;
    },
    setIntermediatePath: (state, action) => {
      state.intermediatePath.floor = action.payload.floor;
      state.intermediatePath.path = action.payload.path;
      state.intermediatePath.startPoint = action.payload.startPoint;
      state.intermediatePath.endPoint = action.payload.endPoint;
    },
    setFinalPath: (state, action) => {
      state.finalPath.floor = action.payload.floor;
      state.finalPath.path = action.payload.path;
      state.finalPath.startPoint = action.payload.startPoint;
      state.finalPath.endPoint = action.payload.endPoint;
    },
    resetInitialPath: (state) => {
      state.initialPath.floor = null;
      state.initialPath.path = null;
      state.initialPath.startPoint = null;
      state.initialPath.endPoint = null;
      state.intermediatePath.floor = null;
      state.intermediatePath.path = null;
      state.intermediatePath.startPoint = null;
      state.intermediatePath.endPoint = null;
      state.finalPath.floor = null;
      state.finalPath.path = null;
      state.finalPath.startPoint = null;
      state.finalPath.endPoint = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMapData.pending, (state) => {
        state.mapDataStatus = 'loading';
      })
      .addCase(fetchMapData.fulfilled, (state, action) => {
        state.mapDataStatus = 'succeeded';
        state.mapData = action.payload;
      })
      .addCase(fetchMapData.rejected, (state, action) => {
        state.mapDataStatus = 'failed';
        state.mapDataError = action.payload;
      });
  },
});

export const {
  setFloor,
  setInitialPath,
  setFinalPath,
  resetInitialPath,
  setIntermediatePath,
  setSessionId
} = mapSlice.actions;

export default mapSlice.reducer;
