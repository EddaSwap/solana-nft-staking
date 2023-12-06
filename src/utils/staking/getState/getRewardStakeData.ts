import { decodeRewardStakeData } from '../state/reward_stake.account';
import { PublicKey } from '@solana/web3.js';

async function getRewardStakeData(connection: any, rewardStakeAddress: string) {

  const storage = await connection.getAccountInfo(
    new PublicKey(rewardStakeAddress),
  );
  if (storage === null) {
    throw new Error('Error: cannot find storage account');
  }

  const data = decodeRewardStakeData(storage.data);
  console.log(`Reward stake data:`, data);

  return data;
}


export default getRewardStakeData;