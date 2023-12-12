import * as Sentry from "@sentry/react";
import { countries } from "../constants/countries";


const logError = (error, params = {}, additionalInfo = null) => {
  try {
    const { mintNFTPublicKey, wallet } = params;

    const debugParams = {};
    if (mintNFTPublicKey) {
      debugParams.mintKey = mintNFTPublicKey.toBase58();
    }

    if (wallet) {
      debugParams.wallet = wallet.publicKey.toBase58();
    }

    Sentry.withScope((scope) => {

      scope.setExtra("debug_info", debugParams);

      if (debugParams.wallet) {
        scope.setExtra("wallet_address", debugParams.wallet);
      }

      if (additionalInfo) {
        scope.setExtra("additional_debug_info", additionalInfo);
      }  

      Sentry.captureException(error);
    });
  } catch (error) {
    Sentry.captureException(error);
  }
};

const BUTTON_TYPE = {
  STAKE: "Stake",
  UNSTAKE: "Unstake",
  GET_REWARD: "Redeem",
  BURN: "Burn",
};

const getButtonText = (action) => {
  switch (action) {
    case BUTTON_TYPE.STAKE:
      return "STAKE";
    case BUTTON_TYPE.UNSTAKE:
      return "UNSTAKE";
    case BUTTON_TYPE.GET_REWARD:
      return "REDEEM";
    case BUTTON_TYPE.BURN:
      return "BURN";
    default:
      return "";
  }
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const MOBILE_WIDTH = 480;

const POINT_TYPE_MAPPING = {
  Trooper: 0,
  Sergeant: 1,
  Commander: 2,
  "Legendary Master": 3,
};

const getNFTStakingType = (type = "Trooper") => {
  let returnType = POINT_TYPE_MAPPING[type];
  if (!returnType) {
    returnType = POINT_TYPE_MAPPING["Trooper"];
  }

  return returnType;
};


const getCodeFromCountryName = (countryName) => {
  const country =  countries.find(country => country.label ===  countryName) || {};
  
  return (country || {}).phone;
}

const getFormattedPhoneNumber = (phoneNumber, countryName) => {
  const countryCode = getCodeFromCountryName(countryName);
  if (!countryCode) {
    return phoneNumber;
  }

  return `(${countryCode}) ${phoneNumber}`;
}

export {
  getWindowDimensions,
  MOBILE_WIDTH,
  BUTTON_TYPE,
  getButtonText,
  logError,
  getNFTStakingType,
  getFormattedPhoneNumber,
  getCodeFromCountryName
};
