import { PublicKey } from '@solana/web3.js';

import { decodeStakerData } from '../state/staker.account';
import { decodeExtendStakerData } from '../state/extend_staker.account';

import * as services from '../services';

async function getStakerData(connection: any, stakerStorage: string ) {

  const storagePubkey = new PublicKey(stakerStorage);

  const storage = await connection.getAccountInfo(storagePubkey);
  if (storage === null) {
    throw new Error('Error: cannot find storage account');
  }

  const data = decodeStakerData(storage.data);
  console.log(`Staker data:`, data);
  
  return data;
}

async function getPoints(connection: any, data: any, stakerPublicKey: string ) {
  const programId = await services.checkProgram(connection);

  let userPoints = 0;
  console.log(`Staker data:`, data);
  try {
    const extendStoragePubkey = await services.getExtendStakerStorage(
      programId,
      new PublicKey(stakerPublicKey)
    );
    const extendStakerStorage = await connection.getAccountInfo(
      extendStoragePubkey,
    );
    
    if (extendStakerStorage) {
      const extendData = decodeExtendStakerData(extendStakerStorage.data);
      console.log(`Extend staker data:`, extendData);
  
      console.log('Points', data.signedPoints());
      console.log(
        'Pending Points With NFT Type',
        data.pendingPointsWithNftType(extendData),
      );
      console.log(
        'Total Points With NFT Type',
        data.totalPointsWithNftType(extendData),
      );
      userPoints = data.totalPointsWithNftType(extendData)
    } else {
      console.log('Points', data.signedPoints());
      console.log('Pending Points', data.pendingPoints());
      console.log('Total Points', data.totalPoints());
      userPoints = data.totalPoints();
    }
  } catch(e) {
    console.log("Exceptiion get points", e);
  } finally {
    return userPoints;
  }
}


export default getStakerData;

export {
  getPoints,
  getStakerData
}