import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import notify from './notify/reducer';
import pointSlice from './points';
import nft from './nft';
import stakedNFT from './stakedNFT';
import rewardNFT from './rewardNFT';
import stat from './stat';
import chooseNFT from './chooseNFT/reducer';
import burnNFT from './burnNFT/reducer';

const store = configureStore({
  reducer: {
    notify,
    points: pointSlice.reducer,
    NFT: nft.reducer,
    stakedNFT: stakedNFT.reducer,
    rewardNFT: rewardNFT.reducer,
    stakedStat: stat.reducer,
    chooseNFT: chooseNFT,
    burnNFT: burnNFT,
  },
  middleware: [...getDefaultMiddleware({ thunk: true })],
});

export default store;
