import React from "react";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import styles from "./index.module.scss";
import { useWallet } from "@solana/wallet-adapter-react";

import { enqueueSnackbar } from "../../state/notify/actions";
import { getNFTList, stakeNft } from "../../state/nft";
import { getStakedNFTList, unstakeNft } from "../../state/stakedNFT";
import { getPoints } from "../../state/points";

import { PublicKey } from "@solana/web3.js";
import { getButtonText, BUTTON_TYPE, getNFTStakingType } from "../../utils";
import { getFirstStakeInfo } from '../../utils/staking';

const generateDispatchAction = (action, postActionArr) => {
  return (params) => async (dispatch) => {
    try {
      await dispatch(action(params));
      postActionArr.forEach((postAction) => {
        dispatch(postAction(params));
      });
    } catch (exception) {
      console.log("exception while processing", exception);
    }
  };
};

const stakeAndReload = generateDispatchAction(stakeNft, [
  getNFTList,
  getStakedNFTList,
  getPoints,
]);
const unStakeAndReload = generateDispatchAction(unstakeNft, [
  getNFTList,
  getStakedNFTList,
  getPoints,
]);

const getButtonAction = (type) => {
  // eslint-disable-next-line default-case
  switch (type) {
    case BUTTON_TYPE.STAKE:
      return stakeAndReload;
    case BUTTON_TYPE.UNSTAKE:
      return unStakeAndReload;
  }
};

const MAX_STAKE_PER_WALLET = 10;

const NftCard = (props) => {
  const { mintKey, metaData, points, type, currentProcessKey } = props;

  const collection = metaData?.collection?.name;
  const { stakedNFTList } = useSelector((state) => state.stakedNFT);
  const { isFirstStake } = useSelector(state=>state.points);

  const dispatch = useDispatch();
  const { image, name } = metaData || {};
  
  const wallet = useWallet();

  let buttonStyle= {};
  let buttonText = getButtonText(type);
  let buttonAction = async () => {
    if (type === BUTTON_TYPE.STAKE) {
      if (stakedNFTList.length >= MAX_STAKE_PER_WALLET) {
        dispatch(enqueueSnackbar({ message:  `You can stake a maximum of ${MAX_STAKE_PER_WALLET} NFTs per wallet.  Thank you.`}));
        return;
      }
      const  {
        isEnoughSol,
        minSol
      } = await getFirstStakeInfo({wallet});
    
      if (isFirstStake && !isEnoughSol) {
        dispatch(
          enqueueSnackbar({
            message: `You do not have enough SOL for the first stake. Minimum balance required is ${(Math.ceil(minSol*1000)*1.0/1000).toFixed(3)} SOL.`,
          })
        );
        return;
      }
    }


    try {
      const params = {
        wallet,
        mintNFTPublicKey: new PublicKey(mintKey),

      }

      if(type === BUTTON_TYPE.STAKE) {
        const typeAttribute = ((metaData.attributes || []).find(attr => attr['trait_type'] === 'type')) || {};
        const NFTType = typeAttribute.value;
        params.tokenType = getNFTStakingType(NFTType);
      }

      const action = getButtonAction(type);
      dispatch(
        action(params)
      );
    } catch (exception) {
      console.log('Exception when click card', exception)
    }
  };

  if (currentProcessKey === mintKey) {
    //avoid any action while processing
    buttonText = "PROCESSING";
    buttonAction = null;
  } else if(currentProcessKey) {
    buttonStyle = {background: 'grey'}
    buttonAction = null;
  }

  if (!image) {
    return null;
  }

  return (
    <div className={styles.container}>
      <img src={image} className={styles.nftImage} alt=""></img>
      <p className={styles.name}>{name}</p>
      <p className={styles.collection}>
        {collection}
      </p>
      <button className={styles.stakeButton} onClick={buttonAction} style={buttonStyle}>
        {buttonText}
      </button>
      {!!points && (
        <div className={styles.reward} onClick={buttonAction}>
          {`Reward: ${points} points`}
        </div>
      )}
    </div>
  );
};

export default NftCard;
