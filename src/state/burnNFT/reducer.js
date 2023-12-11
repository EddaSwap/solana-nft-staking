import { createReducer } from "@reduxjs/toolkit";
import {
  openBurnNFTModal,
  closeBurnNFTModal,
  burnNft,
} from "./actions";

const initialState = {
  isOpenModal: false,

  //for burn
  userInfo: {},
  wallet: null,
  currentBurnNFT: null,
  burnProcessing: "idle",
  burnError: "",
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(openBurnNFTModal, (state, action) => {
      console.log("action openBurnNFTModal", action);
      const { wallet, mintNFTPublicKey } = action.payload || {};
      state.wallet = wallet;
      state.currentBurnNFT = mintNFTPublicKey;
      state.isOpenModal = true;
      state.stakeError = null;
      state.userInfo = {};
    })
    .addCase(closeBurnNFTModal, (state, action) => {
      state.isOpenModal = false;
      state.currentBurnNFT = null;
      state.wallet = null;
      state.burnProcessing = "idle";
      state.userInfo = {};
    })
    .addCase(burnNft.pending, (state, action) => {
      state.burnProcessing = "processing";
      state.stakeError = null;
    })
    .addCase(burnNft.fulfilled, (state) => {
      state.burnProcessing = "processed";
      state.currentBurnNFT = null;
      state.stakeError = null;
    })
    .addCase(burnNft.rejected, (state, action) => {
      state.currentBurnNFT = null;
      state.burnProcessing = "error";
      state.stakeError = action.error.message;
    })
);
