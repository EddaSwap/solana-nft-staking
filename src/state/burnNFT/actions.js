import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { burnNft as burnNftAPI } from "../../utils/staking";
import { logError } from "utils";

export const openBurnNFTModal = createAction("modal/openBurnNFTModal");
export const closeBurnNFTModal = createAction("modal/closeBurnNFTModal");

export const burnNft = createAsyncThunk(
  "nft/burnNft",
  async (params, thunkAPI) => {
    try {
      const response = await burnNftAPI(params);
      return response;
    } catch (error) {
      logError(error, params);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
