import {StringPublicKey} from './types';
import BN from 'bn.js';
import * as borsh from 'borsh';
import {extendBorsh} from './borsh';

export const STAKE_SIZE = 8 + 32 + 32 + 8;
export const STAKER_STORAGE_SIZE = 32 + 8 + STAKE_SIZE * 100;

export const KEEPER_SEED = 'keeper';
export const STAKER_SEED = 'staker_storage';

export class StakeData {
  date_initialized: BN;
  nft_address: StringPublicKey;
  associated_account: StringPublicKey;
  amount: BN;

  constructor(fields: {
    date_initialized: BN;
    nft_address: StringPublicKey;
    associated_account: StringPublicKey;
    amount: BN;
  }) {
    this.date_initialized = fields.date_initialized;
    this.nft_address = fields.nft_address;
    this.associated_account = fields.associated_account;
    this.amount = fields.amount;
  }
}

export class StakerStorage {
  staker_address: StringPublicKey;
  points: BN;
  stakes: StakeData[];

  constructor(fields: {
    staker_address: StringPublicKey;
    points: BN;
    stakes: StakeData[];
  }) {
    this.staker_address = fields.staker_address;
    this.points = fields.points;
    this.stakes = fields.stakes;
  }

  signedPoints = () => {
    let isNegPoint = this.points.toString('hex').startsWith('f');

    let signedPoints = isNegPoint
      ? -this.points.neg().toTwos(64).toNumber()
      : this.points.toNumber();

    return signedPoints;
  };

  pendingPoints = () => {
    const DAY = 60 * 60 * 24;
    const POINTS_PER_DAY = 1;

    let points = 0;

    this.stakes.forEach(stake => {
      const stakeTime = stake.date_initialized.toNumber();
      const nowInSec = Math.floor(Date.now() / 1000);

      const stakeDays = Math.floor((nowInSec - stakeTime) / DAY);

      points += POINTS_PER_DAY * stakeDays * stake.amount.toNumber();
    });

    return points;
  };

  totalPoints = () => {
    return this.signedPoints() + this.pendingPoints();
  };

  getStake = (_nft_address: string) => {
    for (let i = 0; i < this.stakes.length; i++) {
      if (this.stakes[i].nft_address === _nft_address) {
        return this.stakes[i];
      }
    }

    return null;
  };
}

export const StakerSchema = new Map<any, any>([
  [
    StakerStorage,
    {
      kind: 'struct',
      fields: [
        ['staker_address', 'pubkeyAsString'],
        ['points', 'u64'],
        ['stakes', [StakeData]],
      ],
    },
  ],
  [
    StakeData,
    {
      kind: 'struct',
      fields: [
        ['date_initialized', 'u64'],
        ['nft_address', 'pubkeyAsString'],
        ['associated_account', 'pubkeyAsString'],
        ['amount', 'u64'],
      ],
    },
  ],
]);

export const decodeStakerData = (buffer: Buffer) => {
  return borsh.deserializeUnchecked(
    StakerSchema,
    StakerStorage,
    buffer,
  ) as StakerStorage;
};

extendBorsh();