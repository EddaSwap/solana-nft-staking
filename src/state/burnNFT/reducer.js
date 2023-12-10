import { createReducer } from "@reduxjs/toolkit";
import { openBurnNFTModal, closeBurnNFTModal, burnNFTSuccess } from "./actions";

const initialState = {
  isOpenModal: false,
  currentNFT: null,
};


export default createReducer(initialState, (builder) =>
  builder
    .addCase(openBurnNFTModal, (state, action) => {
      state.isOpenModal = true;
    })
    .addCase(closeBurnNFTModal, (state, action) => {
      state.isOpenModal = false;
    })
    .addCase(burnNFTSuccess, (state, action) => {
      state.isOpenModal = false;
    })
);
