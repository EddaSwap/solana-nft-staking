import React, { useEffect } from "react";

import styles from "./index.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { getStakedStatList } from "state/stat";
import { getPoints } from "../../state/points";
import StatTable from "./statsTable";

import { useWallet } from "@solana/wallet-adapter-react";

const Stats = () => {
  const dispatch = useDispatch();
  const wallet = useWallet();
  const { statsList, loading } = useSelector((state) => {
    return state.stakedStat;
  });

  console.log("stateList", statsList);

  const { totalStaked, userList } = statsList;

  useEffect(() => {
    if (loading === "idle") {
      dispatch(getStakedStatList());
    }
  }, [dispatch, loading]);

  const { loading: pointLoading } = useSelector((state) => {
    return state.points;
  });

  useEffect(() => {
    if (pointLoading === "idle" && wallet && wallet.publicKey) {
      dispatch(getPoints({ wallet }));
    }
  }, [dispatch, pointLoading, wallet]);

  let rank = -1;
  if (wallet.publicKey && userList) {
    const pubKey = wallet.publicKey.toBase58();
    for (let i = 0; i < userList.length; i++) {
      const item = userList[i];
      if (item.staker_address == pubKey) {
        rank = i;
        break;
      }
    }
  }

  let content = null;
  if (loading === "loading") {
    content = (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingButton}>
          <p className={styles.loading}>Loading...</p>
        </div>
      </div>
    );
  } else {
    content = (
      <div className={styles.upper}>
        <div className={styles.headline}>
          {rank >= 0 && (
            <div className={styles.rank}>Your rank: {rank + 1}</div>
          )}
          <StatTable data={userList || []} />

          <div className={styles.totalStaked}>
            Total staked: {totalStaked} MadTroopers
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh" }} id="stats">
      <div className={styles.container}>
        <div className={styles.upper}>
          <div className={styles.headline}>
            <div className={styles.content}>Leaderboard</div>
          </div>
        </div>
        {content}
      </div>
    </div>
  );
};

export default Stats;
