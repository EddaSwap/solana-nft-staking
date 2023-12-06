import axios from "axios";
import * as anchor from "@project-serum/anchor";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import stake from "./stake";
import unstake from "./unstake";
import claim from './claim';
import claimSaleable from './claim_saleable_reward';
import getStats from './stats';
import buy from './buy_reward';

import getStakedNFT from "./getStaked";
import getManagementData from "./getState/getManagementData";
import getExtendManagementData from "./getState/getExtendManagementData";
import getRewardStakeData from "./getState/getRewardStakeData";
import { STAKER_STORAGE_SIZE } from './state/staker.account';

import madTrooperMintList from './mintList';


const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new anchor.web3.PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const web3 = require("@solana/web3.js");
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;
const connection = new anchor.web3.Connection(rpcHost);
const MADTROOPER_CREATOR_ADDRESS = process.env.REACT_APP_MADTROOPER_CREATOR;

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  process.env.REACT_APP_TOKEN_METADATA_PROGRAM_ID
);



const SolanaNFTType = {
  METAPLEX: "METAPLEX",
  STAR_ATLAS: "STAR_ATLAS",
};

const getTokenWallet = async (mintKey) => {
  try {
    const response = await connection.getTokenLargestAccounts(mintKey)
    const addressList = response.value || [];
    let returnPublicKey = null;
    
    for(let i = 0; i < addressList.length; i++ ) {
      const addressData = addressList[i];
      if (addressData.amount == 1) {
        return addressData.address;
      }
    }

    return returnPublicKey;
  } catch(error) {
    console.log('error getTokenWallet', error);
    throw error;
  }
 
};

const getTokenOwner = async (userPublicKey, mintKey) => {
  try {

    const response = await connection.getTokenAccountsByOwner(userPublicKey, { mint: mintKey } );
    const address = response.value[0].pubkey.toBase58();

    return address;
  } catch(error) {
    console.log('error getTokenWallet', error);
    throw error;
  }
 
};

const getTokenWalletForClaim = async (wallet, mint) => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
}

const _utf8ArrayToNFTType = (array) => {
  const str = new TextDecoder().decode(array);
  const query = "https://";
  const startIndex = str.indexOf(query);

  // metaplex standard nfts live in arweave, see link below
  // https://github.com/metaplex-foundation/metaplex/blob/81023eb3e52c31b605e1dcf2eb1e7425153600cd/js/packages/web/src/contexts/meta/processMetaData.ts#L29
  const isMetaplex = str.includes("arweave");

  // star atlas nfts live in https://galaxy.staratlas.com/nfts/...
  const isStarAtlas = str.includes("staratlas");

  const isInvalid = (!isMetaplex && !isStarAtlas) || startIndex === -1;
  if (isInvalid) {
    return null;
  }

  const suffix = isMetaplex ? "/" : "/nfts/";
  const suffixIndex = str.indexOf(suffix, startIndex + query.length);
  if (suffixIndex === -1) {
    return null;
  }

  const hashLength = isMetaplex ? 43 : 44;
  const endIndex = suffixIndex + suffix.length + hashLength;

  const url = str.substring(startIndex, endIndex);
  return {
    type: isMetaplex ? SolanaNFTType.METAPLEX : SolanaNFTType.STAR_ATLAS,
    url,
  };
};

const getMetaData = async (mintKeys = []) => {
  const addresses = await Promise.all(
    mintKeys.map(async (mintKey) => {
      const _mintAddr = await web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          new web3.PublicKey(mintKey).toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );
      return _mintAddr[0];
    })
  );

  const accountInfos = await connection.getMultipleAccountsInfo(addresses);
  const nonNullInfos = accountInfos?.filter(Boolean) ?? [];
  const metadataUrls = nonNullInfos.map((x) => _utf8ArrayToNFTType(x.data));
  const results = await Promise.all(
    metadataUrls.map(async (item) => {
      if (!item) {
        return null;
      }
      return axios
        .get(item.url)
        .then((res) => res.data)
        .catch(() => null);
    })
  );

  return results;
};

