import {
  checkProgram,
  getStakerStoragePubkey,
} from "./services";

import getStakerData from "./getState/getStakerData";

async function getStakedNFT(connection: any, publicKey: any) {
  let userPoints = '0';
  let returnList = [];
  try {
    const initializer = publicKey;
    const programId = await checkProgram(connection);
    const stakerStoragePubkey = await getStakerStoragePubkey(
      initializer,
      programId
    );

    const stakerData = await getStakerData(
      connection,
      stakerStoragePubkey.toBase58()
    );

    const { stakes } = stakerData;

    userPoints = stakerData.totalPoints().toString();
    
    for (let i = 0; i < stakes.length; i++) {
      const stakeData = stakes[i];
      
      const nftAddress = stakeData.nft_address;
      //const associatedAccount = stakeData.associated_account;
      returnList.push(nftAddress);
    }
    console.log("getStakedNFT return", returnList);
    return {
      userPoints,
      stakedNFTList: returnList,
      noStakedAccount: false,
    };
  } catch (error) {
    console.log("error getStakedNFT", error);
    return {
      userPoints,
      stakedNFTList: returnList,
      noStakedAccount: true,
    };
  }
}

export default getStakedNFT;
