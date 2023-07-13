export type Stake = {}

export type StakesLoadParams = {
  params: {
    day: string;
  };
}

export type StakesDayResponse = {
  stakes: Stake[];
}

export type PropertiesAsStrings<T> = {
  [P in keyof T]: string | T[P];
};
