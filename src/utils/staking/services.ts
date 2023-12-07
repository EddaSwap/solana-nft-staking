
import {
  Connection,
  PublicKey,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import { STAKER_SEED, KEEPER_SEED } from './state/staker.account';
import { EXTEND_STAKER_SEED } from './state/extend_staker.account';
import { NFT_SETTING_SEED } from './state/nft_setting.account';

import {
  REWARD_STAKE_SEED,
  REWARD_KEEPER_SEED,
} from './state/reward_stake.account';
import { MANAGEMENT_SEED } from './state/management.account';
import {EXTEND_MANAGEMENT_SEED} from './state/extend_management.account';
import axios from 'axios';
import * as anchor from '@project-serum/anchor';
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  (process.env.REACT_APP_TOKEN_METADATA_PROGRAM_ID || '').toString()
);



const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new anchor.web3.PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

export const getTokenWallet = async (wallet: any, mint: any) => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    )
  )[0];
};



export const getPublicKey = (key: string) => {

  let publicKey = ''
  if (key === 'management_storage') {
    publicKey = process.env.REACT_APP_MANAGEMENT_STORAGE?.toString() || '';
  } else if (key === 'system_program') {
    publicKey = process.env.REACT_APP_PROGRAM_ID?.toString() || '';
  }
  return new PublicKey(publicKey);
}


export async function checkProgram(connection: Connection): Promise<PublicKey> {
  let programId
  // Read program id from keypair file
  try {
    programId = new PublicKey((process.env.REACT_APP_PROGRAM_ID)?.toString() || '');
  } catch (err) {
    const errMsg = (err as Error).message;
    throw new Error(
      `Failed to read program keypair due to error: ${errMsg}. Program may need to be deployed with \`solana program deploy dist/program/helloworld.so\``,
    );
  }

  // Check if the program has been deployed
  const programInfo = await connection.getAccountInfo(programId);
  if (programInfo === null) {
    throw new Error('Program needs to be built and deployed');
  } else if (!programInfo.executable) {
    throw new Error(`Program is not executable`);
  }
  console.log(`Using program ${programId.toBase58()}`);
  return programId;
}

export async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey,
): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )
  )[0];
}


export async function getStakerStoragePubkey(initializer: PublicKey, programId: PublicKey) {

  const stakerStorageSeeds = [
    Buffer.from(STAKER_SEED),
    initializer.toBuffer(),
  ];
  const [stakerStoragePubkey,] =
    await PublicKey.findProgramAddress(stakerStorageSeeds, programId);

  return stakerStoragePubkey;
}

export async function claimRewardToken_getAccounts(
  connection: Connection,
  initializer: PublicKey,
  programId: PublicKey,
  nftMintAccount: PublicKey,
  userAta: PublicKey,
): Promise<PublicKey[]> {

  const keeper = await getRewardKeeper(programId, nftMintAccount);

  const keeperAta = await findAssociatedTokenAddress(keeper, nftMintAccount);


  const stakePubkey = await getRewardStakeStorage(programId, nftMintAccount);

  console.log(`Use stake storage: ${stakePubkey}`);

  const managementStorage = getPublicKey('management_storage');

  const stakerStorageSeeds = [
    Buffer.from(STAKER_SEED),
    initializer.toBuffer(),
  ];
  const [stakerStoragePubkey,] =
    await PublicKey.findProgramAddress(stakerStorageSeeds, programId);
  console.log(`Use staker storage: ${stakerStoragePubkey}`);

  const stakerStorage = stakerStoragePubkey;

  return [
    keeper,
    nftMintAccount,
    userAta,
    keeperAta,
    stakePubkey,
    stakerStorage,
    managementStorage,
  ];
}

export const getRewardKeeper = async (
  programId: PublicKey,
  mint: PublicKey,
) => {
  const keeperSeeds = [Buffer.from(REWARD_KEEPER_SEED), mint.toBuffer()];
  const [keeper] = await PublicKey.findProgramAddress(
    keeperSeeds,
    programId,
  );

  return keeper;
};

