import { gql } from "graphql-request";

export const STAKES_ENDING = gql`query ($day: BigInt!) {
  stakeStarts(first: 1000, where: {
    endDay: $day
  }) {
    id
    endDay
    stakerAddr
    stakeId
    data0
    startDay
    stakeShares
  }
}`

export const STAKE_STATE_ENDING_ON_DAY = gql`query StakeStateEndingOnDay($day: Int!, $limit: Int!, $skip: Int!) {
  stakeStarts(orderBy: stakeId, orderDirection: asc, limit: $limit, skip: $skip, where: {
    endDay: $day
  }) {
    stakeId
    stakedDays
    startDay
    endDay
    stakeEnd {
      penalty
      payout
    }
  }
}`

export const STAKE_HSI_STATUS = gql`query GetStakeIsHsi($stakeIds: [Int!]!) {
  hexstakes(where: {
    isHdrnHsi: true,
    stakeId_in: $stakeIds
  }) {
    stakeId
    isHdrnHsi
    isHdrnHsiTokenized
  }
}`
