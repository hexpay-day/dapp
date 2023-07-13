export type Stake = {}

export type StakesLoadParams = {
  params: {
    chainId: string;
    day: string;
  };
}

export type StakesDayResponse = {
  stakes: Stake[];
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