export const getManagementKey = async (programId: PublicKey) => {
  const managementStorageSeeds = [Buffer.from(MANAGEMENT_SEED)];
  const [managementStoragePubkey] =
    await PublicKey.findProgramAddress(managementStorageSeeds, programId);

  return managementStoragePubkey;
};


export const getRewardStakeStorage = async (
  programId: PublicKey,
  mint: PublicKey,
) => {
  const stakeSeeds = [Buffer.from(REWARD_STAKE_SEED), mint.toBuffer()];
  const [stakePubkey, ] = await PublicKey.findProgramAddress(
    stakeSeeds,
    programId,
  );

  return stakePubkey;
};

export const getNftKeeper = async (
  programId: PublicKey,
  mint: PublicKey,
  staker: PublicKey,
) => {
  const keeperSeeds = [
    Buffer.from(KEEPER_SEED),
    staker.toBuffer(),
    mint.toBuffer(),
  ];
  const [keeper, ] = await PublicKey.findProgramAddress(
    keeperSeeds,
    programId,
  );

  return keeper;
};

export const getStakerStorage = async (
  programId: PublicKey,
  staker: PublicKey,
) => {
  const stakerStorageSeeds = [Buffer.from(STAKER_SEED), staker.toBuffer()];
  const [stakerStoragePubkey, ] =
    await PublicKey.findProgramAddress(stakerStorageSeeds, programId);

  return stakerStoragePubkey;
};

export const getMetadataAddress = async (
  mint: PublicKey,
): Promise<PublicKey> => {
  return (
    await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    )
  )[0];
};


export const getExtendManagementKey = async (programId: PublicKey) => {
  const storageSeeds = [Buffer.from(EXTEND_MANAGEMENT_SEED)];
  const [storagePubkey, ] = await PublicKey.findProgramAddress(
    storageSeeds,
    programId,
  );

  return storagePubkey;
};

export const getStakerMadtrooperAta = async (
  mad_owner: PublicKey,
  mad_address: PublicKey,
): Promise<PublicKey> => {
  const rpcUrl =  process.env.REACT_APP_SOLANA_RPC_HOST || "";
  const res = await axios.post(rpcUrl, {
    jsonrpc: '2.0',
    id: 1,
    method: 'getTokenAccountsByOwner',
    params: [
      mad_owner.toBase58(),
      {
        mint: mad_address.toBase58(),
      },
      {
        encoding: 'jsonParsed',
      },
    ],
  });

  if (res.data.result.value === 0) {
    throw new Error('Staker not own madtrooper');
  }

  const userAtaStr = res.data.result.value[0].pubkey;
  return new PublicKey(userAtaStr);
};

export const getReceiverMadtrooperAta = async (
  mad_owner: PublicKey,
  mad_address: PublicKey,
): Promise<PublicKey> => {
  try {
    const userAta = await getStakerMadtrooperAta(mad_owner, mad_address);
    return userAta;
  } catch (error) {
    const userAta = await findAssociatedTokenAddress(mad_owner, mad_address);
    return userAta;
  }
};


export const getNftSettingKey = async (programId: PublicKey) => {
  const seeds = [Buffer.from(NFT_SETTING_SEED)];
  const [pubKey, ] = await PublicKey.findProgramAddress(
    seeds,
    programId,
  );

  return pubKey;
};

export const getExtendStakerStorage = async (
  programId: PublicKey,
  staker: PublicKey,
) => {
  const stakerStorageSeeds = [
    Buffer.from(EXTEND_STAKER_SEED),
    staker.toBuffer(),
  ];
  const [extendStakerStoragePubkey, ] =
    await PublicKey.findProgramAddress(stakerStorageSeeds, programId);

  return extendStakerStoragePubkey;
};