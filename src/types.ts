export type Stake = {}

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
  stakeEnd: {
    penalty: string;
    payout: string;
  };
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
