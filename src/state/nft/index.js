import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { getSLPTokenList as getNFTAPI, stakeNft as stakeNftAPI } from "../../utils/staking";
import { logError } from 'utils'; 

export const getNFTList = createAsyncThunk(
  "nft/getNFTList",
  async (params, thunkAPI) => {
    try {
      const response = await getNFTAPI(params);
      return response;
    } catch (error) {
      logError(error, params);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
export const stakeNft = createAsyncThunk(
  "nft/stakeNft",
  async (params, thunkAPI) => {
    try {
      const response = await stakeNftAPI(params);
      return response;
    } catch (error) {
      logError(error, params);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const nftListlice = createSlice({
  name: "nft",
  initialState: {
    nftList: [],
    loading: "idle",
    error: "",
    //for stake
    stakeProcessing: 'idle',
    currentStakeNft: null,
    stakeError: '',
    
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNFTList.pending, (state) => {
      state.nftList = [];
      state.loading = "loading";
    });
    builder.addCase(getNFTList.fulfilled, (state, { payload }) => {
      state.nftList = payload;
      state.loading = "loaded";
    });
    builder.addCase(getNFTList.rejected, (state, action) => {
      state.nftList = [];
      state.loading = "error";
      state.error = action.error.message;
    });
    builder.addCase(stakeNft.pending, (state, { meta }) => {
      const { mintNFTPublicKey } =  meta.arg;
      console.log('current stake NFT', mintNFTPublicKey.toBase58())
      state.currentStakeNft = mintNFTPublicKey.toBase58();
      state.stakeProcessing = "processing";
      state.stakeError = null;
    });
    builder.addCase(stakeNft.fulfilled, (state) => {
      state.stakeProcessing = "processed";
      state.currentStakeNft = null;
      state.stakeError = null;
    });
    builder.addCase(stakeNft.rejected, (state, action) => {
      state.currentStakeNft = null;
      state.stakeProcessing = "error";
      state.stakeError = action.error.message;
    });
  },
});

export default nftListlice;
