
import {
  SystemProgram,
  TransactionInstruction,
  Transaction,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import * as borsh from 'borsh';

import { ClaimSaleableRewardArgs, STAKE_CONTRACT_SCHEMA } from './state/contract';

import {
  checkProgram,
  getRewardKeeper,
  findAssociatedTokenAddress,
  getExtendManagementKey,
  getStakerStorage,
  getExtendStakerStorage,
} from './services';
const BN = require('bn.js');


const TOKEN_AMOUNT = 1;

async function claimBuyable(
  connection: any,
  wallet: any,
  nftPublicKey: any,
  ataPublicKey: any
) {
  console.log(`Let's claim an buyable nft`);


  const staker = wallet.publicKey;
  const programId = await checkProgram(connection);
  const rewardPubkey = nftPublicKey;

  const userAta = ataPublicKey;
  console.log(`StakerAta for reward token: ${userAta}`);

  const keeper = await getRewardKeeper(programId, rewardPubkey);
  const keeperAta = await findAssociatedTokenAddress(keeper, rewardPubkey);
  
  const extendManagementStorage = await getExtendManagementKey(programId);
  
  const stakerStorage = await getStakerStorage(programId, staker);
  
  const extendStakerStoragePubkey = await getExtendStakerStorage(
    programId,
    staker,
  );

  const data = Buffer.from(
    borsh.serialize(
      STAKE_CONTRACT_SCHEMA,
      new ClaimSaleableRewardArgs({
        amount: new BN(TOKEN_AMOUNT),
      }),
    ),
  );

  const instruction = new TransactionInstruction({
    programId,
    data,
    keys: [
      { pubkey: rewardPubkey, isSigner: false, isWritable: true },
      { pubkey: staker, isSigner: true, isWritable: false },
      { pubkey: userAta, isSigner: false, isWritable: true },
      { pubkey: keeper, isSigner: false, isWritable: true },
      { pubkey: keeperAta, isSigner: false, isWritable: true },
      { pubkey: stakerStorage, isSigner: false, isWritable: true },
      { pubkey: extendStakerStoragePubkey, isSigner: false, isWritable: true },
      { pubkey: extendManagementStorage, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    ],
  });

  const transactions = new Transaction();

  console.log('Sending claim transaction...');
  transactions.add(instruction);
  transactions.feePayer = wallet.publicKey || undefined;
  transactions.recentBlockhash = (
    await connection.getRecentBlockhash("max")
  ).blockhash;


  try {
    //signTransaction
    const _transaction = await wallet.signTransaction(transactions);
    const rawTransaction = _transaction.serialize();
    const signature = await connection.sendRawTransaction(rawTransaction);

    await connection.confirmTransaction(signature);
  } catch (ex) {
    console.log("Failed claim", ex);
    throw ex;
  }

  console.log('Success');

  return true;
}


export default claimBuyable;