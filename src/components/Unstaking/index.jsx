import React, { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./index.module.scss";
import NFTCard from "../NFTCard";
import { getStakedNFTList } from "../../state/stakedNFT";

import { BUTTON_TYPE } from "../../utils";

const UnStaking = () => {
  const wallet = useWallet();
  const { stakedNFTList, loading, currentUnstakeNft } = useSelector(
    (state) => state.stakedNFT
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (wallet.publicKey && loading === "idle") {
      dispatch(getStakedNFTList({ wallet }));
    }
  }, [wallet, dispatch, loading]);

  console.log("staked nft list", stakedNFTList);

  let content = (
    <>
      <div className={styles.nftList}>
        {stakedNFTList.map((item, key) => {
          return (
            <NFTCard
              currentProcessKey={currentUnstakeNft}
              key={`market-unstake-card-${key}`}
              type={BUTTON_TYPE.UNSTAKE}
              {...item}
            />
          );
        })}
      </div>
    </>
  );

  if (loading === "loading") {
    content = (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingButton}>
          <p className={styles.loading}>Loading...</p>
        </div>
      </div>
    );
  } else if (loading === "loaded" && stakedNFTList.length === 0) {
    content = (
      <div className={styles.loadingContainer}>
        <p className={styles.loading}>You have no staked MadTrooper NFTs.</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0E0E0E" }} id="staking">
      <div className={styles.container}>
        <div className={styles.upper}>
          <div className={styles.headline}>
            <div className={styles.content}>Your Staked NFTs</div>
          </div>
        </div>
        {content}
        <div className={styles.buttonContainer}>
        <a
          href="/reward"
          color="transparent"
          className={styles.rewardButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          Claim Rewards
        </a>
      </div>
      </div>
    </div>
  );
};

export default UnStaking;
