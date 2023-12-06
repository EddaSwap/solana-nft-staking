import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  useWalletDialog,
} from "@solana/wallet-adapter-material-ui";

import styles from "./index.module.scss";
import "./custom.css";
const Mint = (props) => {
  const wallet = useWallet();
  const { setOpen } = useWalletDialog();

  return (
    <div className="minting-btn">
      <div className="wallet-connect">
        <WalletMultiButton
        />
        {!wallet.connect && wallet.wallet && wallet.wallet.name !== "" ? (
          <div className={styles.another} onClick={() => setOpen(true)}>
            Choose another wallet
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Mint;
