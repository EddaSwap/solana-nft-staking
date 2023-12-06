import React, { useEffect } from "react";

import styles from "./index.module.scss";

import NFTCard from "../NFTCard";

import { useWallet } from "@solana/wallet-adapter-react";

import { useSelector, useDispatch } from "react-redux";

import { getNFTList } from "../../state/nft";
import { BUTTON_TYPE } from "utils";
import { getPoints } from "../../state/points";

const Staking = () => {
  const wallet = useWallet();
  const dispatch = useDispatch();

  const data = useSelector((state) => state.NFT);
  const stakedData = useSelector((state) => state.stakedNFT);

  const { nftList, loading, currentStakeNft } = data;

  useEffect(() => {
    if (wallet.publicKey && loading === "idle") {
      dispatch(getPoints({ wallet }));
      dispatch(getNFTList({ wallet }));
    }
  }, [wallet, dispatch, loading]);

  let content = (
    <div className={styles.nftList}>
      {nftList.map((item, key) => {
        return (
          <NFTCard
            currentProcessKey={currentStakeNft}
            key={`market-stake-card-${key}`}
            {...item}
            type={BUTTON_TYPE.STAKE}
          />
        );
      })}
    </div>
  );

  if (loading === "loading" || stakedData.loading === 'loading') {
    content = (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingButton}>
          <p className={styles.loading}>Loading...</p>
        </div>
      </div>
    );
  } else if (loading === "loaded" && nftList.length === 0) {
    content = (
      <div className={styles.loadingContainer}>
        <p className={styles.loading}>You don't have any MadTrooper NFTs.</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0E0E0E" }} id="staking">
      <div className={styles.container}>
        <div className={styles.upper}>
          <div className={styles.headline}>
            <div className={styles.content}>Your MadTrooper NFTs</div>
          </div>
        </div>
        {content}
      </div>
    </div>
  );
};

export default Staking;
