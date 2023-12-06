
import {
  SystemProgram,
  TransactionInstruction,
  Transaction,
  SYSVAR_RENT_PUBKEY,

} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import * as borsh from 'borsh';

import { BuyRewardArgs, STAKE_CONTRACT_SCHEMA } from './state/contract';

import {
  checkProgram,
  getRewardKeeper,
  findAssociatedTokenAddress,
  getExtendManagementKey,
} from './services';

const BN = require('bn.js');

const TOKEN_AMOUNT = 1;

export default async function buy(connection: any,
  wallet: any,
  nftPublicKey: any,
  ataPublicKey: any) {

  const buyer = wallet.publicKey;
  const programId = await checkProgram(connection);

  const rewardPubkey = nftPublicKey;
  const buyerAta = ataPublicKey
  console.log(`buyer ata for reward token: ${buyerAta}`);

  const keeper = await getRewardKeeper(programId, rewardPubkey);
  const keeperAta = await findAssociatedTokenAddress(keeper, rewardPubkey);

  const extendManagementStorage = await getExtendManagementKey(programId);

  const treasuryAccount = process.env.REACT_APP_TREASURY;
  const data = Buffer.from(
    borsh.serialize(
      STAKE_CONTRACT_SCHEMA,
      new BuyRewardArgs({
        amount: new BN(TOKEN_AMOUNT),
      }),
    ),
  );

  const instruction = new TransactionInstruction({
    programId,
    data,
    keys: [
      { pubkey: rewardPubkey, isSigner: false, isWritable: true },
      { pubkey: buyer, isSigner: true, isWritable: false },
      { pubkey: buyerAta, isSigner: false, isWritable: true },
      { pubkey: keeper, isSigner: false, isWritable: true },
      { pubkey: keeperAta, isSigner: false, isWritable: true },
      { pubkey: treasuryAccount, isSigner: false, isWritable: true },
      { pubkey: extendManagementStorage, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
  });


  const transactions = new Transaction();

  console.log('Sending buy transaction...');
  
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
    console.log("Failed buy", ex);
    throw ex;
  }

  console.log('Success');

  return true;
}