const stakeNft = async ({ wallet, mintNFTPublicKey }) => {
  console.log('call api stakeNFT');
  
  const ataPublicKey = await getTokenWallet( mintNFTPublicKey);
  return stake(connection, wallet, mintNFTPublicKey, ataPublicKey);
};

const unStakeNft = async ({ wallet, mintNFTPublicKey }) => {
  console.log('call api unStakeNft');
  
  const ataPublicKey = await getTokenOwner(wallet.publicKey, mintNFTPublicKey);
  return unstake(connection, wallet, mintNFTPublicKey, ataPublicKey);
};

const claimNft = async ( { wallet, mintNFTPublicKey}) => {
  const ataPublicKey = await getTokenWalletForClaim(wallet.publicKey, mintNFTPublicKey);
  console.log('claimNft',mintNFTPublicKey.toBase58(), ataPublicKey.toBase58());
  return claim(connection, wallet, mintNFTPublicKey, ataPublicKey);
};

const claimSaleableNft = async ( { wallet, mintNFTPublicKey}) => {
  const ataPublicKey = await getTokenWalletForClaim(wallet.publicKey, mintNFTPublicKey);
  console.log('claimSaleableNft',mintNFTPublicKey.toBase58(), ataPublicKey.toBase58());
  return claimSaleable(connection, wallet, mintNFTPublicKey, ataPublicKey);
};

const buyNft = async ( { wallet, mintNFTPublicKey}) => {
  const ataPublicKey = await getTokenWalletForClaim(wallet.publicKey, mintNFTPublicKey);
  console.log('buyNft',mintNFTPublicKey.toBase58(), ataPublicKey.toBase58());
  return buy(connection, wallet, mintNFTPublicKey, ataPublicKey);
};


const getSLPTokenList = async ({wallet}) => {
  const { publicKey } = wallet;

  console.log('call api getSLPTokenList');

  const wallets = [publicKey.toBase58()];
  const tokenAccountsByOwnerAddress = await Promise.all(
    wallets.map(async (address) =>
      connection.getParsedTokenAccountsByOwner(new web3.PublicKey(address), {
        programId: new web3.PublicKey(TOKEN_PROGRAM_ID),
      })
    )
  );

  let potentialNFTsByOwnerAddress = tokenAccountsByOwnerAddress
    .map((ta) => ta.value)
    .map((value, i) => {
      const mintAddresses = value
        .map((v) => ({
          mint: v.account.data.parsed.info.mint,
          tokenAmount: v.account.data.parsed.info.tokenAmount,
        }))
        .filter(({ tokenAmount }) => {
          // Filter out the token if we don't have any balance
          const ownsNFT = tokenAmount.amount !== "0";
          // Filter out the tokens that don't have 0 decimal places.
          // NFTs really should have 0
          const hasNoDecimals = tokenAmount.decimals === 0;
          return ownsNFT && hasNoDecimals;
        })
        .map(({ mint }) => mint);
      return mintAddresses;
    });

  const mintList = [];

  potentialNFTsByOwnerAddress.forEach((itemList) => {
    mintList.push(...itemList);
  });

  let returnList = await Promise.all(
    mintList.map(async (mintKey) => {
      const metaData = await getMetaData([mintKey]);
      return {
        mintKey: mintKey,
        metaData: metaData && metaData[0],
      };
    })
  );
  
  //filter madtrooper nft by creator address
  returnList = returnList.filter(item => {
    const creator = item?.metaData?.properties?.creators?.[0]?.address;
    const { mintKey } = item;

    let isInValidList = true;
    if(process.env.REACT_APP_ENV === 'production') {
      isInValidList  = madTrooperMintList.includes(mintKey);
    }

    return (creator === MADTROOPER_CREATOR_ADDRESS) && isInValidList;  
  })

  return returnList;
};

