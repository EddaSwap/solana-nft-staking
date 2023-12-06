import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { getPoints as getPointsAPI } from "../../utils/staking";

export const getPoints = createAsyncThunk(
  "points/getPoints",
  async (params, thunkAPI) => {
    try {
      const response = await getPointsAPI(params);
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const pointSlice = createSlice({
  name: "points",
  initialState: {
    userPoints: 0,
    loading: "idle",
    error: "",
    isFirstStake: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPoints.pending, (state) => {
      state.userPoints = 0;
      state.loading = "loading";
    });
    builder.addCase(getPoints.fulfilled, (state,{ payload}) => {
      const  {
        userPoints,
        isFirstStake,
      } = payload;
      console.log('result get point', userPoints, isFirstStake, )
      state.userPoints = userPoints;
      state.isFirstStake = isFirstStake;
      state.loading = "loaded";
    });
    builder.addCase(getPoints.rejected, (state, action) => {
      state.userPoints = 0;
      state.loading = "error";
      state.isFirstStake = false;
      state.error = action.error.message;
    });
  },
});

export const selectpoints = createSelector(
  (state) => ({
    userPoints: state.points,
    loading: state.points.loading,
  }),
  (state) => state
);
export default pointSlice;
