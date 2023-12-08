import React, { useState, useMemo } from "react";
import { isMobile } from "react-device-detect";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import {
  getPhantomWallet,
  getSolflareWallet,
  getSolletWallet,
} from "@solana/wallet-adapter-wallets";

import { clusterApiUrl } from "@solana/web3.js";

// nodejs library that concatenates classes
// @material-ui/icons
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
// sections for this page
import HeaderStaking from "components/Header/HeaderStaking.js";

// import Markets from "components/Markets";
import MUISnackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Stats from "../../components/Stats";

const network = process.env.REACT_APP_SOLANA_NETWORK;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Components(props) {
  const [showSnackbar, setShowSnackbar] = useState(true);
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(() => {
    if (isMobile) {
      return [getPhantomWallet()];
    } else {
      return [getPhantomWallet(), getSolflareWallet(), getSolletWallet()];
    }
  }, []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <div>
          <Header
            brand="MadTrooper"
            rightLinks={<HeaderStaking />}
            fixed
            color="black"
            changeColorOnScroll={{
              height: 50,
              color: "#120034",
              textColor: "white",
            }}
            {...props}
          />
          <Stats />
          <Footer />
        </div>
      </WalletProvider>
    </ConnectionProvider>
  );
}
