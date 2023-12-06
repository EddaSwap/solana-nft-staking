import { decodeStakeData } from '../state/stake.account';
import { PublicKey } from '@solana/web3.js';

async function getStakerData(connection: any, stakeAddress: string) {

  const storage = await connection.getAccountInfo(new PublicKey(stakeAddress));
  if (storage === null) {
    throw 'Error: cannot find storage account';
  }

  const data = decodeStakeData(storage.data);

  console.log(`Stake data:`, data);
  return data;
}

export default getStakerData;