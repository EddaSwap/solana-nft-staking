import React from "react";

import styles from "./index.module.scss";

import MarketCard from "./markets";

import list from "./list.jsx";

const BuyNow = () => {
  return (
    <div className={styles.itemList}>
      {list.map((item, key) => {
        return (
          <MarketCard
            key={`as-seen-on-item-${key}`}
            {...item}
            className={styles.item}
          />
        );
      })}
    </div>
  );
};

export default BuyNow;
