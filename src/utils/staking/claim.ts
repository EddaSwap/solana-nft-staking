
import {
    SystemProgram,
    TransactionInstruction,
    Transaction,
    SYSVAR_RENT_PUBKEY,
    SYSVAR_CLOCK_PUBKEY,
} from '@solana/web3.js';
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import * as borsh from 'borsh';

import { ClaimRewardTokenArgs, STAKE_CONTRACT_SCHEMA } from './state/contract';

import {
    claimRewardToken_getAccounts,
    checkProgram,
    getExtendStakerStorage,
} from './services';

const BN = require('bn.js');

const TOKEN_AMOUNT = 1;

async function claim(
    connection: any,
    wallet: any,
    nftPublicKey: any,
    ataPublicKey: any
) {
    console.log(`Let's claim an nft`, connection);

    const sender =  wallet.publicKey;
    const programId = await checkProgram(connection);

    const [
        keeper,
        nftMintAccount,
        userAta,
        keeperAta,
        stakePubkey,
        stakerStorage,
        managementStorage,
    ] = await claimRewardToken_getAccounts(
        connection,
        sender,
        programId,
        nftPublicKey,
        ataPublicKey
    );

    const extendStakerStoragePubkey = await getExtendStakerStorage(
        programId,
        sender,
    );

    const data = Buffer.from(
        borsh.serialize(
            STAKE_CONTRACT_SCHEMA,
            new ClaimRewardTokenArgs({
                amount: new BN(TOKEN_AMOUNT),
            }),
        ),
    );

    const claimInstruction = new TransactionInstruction({
        programId,
        data,
        keys: [
            { pubkey: nftMintAccount, isSigner: false, isWritable: true },
            { pubkey: sender, isSigner: true, isWritable: false },
            { pubkey: userAta, isSigner: false, isWritable: true },
            { pubkey: keeper, isSigner: false, isWritable: true },
            { pubkey: keeperAta, isSigner: false, isWritable: true },
            { pubkey: stakePubkey, isSigner: false, isWritable: true },
            { pubkey: stakerStorage, isSigner: false, isWritable: true },
            { pubkey: extendStakerStoragePubkey, isSigner: false, isWritable: true},
            { pubkey: managementStorage, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
        ],
    });

    const transactions = new Transaction();

    console.log('Sending claim transaction...');
    transactions.add(claimInstruction);
    transactions.feePayer = wallet.publicKey || undefined;
    transactions.recentBlockhash = (
        await connection.getRecentBlockhash("max")
    ).blockhash;


    try {
        //signTransaction
        const _transaction = await wallet.signTransaction(transactions);
        const rawTransaction = _transaction.serialize();
        const signature = await connection.sendRawTransaction(rawTransaction);

        await connection.confirmTransaction(signature);
    } catch (ex) {
        console.log("Failed claim", ex);
        throw ex;
    }

    console.log('Success');

    return true;
}

export default claim;