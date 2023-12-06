import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { claimNft as claimNftAPI, 
  getRewardNFTList as getRewardNFTListAPI,
  claimSaleableNft as claimSaleableNftAPI,
  buyNft as buyNftAPI,
} from "utils/staking";
import { logError } from 'utils'; 

export const getRewardNFTList = createAsyncThunk(
  "rewardNFT/getRewardNFTList",
  async (params, thunkAPI) => {
    try {
      const response = await getRewardNFTListAPI(params);
      return response;
    } catch (error) {
      logError(error, params);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const claimNFT = createAsyncThunk(
  "rewardNFT/claimNFT",
  async (params, thunkAPI) => {
    try {
      const response = await claimNftAPI(params);
      return response;
    } catch (error) {
      logError(error, params);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const claimSaleableNft = createAsyncThunk(
  "rewardNFT/claimSaleableNft",
  async (params, thunkAPI) => {
    try {
      const response = await claimSaleableNftAPI(params);
      return response;
    } catch (error) {
      logError(error, params);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const buyNft = createAsyncThunk(
  "rewardNFT/buyNft",
  async (params, thunkAPI) => {
    try {
      const response = await buyNftAPI(params);
      return response;
    } catch (error) {
      logError(error, params);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);



const rewardListSlice = createSlice({
  name: "rewardNFT",
  initialState: {
    rewardList: [],
    loading: "idle",
    error: "",
    //for claim and buy
    claimProcessing: 'idle',
    currentClaimNFT: null,
    currentAction: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRewardNFTList.pending, (state) => {
      state.rewardList = [];
      state.loading = "loading";
    });
    builder.addCase(getRewardNFTList.fulfilled, (state, { payload }) => {
      state.rewardList = payload;
      state.loading = "loaded";
    });
    builder.addCase(getRewardNFTList.rejected, (state, action) => {
      state.rewardList = [];
      state.loading = "error";
      state.error = action.error.message;
    });
    builder.addCase(claimNFT.pending, (state, { meta }) => {
      const { mintNFTPublicKey } =  meta.arg;
      console.log('current claim NFT', mintNFTPublicKey.toBase58())
      state.currentClaimNFT = mintNFTPublicKey.toBase58();
      state.claimProcessing = "processing";
      state.currentAction = 'claim';
    });
    builder.addCase(claimNFT.fulfilled, (state) => {
      state.claimProcessing = "processed";
      state.currentClaimNFT = null;
      state.currentAction = null;
    });
    builder.addCase(claimNFT.rejected, (state, action) => {
      state.currentClaimNFT = null;
      state.claimProcessing = "error";
      state.currentAction = null;
    });
    builder.addCase(claimSaleableNft.pending, (state, { meta }) => {
      const { mintNFTPublicKey } =  meta.arg;
      console.log('current claim NFT', mintNFTPublicKey.toBase58())
      state.currentClaimNFT = mintNFTPublicKey.toBase58();
      state.claimProcessing = "processing";
      state.currentAction = 'claim';
    });
    builder.addCase(claimSaleableNft.fulfilled, (state) => {
      state.claimProcessing = "processed";
      state.currentClaimNFT = null;
      state.currentAction = null;
    });
    builder.addCase(claimSaleableNft.rejected, (state, action) => {
      state.currentClaimNFT = null;
      state.claimProcessing = "error";
      state.currentAction = null;
    });
    builder.addCase(buyNft.pending, (state, { meta }) => {
      const { mintNFTPublicKey } =  meta.arg;
      console.log('current buy NFT', mintNFTPublicKey.toBase58())
      state.currentClaimNFT = mintNFTPublicKey.toBase58();
      state.claimProcessing = "processing";
      state.currentAction = 'buy';
    });
    builder.addCase(buyNft.fulfilled, (state) => {
      state.claimProcessing = "processed";
      state.currentClaimNFT = null;
      state.currentAction = null;
    });
    builder.addCase(buyNft.rejected, (state, action) => {
      state.currentClaimNFT = null;
      state.claimProcessing = "error";
      state.currentAction = null;
    });
  },
});

export default rewardListSlice;
