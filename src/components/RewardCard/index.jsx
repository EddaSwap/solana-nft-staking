import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import CardMedia from "@material-ui/core/CardMedia";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

import styles from "./index.module.scss";
import { enqueueSnackbar } from "../../state/notify/actions";
import {
  claimNFT,
  claimSaleableNft,
  buyNft,
  getRewardNFTList,
} from "../../state/rewardNFT";
import { getPoints } from "../../state/points";
import { BUTTON_TYPE } from "../../utils";
import { isEnoughSOLToBuy } from "../../utils/staking";
import { NFT_FILE_TYPE, TOTAL_SUPPLY_REWARD_NFT } from "../../constants/nft";
import ResponsiveDialog from "../ResponsiveDialog";

const generateDispatchAction = (action, postActionArr) => {
  return (params) => async (dispatch) => {
    try {
      await dispatch(action(params));
      postActionArr.forEach((postAction) => {
        dispatch(postAction(params));
      });
    } catch (exception) {
      console.log("Exception while processing", exception);
    }
  };
};

const claimAndReload = generateDispatchAction(claimNFT, [
  getRewardNFTList,
  getPoints,
]);

const claimSaleableAndReload = generateDispatchAction(claimSaleableNft, [
  getRewardNFTList,
  getPoints,
]);

const buyAndReload = generateDispatchAction(buyNft, [
  getRewardNFTList,
  getPoints,
]);

const VideoModal = ({ video_url, handleClose, open }) => {
  return (
    <ResponsiveDialog handleClose={handleClose} open={open} maxWidth="lg">
      <CardMedia
        image={video_url}
        src={video_url}
        component={"iframe"}
        style={{ height: "100%" }}
        allowFullScreen
      />
    </ResponsiveDialog>
  );
};

const NftCard = (props) => {
  const [openModal, setOpenModal] = useState(false);

  const {
    mintKey,
    metaData,
    points,
    type,
    currentProcessKey,
    total,
    price,
    currentAction,
  } = props;

  const fileType = metaData?.properties?.category;
  const isVideo = fileType === NFT_FILE_TYPE.VIDEO;

  const { userPoints } = useSelector((state) => state.points);
  const dispatch = useDispatch();
  const { image, name, properties } = metaData || {};

  let nftTotal = total || 0;

  let video_url = (metaData && metaData.animation_url) || "";
  try {
    video_url = properties?.files?.[0]?.uri;
  } catch (ex) {
    console.log("error get video_url", ex);
  }

  const wallet = useWallet();

  let claimButtonStyle = {};
  let buyButtonStyle = {};
  let claimButtonText = "REDEEM";
  let buyButtonText = "BUY";

  let redeemAction = async () => {
    if (type === BUTTON_TYPE.GET_REWARD) {
      console.log(
        `user point ${userPoints} claim nft which has point ${points}`
      );
      if (parseInt(userPoints) < parseInt(points)) {
        dispatch(
          enqueueSnackbar({
            message: `You do not have enough points to claim.`,
          })
        );
        return;
      }
    }

    try {
      const action = price ? claimSaleableAndReload : claimAndReload;
      //normal case
      dispatch(
        action({
          wallet,
          mintNFTPublicKey: new PublicKey(mintKey),
        })
      );
    } catch (exception) {}
  };

  let actionBuy = async () => {
    const isEnough = await isEnoughSOLToBuy({ wallet, price });
    if (!isEnough) {
      dispatch(
        enqueueSnackbar({
          message: `You do not have enough SOL to buy.`,
        })
      );
      return;
    }

    try {
      dispatch(
        buyAndReload({
          wallet,
          mintNFTPublicKey: new PublicKey(mintKey),
        })
      );
    } catch (exception) {}
  };

  const onShowVideoModal = () => {
    setOpenModal(true);
  };

  if (currentProcessKey === mintKey && mintKey) {
    //avoid any action while processing
    if (currentAction === "claim") {
      claimButtonText = "PROCESSING";
      buyButtonStyle = { background: "grey" };
    } else {
      buyButtonText = "PROCESSING";
      claimButtonStyle = { background: "grey" };
    }
    redeemAction = null;
    actionBuy = null;
  } else if (currentProcessKey || !mintKey) {
    claimButtonStyle = { background: "grey" };
    buyButtonStyle = { background: "grey" };
    redeemAction = null;
    actionBuy = null;
  }

  if (!image) {
    return null;
  }

  const rewardText = price
    ? `${points} Plomo or ${price} SOL`
    : `${points} Plomo`;

  let buttonComponent = (
    <button
      className={styles.stakeButton}
      onClick={redeemAction}
      style={claimButtonStyle}
    >
      {claimButtonText}
    </button>
  );

  if (price) {
    buttonComponent = (
      <div className={styles.buyButtonContainer}>
        <button
          className={styles.buyButton}
          onClick={redeemAction}
          style={claimButtonStyle}
        >
          {claimButtonText}
        </button>
        <button
          className={styles.buyButton}
          onClick={actionBuy}
          style={buyButtonStyle}
        >
          {buyButtonText}
        </button>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <div style={{ position: "relative" }}>
        <img
          src={image}
          className={styles.nftImage}
          alt=""
          onClick={onShowVideoModal}
        ></img>
        {isVideo && (
          <PlayArrowIcon
            className={styles.playVideoButton}
            onClick={onShowVideoModal}
          />
        )}
      </div>

      <p className={styles.name}>{name}</p>
      <div className={styles.rewardInfoBoxContainer}>
        <div className={styles.rewardInfoBox}>
          Total: {TOTAL_SUPPLY_REWARD_NFT[name]}
        </div>
        <div className={styles.rewardInfoBox}>Left: {nftTotal}</div>
      </div>
      {buttonComponent}
      {!!points && <div className={styles.reward}>{rewardText}</div>}
      {isVideo && (
        <VideoModal
          video_url={video_url}
          open={openModal}
          handleClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default NftCard;
