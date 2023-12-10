import React from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import styles from "./index.module.scss";
import NFTCard from "../NFTCard";
import { closeChooseNFTModal } from "state/chooseNFT/actions";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDispatch } from "react-redux";
import { BUTTON_TYPE } from "utils";

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "black",
    width: "80%",
    height: "80%",
    borderRadius: "16px",
  },
};

const ChooseNFTModal = (props) => {
  const dispatch = useDispatch();
  const wallet = useWallet();

  const data = useSelector((state) => state.NFT);
  const modalData = useSelector((state) => state.chooseNFT);
  const { isOpenModal } = modalData;
  const { loading, nftList } = data;

  let content = null;

  if (loading === "loading") {
    content = (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingButton}>
          <p className={styles.loading}>Loading...</p>
        </div>
      </div>
    );
  } else if (nftList.length === 0) {
    content = (
      <div className={styles.connectWalletContainer}>
        You don't have any MadTrooper.
      </div>
    );
  } else {
    content = (
      <>
        <div className={styles.instructionContainer}>
          {" "}
          Select MadTrooper to burn
        </div>
        <div className={styles.nftList}>
          {nftList.map((item, key) => {
            return (
              <NFTCard
                type={BUTTON_TYPE.BURN}
                key={`market-stake-card-${key}`}
                walletAddress={
                  wallet.publicKey ? wallet.publicKey.toBase58() : ""
                }
                {...item}
              />
            );
          })}
        </div>
      </>
    );
  }

  return (
    <Modal
      isOpen={isOpenModal}
      style={modalStyle}
      contentLabel="Select NFT Modal"
      onRequestClose={() => dispatch(closeChooseNFTModal())}
    >
      {content}
    </Modal>
  );
};

export default ChooseNFTModal;