const getStakedNFTData = async ({wallet}) => {

  const { publicKey } = wallet;

  console.log('call api getStakedNFTData');

  const stakedData = await getStakedNFT(connection, publicKey);
  let stakedNFTList = stakedData.stakedNFTList;
  stakedNFTList = await Promise.all(
    stakedNFTList.map(async (mintKey) => {
      const metaData = await getMetaData([mintKey]);
      return {
        mintKey: mintKey,
        metaData: metaData && metaData[0],
      };
    })
  );
  
  console.log("stakedNFTList", stakedNFTList);
  return {
    stakedNFTList,
  };
};

const getRewardNFTList = async () => {
  console.log('call api getRewardNFTList');

  const managementData = await getManagementData(connection);
  const extendManagementData = await getExtendManagementData(connection);

  const rewardStakes =  managementData.reward_stakes;
  const extendRewardStakes = extendManagementData.reward_stakes;

  let rewardNFTList = null;
  rewardNFTList = await Promise.all(
    rewardStakes.map(async (rewardStake) => {
      const rewardStakeData = await getRewardStakeData(connection, rewardStake);
      return {
        mintKey: rewardStakeData.mint_address,
        points: rewardStakeData.points_per_token.toString(10),
      }
    })
  );

  const extendRewardNFTList = extendRewardStakes.map(item => {
    return {
      mintKey: item.mint_address,
      points: item.points_per_token.toString(10),
      price: item.price.toString(10)/Math.pow(10,9),
    }
  })
  
  rewardNFTList = await Promise.all(
    [...rewardNFTList, ...extendRewardNFTList].map(async (item) => {
      const { mintKey }  = item;
      const metaData = await getMetaData([mintKey]);
      return {
        mintKey: mintKey,
        points: item.points,
        price: item.price || 0,
        metaData: metaData && metaData[0],
      };
    })
  );
  console.log('rewardNFTList', rewardNFTList);
  return rewardNFTList;
};

const getPoints  = async ({wallet}) => {
  const { publicKey } = wallet;
  
  console.log('call api getPoints');
  try {
    const stakedData = await getStakedNFT(connection, publicKey);
    const { userPoints, noStakedAccount } = stakedData;
    return {
      userPoints,
      isFirstStake: noStakedAccount,
    };
  } catch (error) {
    console.log('error get point', error);
    return {
      userPoints: 0,
      isFirstStake: false,
    };
  }
}

const getStakeStats = async () => {

  const result = await getStats(connection);


  return result;
}


const isEnoughSOLToBuy = async ({wallet, price}) => {
  let fees = 0;
    const { feeCalculator } = await connection.getRecentBlockhash();
    fees += price * LAMPORTS_PER_SOL;
    fees += feeCalculator.lamportsPerSignature * 10;

    const userBalance = await connection.getBalance(wallet.publicKey);
    console.log("Require fee", fees/LAMPORTS_PER_SOL);
    console.log("User Balance", userBalance/LAMPORTS_PER_SOL);
    return (userBalance >= fees);
}

const getFirstStakeInfo = async ({wallet}) => {
  let fees = 0;
  const {feeCalculator} = await connection.getRecentBlockhash();

  fees += await connection.getMinimumBalanceForRentExemption(STAKER_STORAGE_SIZE);

  fees += feeCalculator.lamportsPerSignature * 10; 

  const userBalance = await connection.getBalance(wallet.publicKey);
  console.log("Require fee to stake", fees/LAMPORTS_PER_SOL);
  console.log("User Balance", userBalance/LAMPORTS_PER_SOL);
  return {
    isEnoughSol: (userBalance >= fees),
    minSol: fees/LAMPORTS_PER_SOL,
  }
}

export {
  stakeNft,
  unStakeNft,
  claimNft,
  claimSaleableNft,
  buyNft,
  getSLPTokenList,
  getStakedNFTData,
  getRewardNFTList,
  getPoints,
  getStakeStats,
  isEnoughSOLToBuy,
  getFirstStakeInfo,
};
