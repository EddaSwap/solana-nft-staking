import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { getStakedNFTData as getStakedNFTAPI, unStakeNft as unStakeNftAPI } from "../../utils/staking";
import { logError } from 'utils'; 

export const getStakedNFTList = createAsyncThunk(
  "stakedNFT/getStakedNFTList",
  async (params, thunkAPI) => {
    try {
      const response = await getStakedNFTAPI(params);
      return response;
    } catch (error) {
      logError(error, params);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const unstakeNft = createAsyncThunk(
  "stakedNFT/unstakeNft",
  async (params, thunkAPI) => {
    try {
      const response = await unStakeNftAPI(params);
      return response;
    } catch (error) {
      logError(error, params);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const stakedNFTListSlice = createSlice({
  name: "stakedNFT",
  initialState: {
    stakedNFTList: [],
    loading: "idle",
    error: "",
    //for unstake
    unStakeProcessing: 'idle',
    currentUnstakeNft: null,
    unStakeError: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStakedNFTList.pending, (state) => {
      state.stakedNFTList = [];
      state.loading = "loading";
    });
    builder.addCase(getStakedNFTList.fulfilled, (state, { payload }) => {
      state.stakedNFTList = payload.stakedNFTList;
      state.loading = "loaded";
    });
    builder.addCase(getStakedNFTList.rejected, (state, action) => {
      state.stakedNFTList = [];
      state.loading = "error";
      state.error = action.error.message;
    });
    builder.addCase(unstakeNft.pending, (state, { meta }) => {
      const { mintNFTPublicKey } =  meta.arg;
      state.currentUnstakeNft = mintNFTPublicKey.toBase58();
      state.unStakeProcessing = "processing";
      state.unStakeError = null;
    });
    builder.addCase(unstakeNft.fulfilled, (state) => {
      state.unStakeProcessing = "processed";
      state.currentUnstakeNft = null;
      state.unStakeError = null;
    });
    builder.addCase(unstakeNft.rejected, (state, action) => {
      state.currentUnstakeNft = null;
      state.unStakeProcessing = "error";
      state.unStakeError = action.error.message;
    });
  },
});

export default stakedNFTListSlice;
