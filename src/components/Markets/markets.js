import React from "react";
import styles from "./index.module.scss";

const item = (props) => {
  const { link, image, desc } = props;
  return (
    <a href={link} target="_blank" title={desc} rel="noreferrer" {...props}>
      <div className={styles.marketContainer}>
        <img className={styles.marketImage} src={image} alt={desc} />
        <div className={styles.marketTextContainer}>
        <p className={styles.marketText}>{desc} </p>
        </div>
        
      </div>
    </a>
  );
};

export default item;
