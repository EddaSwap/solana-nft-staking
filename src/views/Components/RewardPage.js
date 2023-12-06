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

// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
// sections for this page
import HeaderStaking from "components/Header/HeaderStaking.js";
import MUISnackbar from "@material-ui/core/Snackbar";
import Reward from "components/Reward";
import EarnInfo from "components/EarnInfo";
import MuiAlert from "@material-ui/lab/Alert";

const network = process.env.REACT_APP_SOLANA_NETWORK;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Components(props) {
  const [showSnackbar, setShowSnackbar] = useState(true);
  const endpoint = useMemo(() => clusterApiUrl(network), []);
  const wallets = useMemo(
    () => [getPhantomWallet(), getSolflareWallet(), getSolletWallet()],
    []
  );

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
          {isMobile && (
            <MUISnackbar
              open={showSnackbar}
              autoHideDuration={6000}
              onClose={() => setShowSnackbar(false)}
            >
              <Alert
                onClose={() => setShowSnackbar(false)}
                severity="error"
                sx={{ width: "100%" }}
              >
                Currently we only support Phantom, Solflare and Sollet wallet.
                Please use Google Chrome desktop version with the extensions.
              </Alert>
            </MUISnackbar>
          )}
          <EarnInfo />
          <Reward />
          <Footer />
        </div>
      </WalletProvider>
    </ConnectionProvider>
  );
}
