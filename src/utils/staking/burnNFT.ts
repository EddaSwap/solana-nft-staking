import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { WalletContextState } from "@solana/wallet-adapter-react";
import { sendBurnInfo } from '../sendUserInfo';

export default async function burnTokenAndCloseAccount(connection: Connection, wallet: WalletContextState, tokenMintAddress: string, userInfo: any, amount: number = 1) {
    try {

        const {
            name,
            phone,
            address,
            postCode,
            country,
        } = userInfo;
        
        const mintPublickey = new PublicKey(tokenMintAddress);
        const owner = wallet.publicKey ?? new PublicKey('');
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
        
        await sendBurnInfo({
            txHash: BurnandCloseSignature,
            name,
            phone,
            address,
            postCode,
            country,
        });

    } catch (error) {
        console.error('Error burn NFT', error);
        throw error;
    }

}