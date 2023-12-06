import {StringPublicKey} from './types';

import * as borsh from 'borsh';
import {extendBorsh} from './borsh';

export const MANAGEMENT_STORAGE_SIZE = 32 * 100 + 32 + 32 * 10;

export const MANAGEMENT_SEED = 'mamangement_storage';

export class ManagementStorage {
  authority: StringPublicKey = '';
  reward_stakes: StringPublicKey[] = [];
  creators: StringPublicKey[] = [];

  constructor(fields: {
    authority: StringPublicKey;
    reward_stakes: StringPublicKey[];
    creators: StringPublicKey[];
  }) {
    this.authority = fields.authority;
    this.reward_stakes = fields.reward_stakes;
    this.creators = fields.creators;
  }
}

export const ManagementSchema = new Map([
  [
    ManagementStorage,
    {
      kind: 'struct',
      fields: [
        ['authority', 'pubkeyAsString'],
        ['reward_stakes', ['pubkeyAsString']],
        ['creators', ['pubkeyAsString']],
      ],
    },
  ],
]);

export const decodeManagementData = (buffer: Buffer) => {
  return borsh.deserializeUnchecked(
    ManagementSchema,
    ManagementStorage,
    buffer,
  ) as ManagementStorage;
};

extendBorsh();
