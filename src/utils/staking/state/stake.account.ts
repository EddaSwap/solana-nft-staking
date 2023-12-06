import { StringPublicKey } from './types';
import BN from 'bn.js';
import * as borsh from 'borsh';
import { extendBorsh } from './borsh';

export const STAKE_SIZE = 8 + 32 + 32 + 32 + 8;
export const STAKE_SEED = 'stake_storage';
export const KEEPER_SEED = 'keeper';

export class StakeStorage {
  date_initialized: BN;
  staker_address: StringPublicKey;
  nft_address: StringPublicKey;
  associated_account: StringPublicKey;
  amount: BN;

  constructor(fields: {
    date_initialized: BN;
    staker_address: StringPublicKey;
    nft_address: StringPublicKey;
    associated_account: StringPublicKey;
    amount: BN;
  }) {
    this.date_initialized = fields.date_initialized;
    this.staker_address = fields.staker_address;
    this.nft_address = fields.nft_address;
    this.associated_account = fields.associated_account;
    this.amount = fields.amount;
  }
}

export const StakeSchema = new Map([
  [
    StakeStorage,
    {
      kind: 'struct',
      fields: [
        ['date_initialized', 'u64'],
        ['staker_address', 'pubkeyAsString'],
        ['nft_address', 'pubkeyAsString'],
        ['associated_account', 'pubkeyAsString'],
        ['amount', 'u64'],
      ],
    },
  ],
]);

export const decodeStakeData = (buffer: Buffer) => {
  return borsh.deserializeUnchecked(
    StakeSchema,
    StakeStorage,
    buffer
  ) as StakeStorage;
};

extendBorsh();
