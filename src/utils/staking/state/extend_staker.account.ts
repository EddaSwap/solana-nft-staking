import {StringPublicKey} from './types';
import BN from 'bn.js';
import * as borsh from 'borsh';
import {extendBorsh} from './borsh';

export const EXTEND_STAKE_SIZE = 8 + 32 + 32 + 8;
export const EXTEND_STAKER_STORAGE_SIZE = 32 + EXTEND_STAKE_SIZE * 100;

export const EXTEND_STAKER_SEED = 'extend_staker_storage';

export class ExtendStakeData {
  nft_address: StringPublicKey;
  points_by_type: BN;
  empty_field1: BN;
  empty_field2: StringPublicKey;

  constructor(fields: {
    nft_address: StringPublicKey;
    points_by_type: BN;
    empty_field1: BN;
    empty_field2: StringPublicKey;
  }) {
    this.nft_address = fields.nft_address;
    this.points_by_type = fields.points_by_type;
    this.empty_field1 = fields.empty_field1;
    this.empty_field2 = fields.empty_field2;
  }
}

export class ExtendStakerStorage {
  staker_address: StringPublicKey;
  extend_stakes: ExtendStakeData[];

  constructor(fields: {
    staker_address: StringPublicKey;
    extend_stakes: ExtendStakeData[];
  }) {
    this.staker_address = fields.staker_address;
    this.extend_stakes = fields.extend_stakes;
  }

  getStake = (_nft_address: string) => {
    for (let i = 0; i < this.extend_stakes.length; i++) {
      if (this.extend_stakes[i].nft_address === _nft_address) {
        return this.extend_stakes[i];
      }
    }

    return null;
  };
}

export const ExtendStakerSchema = new Map<any, any>([
  [
    ExtendStakerStorage,
    {
      kind: 'struct',
      fields: [
        ['staker_address', 'pubkeyAsString'],
        ['extend_stakes', [ExtendStakeData]],
      ],
    },
  ],
  [
    ExtendStakeData,
    {
      kind: 'struct',
      fields: [
        ['nft_address', 'pubkeyAsString'],
        ['points_by_type', 'u64'],
        ['empty_field1', 'u64'],
        ['empty_field2', 'pubkeyAsString'],
      ],
    },
  ],
]);

export const decodeExtendStakerData = (buffer: Buffer) => {
  return borsh.deserializeUnchecked(
    ExtendStakerSchema,
    ExtendStakerStorage,
    buffer,
  ) as ExtendStakerStorage;
};

extendBorsh();