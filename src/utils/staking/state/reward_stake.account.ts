import {StringPublicKey} from './types';
import BN from 'bn.js';
import * as borsh from 'borsh';
import {extendBorsh} from './borsh';

export const REWARD_STAKE_DATA_SIZE = 32 + 32 + 8 + 8;

export const REWARD_STAKE_SEED = 'reward_stake_storage';
export const REWARD_KEEPER_SEED = 'reward_keeper';

export class RewardStake {
  mint_address: StringPublicKey;
  associated_account: StringPublicKey;
  amount: BN;
  points_per_token: BN;

  constructor(fields: {
    mint_address: StringPublicKey;
    associated_account: StringPublicKey;
    amount: BN;
    points_per_token: BN;
  }) {
    this.mint_address = fields.mint_address;
    this.associated_account = fields.associated_account;
    this.amount = fields.amount;
    this.points_per_token = fields.points_per_token;
  }
}

export const ManagementSchema = new Map([
  [
    RewardStake,
    {
      kind: 'struct',
      fields: [
        ['mint_address', 'pubkeyAsString'],
        ['associated_account', 'pubkeyAsString'],
        ['amount', 'u64'],
        ['points_per_token', 'u64'],
      ],
    },
  ],
]);

export const decodeRewardStakeData = (buffer: Buffer) => {
  return borsh.deserializeUnchecked(
    ManagementSchema,
    RewardStake,
    buffer,
  ) as RewardStake;
};

extendBorsh();
