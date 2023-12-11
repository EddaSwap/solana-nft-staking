import React, { useEffect }  from "react";
import {  useDispatch, useSelector } from "react-redux";
import { useWallet } from "@solana/wallet-adapter-react";

import styles from "./index.module.scss";
import BurnNFTModal from "../BurnNFTModal";
import ChooseNFTModal from "../ChooseNFTModal";
import { openChooseNFTModal } from "../../state/chooseNFT/actions";
import { getNFTList } from "../../state/nft";

const BurnNFT = () => {
  const wallet = useWallet();
  const dispatch = useDispatch();

  const data = useSelector((state) => state.NFT);
  const { loading } = data;

  useEffect(() => {
    if (wallet.publicKey && loading === "idle") {
      dispatch(getNFTList({ wallet }));
    }
  }, [wallet, dispatch, loading]);


  return (
    <div style={{ backgroundColor: "#0E0E0E" }} id="reward">
      <div className={styles.container}>
        <div className={styles.upper}>
          <div className={styles.headline}>
            <button
              className={styles.burnNFTButton}
              onClick={() => {dispatch(openChooseNFTModal())}}
            >
              <div className={styles.burnNFTButtonText}>Burn NFT</div>
            </button>
          </div>
          <div>
            <ChooseNFTModal />
            <BurnNFTModal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurnNFT;
