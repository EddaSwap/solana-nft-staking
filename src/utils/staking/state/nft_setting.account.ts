import BN from 'bn.js';
import * as borsh from 'borsh';
import {extendBorsh} from './borsh';

export const NFT_SETTING_SIZE = 8 * 4;
export const NFT_SETTING_SEED = 'nft_setting_storage';

export class NftSetting {
  points_by_type: BN[];

  constructor(fields: {points_by_type: BN[]}) {
    this.points_by_type = fields.points_by_type;
  }
}

export const NftSettingSchema = new Map<any, any>([
  [
    NftSetting,
    {
      kind: 'struct',
      fields: [['points_by_type', ['u64']]],
    },
  ],
]);

export const decodeNftSettingData = (buffer: Buffer) => {
  return borsh.deserializeUnchecked(
    NftSettingSchema,
    NftSetting,
    buffer,
  ) as NftSetting;
};

extendBorsh();
