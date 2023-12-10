import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { WalletContextState } from "@solana/wallet-adapter-react";


export async function burnTokenAndCloseAccount(tokenMintAddress: string, owner: PublicKey, wallet: WalletContextState, connection: Connection, amount: number = 1) {
    try {

        const mintPublickey = new PublicKey(tokenMintAddress);

        const associatedAddress = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mintPublickey,
            owner,
        );

        const burnInstruction = await Token.createBurnInstruction(
            TOKEN_PROGRAM_ID,
            mintPublickey,
            associatedAddress,
            owner,
            [],
            amount
        );

        const closeInstruction = await Token.createCloseAccountInstruction(
            TOKEN_PROGRAM_ID,
            associatedAddress,
            owner,
            owner,
            []
        );

        const BurnandCloseTransaction = new Transaction().add(burnInstruction, closeInstruction);

        const BurnandCloseSignature = await wallet.sendTransaction(BurnandCloseTransaction, connection);

        const confirmed = await connection.confirmTransaction(BurnandCloseSignature, 'processed');

        return;
    } catch (error) {
        console.error('Error burn NFT', error);
    }

}