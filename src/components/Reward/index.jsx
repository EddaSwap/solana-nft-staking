import React, { useEffect, useMemo } from "react";

import { useSelector, useDispatch } from "react-redux";

import styles from "./index.module.scss";
import RewardCard from "../RewardCard";
import { getRewardNFTList } from "../../state/rewardNFT";
import { BUTTON_TYPE } from "../../utils";
import { BLACK_LIST_REWARD, SOLD_REWARD_NFT } from "../../constants/nft";

const Reward = () => {
  const dispatch = useDispatch();

  const props = useSelector((state) => state.rewardNFT);
  const {
    rewardList: rewardNFTList,
    loading,
    currentClaimNFT,
    currentAction,
  } = props;

  useEffect(() => {
    if (loading === "idle") {
      dispatch(getRewardNFTList());
    }
  }, [dispatch, loading]);

  console.log("Reward nft list", rewardNFTList);

  const validRewardNftList = useMemo(
    () => rewardNFTList.filter((item) => !BLACK_LIST_REWARD[item.mintKey]),
    [rewardNFTList]
  );

  const mergedRewardNft = useMemo(
    () => mergeRewardNft(validRewardNftList),
    [validRewardNftList]
  );

  //add sold item
  const finalNFTList = useMemo(() => {
    const _list = mergedRewardNft.reverse() || [];
    const _SOLD_REWARD_NFT = SOLD_REWARD_NFT.reverse();
    for (let i = 0; i < _SOLD_REWARD_NFT.length; i++) {
      const soldItem = _SOLD_REWARD_NFT[i];
      let isAdd = true;

      for (let j = 0; j < mergedRewardNft.length; j++) {
        const rewardItem = mergedRewardNft[j];
        if (
          soldItem.metaData &&
          rewardItem.metaData &&
          soldItem.metaData.name === rewardItem.metaData.name
        ) {
          isAdd = false;
          break;
        }
      }

      if (isAdd) {
        _list.push(soldItem);
      }
    }
    return _list;
  }, [mergedRewardNft]);

  let content = (
    <div className={styles.nftList}>
      {finalNFTList.map((item, key) => {
        return (
          <RewardCard
            currentProcessKey={currentClaimNFT}
            currentAction={currentAction}
            key={`market-nft-card-${key}`}
            {...item}
            type={BUTTON_TYPE.GET_REWARD}
          />
        );
      })}
    </div>
  );
  if (loading === "loading") {
    content = (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingButton}>
          <p className={styles.loading}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0E0E0E" }} id="reward">
      <div className={styles.container}>
        <div className={styles.upper}>
          <div className={styles.headline}>
            <div className={styles.content}>Rewards</div>
          </div>
        </div>
        {content}
      </div>
    </div>
  );
};

const mergeRewardNft = (_array) => {
  let mergedRewardNfts = [];

  const onlyAGList = _array.filter(x => {
    const metaData = x.metaData || '';
    return metaData.name === 'MadTrooper AG #1' || metaData.name === 'MadTrooper AG #2';
  });

  const nonAGList  = _array.filter(x => {
    const metaData = x.metaData || '';
    return !(metaData.name === 'MadTrooper AG #1' || metaData.name === 'MadTrooper AG #2');
  });

  const array = [ ...nonAGList, ...onlyAGList,];
  array.forEach((item) => {
    var existing = mergedRewardNfts.filter((nft) => {
      if (!nft.metaData || !item.metaData) {
        return false;
      }
      return nft.metaData.name === item.metaData.name;
    });
    if (existing.length) {
      let existingIndex = mergedRewardNfts.indexOf(existing[0]);

      let total = mergedRewardNfts[existingIndex].total || 1;
      mergedRewardNfts[existingIndex].total = total + 1;
    } else {
      mergedRewardNfts.push({ ...item, total: 1 });
    }
  });

  return mergedRewardNfts;
};

export default Reward;
