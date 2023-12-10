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

import { StakeArgs, STAKE_CONTRACT_SCHEMA } from "./state/contract";

import {
  checkProgram,
  getNftKeeper,
  getStakerStorage,
  findAssociatedTokenAddress,
  getManagementKey,
  getMetadataAddress,
  getExtendStakerStorage,
  getNftSettingKey,
} from "./services";

const BN = require("bn.js");

const TOKEN_AMOUNT = 1;

async function stakeNFT(
  connection: any,
  wallet: any,
  nftMintAccount: any,
  ataPublicKey: any,
  tokenType: Number = 0
) {

  console.log(`Let's stake an nft`, {
    nftMintAccount: nftMintAccount.toBase58(),
    ataPublicKey: ataPublicKey.toBase58(),
    tokenType
  });
  
  const staker = wallet.publicKey;
  const userAta = ataPublicKey;
  const programId = await checkProgram(connection);

  const mintMetadataAccount = await getMetadataAddress(nftMintAccount);
  console.log("metadata", mintMetadataAccount.toBase58());

  const managementStoragePubkey = await getManagementKey(programId);
  console.log(`Management storage: ${managementStoragePubkey}`);

  const keeper = await getNftKeeper(programId, nftMintAccount, staker);

  const keeperAta = await findAssociatedTokenAddress(keeper, nftMintAccount);

  const stakerStoragePubkey = await getStakerStorage(programId, staker);

  console.log(`Use staker storage: ${stakerStoragePubkey}`);

  const extendStakerStoragePubkey = await getExtendStakerStorage(
    programId,
    staker,
  );

  console.log("Keeper created:", keeper.toBase58());
  console.log(
    "Associated token account of keeper created",
    keeperAta.toBase58()
  );

  const nftSettingKey = await getNftSettingKey(programId);
  console.log(`Nft setting storage: ${nftSettingKey}`);

  const data = Buffer.from(
    borsh.serialize(
      STAKE_CONTRACT_SCHEMA,
      new StakeArgs({
        amount: new BN(TOKEN_AMOUNT),
        nft_type: new BN(tokenType),
      })
    )
  );

  const stakeInstruction = new TransactionInstruction({
    programId,
    data,
    keys: [
      { pubkey: nftMintAccount, isSigner: false, isWritable: true },
      { pubkey: mintMetadataAccount, isSigner: false, isWritable: false },
      { pubkey: staker, isSigner: true, isWritable: false },
      { pubkey: userAta, isSigner: false, isWritable: true },
      { pubkey: keeper, isSigner: false, isWritable: true },
      { pubkey: keeperAta, isSigner: false, isWritable: true },
      { pubkey: stakerStoragePubkey, isSigner: false, isWritable: true },
      { pubkey: extendStakerStoragePubkey, isSigner: false, isWritable: true },
      { pubkey: nftSettingKey, isSigner: false, isWritable: false },
      { pubkey: managementStoragePubkey, isSigner: false, isWritable: false },
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

  console.log("Sending staking transaction...");
  transactions.add(stakeInstruction);

  transactions.feePayer = wallet.publicKey || undefined;
  transactions.recentBlockhash = (
    await connection.getRecentBlockhash("max")
  ).blockhash;

  //signTransaction
  try {
    const _transaction = await wallet.signTransaction(transactions);
    const rawTransaction = _transaction.serialize();
    const signature = await connection.sendRawTransaction(rawTransaction);

    await connection.confirmTransaction(signature);
  } catch (ex) {
    console.log("Failed stake", ex);
    throw ex;
  }

  console.log("Success");
  return true;
}

export default stakeNFT;
