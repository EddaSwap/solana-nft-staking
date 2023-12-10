import * as Sentry from "@sentry/react";

const logError = (error, params = {}) => {

  try {
    const { mintNFTPublicKey, wallet } = params;

    const debugParams = {};
    if (mintNFTPublicKey) {
      debugParams.mintKey = mintNFTPublicKey.toBase58();
    }

    if (wallet) {
      debugParams.wallet = wallet.publicKey.toBase58();
    }

    Sentry.withScope(scope => {
      scope.setExtra('debug_info', debugParams);
      Sentry.captureException(error);
    });
  } catch (error) {
    Sentry.captureException(error);
  }
  
};

const BUTTON_TYPE = {
  STAKE: 'Stake',
  UNSTAKE: 'Unstake',
  GET_REWARD: 'Redeem',
  BURN: 'Burn'
}

const getButtonText = (action) => {
  switch(action) {
    case BUTTON_TYPE.STAKE:
      return 'STAKE';
    case BUTTON_TYPE.UNSTAKE:
      return'UNSTAKE';
    case BUTTON_TYPE.GET_REWARD:
      return 'REDEEM';
      case BUTTON_TYPE.BURN:
        return 'BURN';  
    default:
      return ''  
  }
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const MOBILE_WIDTH = 480;

const POINT_TYPE_MAPPING = {
  'Trooper': 0,
  'Sergeant': 1,
  'Commander': 2,
  'Legendary Master': 3
}

const getNFTStakingType = (type = 'Trooper') =>{
  let returnType = POINT_TYPE_MAPPING[type];
  if(!returnType) {
    returnType = POINT_TYPE_MAPPING['Trooper']; 
  }

  return returnType;
}

export { 
  getWindowDimensions,
  MOBILE_WIDTH,
  BUTTON_TYPE,
  getButtonText,
  logError,
  getNFTStakingType,
};
