import {StringPublicKey} from './types';
import BN from 'bn.js';
import * as borsh from 'borsh';
import {extendBorsh} from './borsh';

export const SALEABLE_REWARD_STAKE_DATA_SIZE = 32 + 32 + 8 + 8 + 8;

export class SaleableRewardStake {
  mint_address: StringPublicKey;
  associated_account: StringPublicKey;
  amount: BN;
  points_per_token: BN;
  price: BN;

  constructor(fields: {
    mint_address: StringPublicKey;
    associated_account: StringPublicKey;
    amount: BN;
    points_per_token: BN;
    price: BN;
  }) {
    this.mint_address = fields.mint_address;
    this.associated_account = fields.associated_account;
    this.amount = fields.amount;
    this.points_per_token = fields.points_per_token;
    this.price = fields.price;
  }
}

export const MANAGEMENT_STORAGE_SIZE =
  32 + 32 + SALEABLE_REWARD_STAKE_DATA_SIZE * 200 + 10 * 32;
export const EXTEND_MANAGEMENT_SEED = 'extend_management_storage';

export class ExtendManagementStorage {
  authority: StringPublicKey = '';
  treasury: StringPublicKey = '';
  reward_stakes: SaleableRewardStake[] = [];
  creators: StringPublicKey[] = [];

  constructor(fields: {
    authority: StringPublicKey;
    treasury: StringPublicKey;
    reward_stakes: SaleableRewardStake[];
    creators: StringPublicKey[];
  }) {
    this.authority = fields.authority;
    this.treasury = fields.treasury;
    this.reward_stakes = fields.reward_stakes;
    this.creators = fields.creators;
  }

  getStake = (_mint_address: string) => {
    for (let i = 0; i < this.reward_stakes.length; i++) {
      if (this.reward_stakes[i].mint_address === _mint_address) {
        return this.reward_stakes[i];
      }
    }

    return null;
  };
}

export const ExtendManagementSchema = new Map<any, any>([
  [
    ExtendManagementStorage,
    {
      kind: 'struct',
      fields: [
        ['authority', 'pubkeyAsString'],
        ['treasury', 'pubkeyAsString'],
        ['reward_stakes', [SaleableRewardStake]],
        ['creators', ['pubkeyAsString']],
      ],
    },
  ],
  [
    SaleableRewardStake,
    {
      kind: 'struct',
      fields: [
        ['mint_address', 'pubkeyAsString'],
        ['associated_account', 'pubkeyAsString'],
        ['amount', 'u64'],
        ['points_per_token', 'u64'],
        ['price', 'u64'],
      ],
    },
  ],
]);

export const decodeExtendManagementData = (buffer: Buffer) => {
  return borsh.deserializeUnchecked(
    ExtendManagementSchema,
    ExtendManagementStorage,
    buffer,
  ) as ExtendManagementStorage;
};

extendBorsh();
