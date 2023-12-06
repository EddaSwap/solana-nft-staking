import {decodeStakerData} from '../state/staker.account';
import { PublicKey } from '@solana/web3.js';


async function getStakerData(connection: any, stakerStorage: string ) {

  const storagePubkey = new PublicKey(stakerStorage);

  const storage = await connection.getAccountInfo(storagePubkey);
  if (storage === null) {
    throw new Error('Error: cannot find storage account');
  }

  const data = decodeStakerData(storage.data);
  console.log(`Staker data:`, data);

  console.log('Points', data.signedPoints());
  console.log('Pending Points', data.pendingPoints());
  console.log('Total Points', data.totalPoints());

  return data;
}

export default getStakerData;