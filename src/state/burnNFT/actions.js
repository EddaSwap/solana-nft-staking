import { createAction } from '@reduxjs/toolkit';

export const openBurnNFTModal = createAction('modal/openBurnNFTModal');
export const closeBurnNFTModal = createAction('modal/closeBurnNFTModal');
export const burnNFTSuccess = createAction('modal/burnNFTSuccess');