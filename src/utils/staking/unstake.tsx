import {
  SystemProgram,
  TransactionInstruction,
  Transaction,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import * as borsh from "borsh";

import { UnStakeArgs, STAKE_CONTRACT_SCHEMA } from "./state/contract";

import {
  checkProgram,
  getNftKeeper,
  getStakerStorage,
  findAssociatedTokenAddress,
} from "./services";

const BN = require("bn.js");

const TOKEN_AMOUNT = 1;

async function unstakeNFT(
  connection: any,
  wallet: any,
  nftMintAccount: any,
  ataPublicKey: any
) {
  console.log(`Let's unstake an nft`);

  const staker = wallet.publicKey;
  const userAta = ataPublicKey;

  const programId = await checkProgram(connection);

  const keeper = await getNftKeeper(programId, nftMintAccount, staker);
  const keeperAta = await findAssociatedTokenAddress(keeper, nftMintAccount);

  const stakerStoragePubkey = await getStakerStorage(programId, staker);

  console.log(`Use staker storage: ${stakerStoragePubkey}`);

  const amountArgs = { amount: new BN(TOKEN_AMOUNT) };
  const data = Buffer.from(
    borsh.serialize(STAKE_CONTRACT_SCHEMA, new UnStakeArgs(amountArgs))
  );

  const stakeInstruction = new TransactionInstruction({
    programId: programId,
    data,
    keys: [
      { pubkey: nftMintAccount, isSigner: false, isWritable: true },
      { pubkey: staker, isSigner: true, isWritable: false },
      { pubkey: userAta, isSigner: false, isWritable: true },
      { pubkey: keeper, isSigner: false, isWritable: true },
      { pubkey: keeperAta, isSigner: false, isWritable: true },
      { pubkey: stakerStoragePubkey, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      {
        pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    ],
  });

  const transactions = new Transaction();

  transactions.add(stakeInstruction);

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
    console.log("Failed unstake", ex);
    throw ex;
  }

  console.log("Success");
  return true;
}

export default unstakeNFT;
