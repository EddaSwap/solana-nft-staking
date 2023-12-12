import { createReducer } from "@reduxjs/toolkit";
import { closeSnackbar, enqueueSnackbar, removeSnackbar } from "./actions";
import { claimNFT, claimSaleableNft, buyNft } from "../rewardNFT";
import { stakeNft } from "../nft";
import { unstakeNft } from "../stakedNFT";
import { burnNft } from "../burnNFT/actions";

const initialState = {
  openSnackbar: false,
  notifications: [],
};

const getDefaultKey = () => {
  return new Date().getTime() + Math.random();
};

const generateNotifyData = (message, action) => {
  return {
    key: action.key || getDefaultKey(),
    message: message,
  };
};
export default createReducer(initialState, (builder) =>
  builder
    .addCase(enqueueSnackbar, (state, action) => {
      state.notifications = [
        ...state.notifications,
        {
          key: action.key || getDefaultKey(),
          ...action.payload,
        },
      ];
    })
    .addCase(closeSnackbar, (state, action) => {
      state.notifications = state.notifications.map((notification) =>
        notification.key === action.payload
          ? { ...notification, dismissed: true }
          : { ...notification }
      );
    })
    .addCase(removeSnackbar, (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.key !== action.payload
      );
    })
    .addCase(claimNFT.fulfilled, (state, action) => {
      state.notifications = [
        ...state.notifications,
        generateNotifyData("You have successfully claimed the NFT.", action),
      ];
    })
    .addCase(claimNFT.rejected, (state, action) => {
      state.notifications = [
        ...state.notifications,
        generateNotifyData(
          "NFT claiming has failed. Please try again.",
          action
        ),
      ];
    })
    .addCase(claimSaleableNft.fulfilled, (state, action) => {
      state.notifications = [
        ...state.notifications,
        generateNotifyData("You have successfully claimed the NFT.", action),
      ];
    })
    .addCase(claimSaleableNft.rejected, (state, action) => {
      state.notifications = [
        ...state.notifications,
        generateNotifyData(
          "NFT claiming has failed. Please try again.",
          action
        ),
      ];
    })
    .addCase(buyNft.fulfilled, (state, action) => {
      state.notifications = [
        ...state.notifications,
        generateNotifyData("You have successfully bought the NFT.", action),
      ];
    })
    .addCase(buyNft.rejected, (state, action) => {
      state.notifications = [
        ...state.notifications,
        generateNotifyData("NFT Buying has failed. Please try again.", action),
      ];
    })
    .addCase(stakeNft.fulfilled, (state, action) => {
      state.notifications = [
        ...state.notifications,
        generateNotifyData("You have successfully staked your NFT.", action),
      ];
    })
    .addCase(stakeNft.rejected, (state, action) => {
      state.notifications = [
        ...state.notifications,
        generateNotifyData("NFT staking failed. Please try again.", action),
      ];
    })
    .addCase(unstakeNft.fulfilled, (state, action) => {
      state.notifications = [
        ...state.notifications,
        generateNotifyData("You have successfully unstaked your NFT.", action),
      ];
    })
    .addCase(unstakeNft.rejected, (state, action) => {
      state.notifications = [
        ...state.notifications,
        generateNotifyData("NFT unstaking failed. Please try again.", action),
      ];
    })
    .addCase(burnNft.fulfilled, (state, action) => {
      state.notifications = [
        ...state.notifications,
        generateNotifyData("You have successfully burned your NFT. You will receive the real-world collectible at your doorstep shortly", action),
      ];
    })
    .addCase(burnNft.rejected, (state, action) => {
      state.notifications = [
        ...state.notifications,
        generateNotifyData("NFT burning failed. Please try again.", action),
      ];
    })
);
