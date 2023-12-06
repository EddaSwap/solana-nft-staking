import React from "react";

import {
  WalletDialogProvider,
  WalletMultiButton,
  WalletConnectButton,
  WalletDialog,
  useWalletDialog,
} from "@solana/wallet-adapter-material-ui";
// import {
//   WalletModalProvider,
//   WalletMultiButton,
//   WalletConnectButton,
//   WalletDialog,
//   useWalletModal,
// } from "@solana/wallet-adapter-ant-design";
import { useWallet } from "@solana/wallet-adapter-react";

import styles from "./index.module.scss";
import "./custom.css";

const WalletConnect = ({ className }) => {
  const { setOpen } = useWalletDialog();
  const { wallet } = useWallet();
  return (
    <>
      <div className="wallet-connect">
        <WalletMultiButton
          className={className || styles.connectBtn}
        ></WalletMultiButton>
        {wallet && wallet !== "" ? (
          <div className={styles.another} onClick={() => setOpen(true)}>
            Choose another wallet
          </div>
        ) : null}
      </div>
    </>
  );
};

const Wallets = () => {
  return (
    <WalletDialogProvider>
      <WalletConnect />
    </WalletDialogProvider>
  );
};

export default Wallets;
// import React, { useMemo, useState } from "react";
// import Input from "@material-ui/core/Input";
// import MuiAlert from "@material-ui/lab/Alert";

// import { WalletProvider, useWallet } from "@solana/wallet-adapter-react";
// // import { WalletContext } from "@solana/wallet-adapter-react/useWallet";
// import {
//   getPhantomWallet,
//   getSolletWallet,
// } from "@solana/wallet-adapter-wallets";
// import {
//   WalletDialogProvider,
//   WalletMultiButton,
// } from "@solana/wallet-adapter-material-ui";

// import {
//   Keypair,
//   LAMPORTS_PER_SOL,
//   SystemProgram,
//   Transaction,
//   clusterApiUrl,
//   Connection,
// } from "@solana/web3.js";

// const connection = new Connection(clusterApiUrl("devnet"), {
//   commitment: "confirmed",
// });

// const Wallets = () => {
//   const { publicKey, wallet, signTransaction } = useWallet();
//   const [toPublicKey, setToPublicKey] = useState("");
//   const [number, setNumber] = useState(0);
//   const [logs, setLogs] = useState([]);

//   const addLog = (type, log) => {
//     const _logs = [...logs];
//     _logs.push({ type, log });
//     setLogs(_logs);
//   };

//   const clearLogs = async () => {
//     setLogs([]);
//   };

//   const onClick = async () => {
//     await clearLogs();
//     if (!publicKey) {
//       addLog("error", "Wallet not connected!");
//       return;
//     }

//     let signature = "";
//     try {
//       signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
//       addLog("success", "Airdrop requested:", signature);

//       await connection.confirmTransaction(signature);
//       addLog("success", "Airdrop successful!", signature);
//     } catch (error) {
//       addLog("error", `Airdrop failed! ${error.message}`, signature);
//       return;
//     }

//     signature = "";
//     try {
//       let transaction = new Transaction().add(
//         SystemProgram.transfer({
//           fromPubkey: publicKey,
//           toPubkey: toPublicKey,
//           lamports: LAMPORTS_PER_SOL * number,
//         })
//       );

//       transaction.feePayer = publicKey || undefined;
//       transaction.recentBlockhash = (
//         await connection.getRecentBlockhash("max")
//       ).blockhash;

//       transaction = await signTransaction(transaction);

//       const rawTransaction = transaction.serialize();

//       signature = await connection.sendRawTransaction(rawTransaction);

//       await connection.confirmTransaction(signature);
//       addLog("success", "Transaction successful!", signature);
//     } catch (error) {
//       addLog("error", `Transaction failed! ${error.message}`, signature);
//       return;
//     }
//   };

//   return (
//     <WalletDialogProvider>
//       <div
//         style={{
//           width: "100vw",
//           height: "100vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: " center",
//           flexDirection: "column",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             margin: "0 auto",
//             width: "400px",
//             height: "200px",
//             justifyContent: "space-between",
//             alignItems: "center",
//             backgroundColor: "#fff",
//             padding: "20px 0",
//           }}
//         >
//           <WalletMultiButton />
//           <Input
//             onChange={(ev) => {
//               setToPublicKey(ev.target.value);
//             }}
//             placeholder="Input receiver publickey"
//           />
//           <Input
//             onChange={(ev) => {
//               setNumber(Number(ev.target.value));
//             }}
//             placeholder="Input number of sol"
//           />
//           <div
//             style={{
//               borderRadius: "12px",
//               padding: "8px 20px",
//               backgroundColor: "violet",
//               color: "#fff",
//               fontWeight: "bold",
//               cursor: "pointer",
//             }}
//             onClick={onClick}
//           >
//             Send
//           </div>
//         </div>
//         <div
//           style={{
//             maxHeight: "300px",
//             overflow: "scroll",
//             marginBottom: "30px",
//             marginTop: "30px",
//           }}
//         >
//           {logs.map(({ type, log }, index) => {
//             return (
//               <div
//                 style={{ color: type === "success" ? "green" : "red" }}
//                 key={index}
//               >
//                 {log}
//               </div>
//             );
//           })}
//         </div>
//         {logs && logs.length ? (
//           <div
//             onClick={() => setLogs([])}
//             style={{
//               borderRadius: "12px",
//               padding: "8px 20px",
//               backgroundColor: "red",
//               color: "#fff",
//               fontWeight: "bold",
//               cursor: "pointer",
//             }}
//           >
//             Clear logs
//           </div>
//         ) : null}
//       </div>
//     </WalletDialogProvider>
//   );
// };

// const WalletProviderSolana = () => {
//   const wallets = useMemo(() => [getPhantomWallet(), getSolletWallet()], []);
//   return (
//     <WalletProvider wallets={wallets} autoConnect>
//       <Wallets />
//     </WalletProvider>
//   );
// };

// export default WalletProviderSolana;
