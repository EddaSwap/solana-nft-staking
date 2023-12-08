import React, { useState, useMemo, useEffect } from "react";
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
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(null);

  const wallets = useMemo(() => {
    if (isMobile) {
      return [getPhantomWallet()];
    } else {
      return [getPhantomWallet(), getSolflareWallet(), getSolletWallet()];
    }
  }, []);

  useEffect(() => {
    let timeout = setTimeout(() => {
      const isPhantomInstalled =
        window.phantom?.solana?.isPhantom || window.solana?.isPhantom;
      setIsPhantomInstalled(!!isPhantomInstalled);
    }, 1000);

    return () => clearTimeout(timeout);
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
          {isMobile && isPhantomInstalled === false && (
            <MUISnackbar
              open={showSnackbar}
              autoHideDuration={20000}
              onClose={() => setShowSnackbar(false)}
            >
              <Alert
                onClose={() => setShowSnackbar(false)}
                severity="error"
                sx={{ width: "100%" }}
              >
                To access phantom wallet for mobile users. Open the Phantom
                Wallet app, and enter{" "}
                <span style={{ fontWeight: "700" }}>
                  staking.madtrooper.com
                </span>{" "}
                in the Phantom browser. If you have already done this, then
                close this notification and proceed!
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
