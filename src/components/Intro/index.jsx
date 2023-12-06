import React from "react";

import styles from "./index.module.scss";
import IntroVideoList from "./introVideo";
import { isMobile } from "react-device-detect";
import "react-slideshow-image/dist/styles.css";

import { MOBILE_WIDTH, getWindowDimensions } from "../../utils";
import AlertCircle from 'assets/img/alert-circle.svg';

const customStyle = {
  slideContainer: {
    width: "100vw",
    height: "100vh",
  },
};

const IntroVideo = () => {
  let _faceStyle = {
    width: "100vw",
    height: "100vh",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };

  const { width } = getWindowDimensions();
  if (width < MOBILE_WIDTH) {
    _faceStyle.backgroundPosition = "35% center";
  }

  return (
    <div className={styles.container}>
      <div style={customStyle.slideContainer}>
        {IntroVideoList.map((slideImage, index) => {
          return (
            <div
              key={index}
              style={{
                background: `url("${slideImage.image}") no-repeat`,
                ..._faceStyle,
              }}
            >
              <div className={styles.contentContainer}>
                <p className={styles.title}>{slideImage.title} </p>
                <p className={styles.subTitle}>{slideImage.subTitle} </p>
                <p className={styles.desc}>{slideImage.desc} </p>
                <div className={styles.appAlert}>
                  <img className={styles.iconAlert} src={AlertCircle} alt='Alert'></img>
                  <p className={styles.alertText} >Project is in beta, use at your own risk</p>
                </div>
                {!isMobile && (<p className={styles.desc2}>{slideImage.desc2} </p>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntroVideo;
