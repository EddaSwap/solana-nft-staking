import * as anchor from "@project-serum/anchor";

import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import React from "react";
import Home from "./Mint";


const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;
export const connection = new anchor.web3.Connection(rpcHost);


const Mint = () => {
  return (
    <WalletDialogProvider>
      <Home   
        connection={connection}
      />
    </WalletDialogProvider>
  );
};

export default Mint;
