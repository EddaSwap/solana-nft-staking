import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useWallet } from "@solana/wallet-adapter-react";
import { isMobile } from "react-device-detect";
import styles from "./index.module.scss";
import amountImg from "assets/img/amount.svg";
import { getPoints } from "../../state/points";
import { getStakedStatList } from "state/stat";
import MadtrooperIcon from "assets/img/madtrooper_small.png";

import Markets from "../Markets";

const BuyNow = ({ markets }) => {
  const wallet = useWallet();
  const { userPoints, loading } = useSelector((state) => {
    return state.points;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (wallet.publicKey && loading === "idle") {
      dispatch(getPoints({ wallet }));
    }
  }, [wallet, dispatch, loading]);

  const { statsList, loading: statsLoading } = useSelector((state) => {
    return state.stakedStat;
  });

  const { totalStaked } = statsList;

  useEffect(() => {
    if (statsLoading === "idle") {
      dispatch(getStakedStatList());
    }
  }, [dispatch, statsLoading]);

  if (isMobile) {
    return (
      <div className={styles.mobileContainer} id="earn-info">
        <p className={styles.mobileTitle}>Buy now</p>
        <Markets />
      </div>
    );
  }

  let totalStakedComponent = (
    <p className={styles.instructionText}>
      <br />
    </p>
  );

  if (totalStaked) {
    totalStakedComponent = (
      <p className={styles.instructionText}>
        Total {totalStaked} <img src={MadtrooperIcon} alt='madtrooper' height={25}/> NFTs staked till now.
      </p>
    );
  }
  return (
    <div className={styles.container} id="earn-info">
      <div className={styles.left}>
        <p className={styles.buyTitle}>Buy now</p>
        <Markets />
      </div>
      <div className={styles.right}>
        <div className={styles.instructionContainer}>
          <p className={styles.instructionText}>
            Stake upto 10 MadTrooper NFTs.
          </p>
          <p className={styles.instructionText}>
            Each MadTrooper NFT earns 1 Plomo every 24 hours.
          </p>
          {totalStakedComponent}
        </div>
        <div className={styles.infoContainerWrapper}>
          <div className={styles.infoContainer}>
            <div>
              <p className={styles.desc}>Plomo Available</p>
            </div>
            <div className={styles.pointContainer}>
              <img className={styles.img} src={amountImg} alt="amount" />
              <p className={styles.points}>{userPoints}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
