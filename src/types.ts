import type { EncodableSettings } from "@hexpayday/stake-manager/artifacts/types";
import type { bigint } from "ethers";

export type Stake = {
  owner: string;
  custodian: string;
  lockedDay: number;
  stakedDays: number;
  endDay: number;
  isHedron: boolean;
  tokenized: boolean;
  stakeId: number;
  requestedGoodAccounting: boolean;
}

export enum TimelineTypes {
  UPDATE = 'Update Settings',
  END = 'End Stake',
  START = 'Start Stake',
  RESTART_STAKE = 'Restart Stake',
  DEPOSIT_HSI = 'Deposit Hsi',
  WITHDRAW_HSI = 'Withdraw Hsi',
  TOKENIZE_HSI = 'Tokenize Hsi',
  GOOD_ACCOUNT = 'Good Account',
}

export type StakeAction = {
  type: TimelineTypes;
  stake: Stake;
}

export type StakesLoadParams = {
  params: {
    chainId: string;
    day: string;
    count: string;
  };
}

export type ChainIdParams = {
  params: {
    chainId: string;
  };
}

export type ChainIdResponse = {
  chainId: number;
}

export type StakesDayResponse = {
  stakes: Stake[];
  day: number;
  chainId: number;
  count: number;
}

export type PropertiesAsStrings<T> = {
  [P in keyof T]: string | T[P];
};

export type GQLResponse<T> = Record<string, T>

export type StakeStart = {
  id: string;
  stakerAddr: string;
  stakeId: string;
  data0: string;
  startDay: string;
  stakeShares: string;
}

export type StakesEndingOnDay = {
  endDay: string;
  stakeId: string;
  startDay: string;
  stakedDays: string;
  stakerAddr: string;
  owner: null | string;
  stakeEnd: {
    penalty: string;
    payout: string;
  } | null;
}

export type StakesEndingOnDayResponse = {
  stakeStarts: StakesEndingOnDay[];
}

export type HsiStatusResponse = {
  hexstakes: {
    stakeId: string;
    isHdrnHsi: boolean;
    isHdrnHsiTokenized: boolean;
    hdrnHsiAddress: string;
    owner: {
      id: string;
    };
  }[];
}

export type ExtraInfo = {
  hsiAddress: string | null;
  owner: string | null;
  tokenized: boolean;
  requestedGoodAccounting: boolean;
}

export type StakeInfo = {
  stakeId: string;
  isHsi: boolean;
  isEndable: boolean;
  owner: string;
  hsiAddress: string;
  stakedDays: number;
  lockedDay: number;
}

export type DropdownOption = {
  value: number;
  text: string;
  expandedText?: string;
  inputText?: string;
  placeholder?: string;
}

export type MagnitudeSelection = {
  method: bigint;
  numerator: bigint;
  denominator: bigint;
}

export type Tip = {
  currency: string;
  limit: bigint;
  numerator: bigint;
  denominator: bigint;
}

export enum TaskType {
  approval = 'approval',
  start = 'start',
  depositHsi = 'depositHsi',
  withdrawHsi = 'withdrawHsi',
  goodAccount = 'goodAccount',
  endStake = 'endStake',
}

// export type TaskType = keyof taskTypes

export enum FundingOrigin {
  connected,
  deposited,
  unattributed,
}

export type StakeStartStep = {
  // fund from contract or from balance
  // assume from balance for now
  amount: bigint | null;
  for: string;
  lockedDays: string;
  settings: EncodableSettings.SettingsStruct;
  contract: string; // TODO: convert to ContractType when possible
  fundingOrigin: FundingOrigin;
  useAdvancedSettings: boolean;
}

export type ApprovalStep = {
  allowance: bigint;
  consumed: bigint;
  spender: string;
}

export type DepositHsiStep = {
  stake: Stake;
  tokenId: bigint;
  settings: EncodableSettings.SettingsStruct;
  settingsEncoded: bigint;
}

export type WithdrawStep = {
  stake: Stake;
}

export type GoodAccountStep = {
  stake: Stake;
}

export type EndStep = {
  stake: Stake;
}

export type Tasks = ApprovalStep | StakeStartStep | DepositHsiStep | GoodAccountStep | WithdrawStep | EndStep;

export enum ContractType {
  Invalid = 'Invalid',
  Hex = 'Hex',
  ExistingStakeManager = 'ExistingStakeManager',
  StakeManager = 'StakeManager',
  IsolatedStakeManagerFactory = 'IsolatedStakeManagerFactory',
}

export type Step<T extends Tasks = any> = {
  id: string;
  task: T;
  type: TaskType;
  optimize: boolean;
  invalid?: boolean;
  contract: ContractType;
}
