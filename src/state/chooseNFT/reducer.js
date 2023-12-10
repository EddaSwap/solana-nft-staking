import { createReducer } from "@reduxjs/toolkit";
import { openChooseNFTModal, closeChooseNFTModal } from "./actions";

const initialState = {
  isOpenModal: false
};


export default createReducer(initialState, (builder) =>
  builder
    .addCase(openChooseNFTModal, (state, action) => {
      state.isOpenModal = true;
    })
    .addCase(closeChooseNFTModal, (state, action) => {
      state.isOpenModal = false;
    })
);
