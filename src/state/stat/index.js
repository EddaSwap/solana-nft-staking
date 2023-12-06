import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getStakeStats as getStakeStatsAPI } from "utils/staking";

import { logError } from "utils";

export const getStakedStatList = createAsyncThunk(
  "stakedStat/getStakedStatList",
  async (params, thunkAPI) => {
    try {
      const response = await getStakeStatsAPI(params);
      return response;
    } catch (error) {
      logError(error, params);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const rewardListSlice = createSlice({
  name: "stakedStat",
  initialState: {
    statsList: [],
    loading: "idle",
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStakedStatList.pending, (state) => {
      state.statsList = [];
      state.loading = "loading";
    });
    builder.addCase(getStakedStatList.fulfilled, (state, { payload }) => {
      state.statsList = payload;
      state.loading = "loaded";
    });
    builder.addCase(getStakedStatList.rejected, (state, action) => {
      state.statsList = [];
      state.loading = "error";
      state.error = action.error.message;
    });
  },
});

export default rewardListSlice;
