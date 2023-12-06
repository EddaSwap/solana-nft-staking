import BN from 'bn.js';
import {extendBorsh} from './borsh';

export class UpdateAuthorityArgs {
  instruction: number = 0;
}

export class AddRewardTokenArgs {
  instruction: number = 1;
  amount: BN;
  points_per_token: BN;

  constructor(args: {amount: BN; points_per_token: BN}) {
    this.amount = args.amount;
    this.points_per_token = args.points_per_token;
  }
}

export class StakeArgs {
  instruction: number = 2;
  amount: BN;

  constructor(args: {amount: BN}) {
    this.amount = args.amount;
  }
}

export class UnStakeArgs {
  instruction: number = 3;
  amount: BN | null;

  constructor(args: {amount?: BN}) {
    this.amount = args.amount ? args.amount : null;
  }
}

export class ClaimRewardTokenArgs {
  instruction: number = 4;
  amount: BN;

  constructor(args: {amount: BN}) {
    this.amount = args.amount;
  }
}

export class AddCreatorArgs {
  instruction: number = 5;
}

export class RemoveCreatorArgs {
  instruction: number = 6;
}

export class ReleaseNftArgs {
  instruction: number = 7;
  amount: BN | null;

  constructor(args: {amount?: BN}) {
    this.amount = args.amount ? args.amount : null;
  }
}

export class UpdateTreasuryArgs {
  instruction: number = 8;
}

export class AddSaleableRewardArgs {
  instruction: number = 9;
  amount: BN;
  points_per_token: BN;
  price: BN;

  constructor(args: {amount: BN; points_per_token: BN; price: BN}) {
    this.amount = args.amount;
    this.points_per_token = args.points_per_token;
    this.price = args.price;
  }
}

export class ClaimSaleableRewardArgs {
  instruction: number = 10;
  amount: BN | null;

  constructor(args: {amount?: BN}) {
    this.amount = args.amount ? args.amount : null;
  }
}

export class BuyRewardArgs {
  instruction: number = 11;
  amount: BN | null;

  constructor(args: {amount?: BN}) {
    this.amount = args.amount ? args.amount : null;
  }
}

export class ReleaseRewardArgs {
  instruction: number = 12;
  amount: BN | null;

  constructor(args: {amount?: BN}) {
    this.amount = args.amount ? args.amount : null;
  }
}

export const STAKE_CONTRACT_SCHEMA = new Map<any, any>([
  [
    UpdateAuthorityArgs,
    {
      kind: 'struct',
      fields: [['instruction', 'u8']],
    },
  ],
  [
    AddRewardTokenArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['amount', 'u64'],
        ['points_per_token', 'u64'],
      ],
    },
  ],
  [
    StakeArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['amount', 'u64'],
      ],
    },
  ],
  [
    UnStakeArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['amount', {kind: 'option', type: 'u64'}],
      ],
    },
  ],
  [
    ClaimRewardTokenArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['amount', 'u64'],
      ],
    },
  ],
  [
    AddCreatorArgs,
    {
      kind: 'struct',
      fields: [['instruction', 'u8']],
    },
  ],
  [
    RemoveCreatorArgs,
    {
      kind: 'struct',
      fields: [['instruction', 'u8']],
    },
  ],
  [
    ReleaseNftArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['amount', {kind: 'option', type: 'u64'}],
      ],
    },
  ],
  [
    UpdateTreasuryArgs,
    {
      kind: 'struct',
      fields: [['instruction', 'u8']],
    },
  ],
  [
    AddSaleableRewardArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['amount', 'u64'],
        ['points_per_token', 'u64'],
        ['price', 'u64'],
      ],
    },
  ],
  [
    ClaimSaleableRewardArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['amount', 'u64'],
      ],
    },
  ],
  [
    BuyRewardArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['amount', 'u64'],
      ],
    },
  ],
  [
    ReleaseRewardArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['amount', {kind: 'option', type: 'u64'}],
      ],
    },
  ],
]);

extendBorsh();
