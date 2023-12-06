import React, { useEffect } from "react";
import { isMobile } from "react-device-detect";
import { useSelector, useDispatch } from "react-redux";
import { useWallet } from "@solana/wallet-adapter-react";

import styles from "./index.module.scss";
import amountImg from "assets/img/amount.svg";
import { getPoints } from "../../state/points";


const EarnInfo = () => {
  const wallet = useWallet();
  const { userPoints, loading } = useSelector((state) => {
    return state.points});
  const dispatch = useDispatch();

  useEffect(() => {
    if (wallet.publicKey && loading === 'idle') {
        dispatch(getPoints({wallet}));
    }
  }, [wallet, dispatch, loading]);

  if (isMobile) {
    return (
      <div
        className={styles.container}
        style={{ backgroundColor: "#0E0E0E" }}
        id="earn-info"
      ></div>
    );
  }

  return (
    <div
      className={styles.container}
      id="earn-info"
    >
      <p className={styles.rewardTitle}>Your earned <br/> Plomo</p>
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
  );
};

export default EarnInfo;
