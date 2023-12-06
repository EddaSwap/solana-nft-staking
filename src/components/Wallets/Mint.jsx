import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  Connection,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), {
  commitment: "confirmed",
});

const MintButton = ({ className }) => {
  const { publicKey, signTransaction } = useWallet();
  const onClick = async () => {
    let signature = "";
    try {
      signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);

      await connection.confirmTransaction(signature);
    } catch (error) {
      return;
    }

    signature = "";
    try {
      let transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: "FwePyUzyLPs3MKQAKSXqxeATns7LLBKeX2c4fprKHqG1",
          lamports: LAMPORTS_PER_SOL,
        })
      );

      transaction.feePayer = publicKey || undefined;
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash("max")
      ).blockhash;

      transaction = await signTransaction(transaction);

      const rawTransaction = transaction.serialize();

      signature = await connection.sendRawTransaction(rawTransaction);

      await connection.confirmTransaction(signature);
    } catch (error) {
      return;
    }
  };

  return (
    <div className={className} onClick={onClick}>
      Mint NFT
    </div>
  );
};

export default MintButton;
