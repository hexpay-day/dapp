import { get } from "svelte/store";
import { chainId } from './web3'
import * as contracts from './contracts'

type Metadata = {
  decimals: number;
  symbol: string;
  name: string;
}

const cache = new Map<string, Metadata>()

export const currencyMetadata = async (hash: string) => {
  const key = `${get(chainId)}:${hash.toLowerCase()}`
  const cached = cache.get(key)
  if (cached) {
    return cached
  }
  const erc20 = contracts.erc20(get(chainId), hash)
  const [decimals, symbol, name] = await Promise.all([
    erc20.decimals(),
    erc20.symbol(),
    erc20.name(),
  ])
  const metadata: Metadata = {
    decimals,
    symbol,
    name,
  }
  cache.set(key, metadata)
  return metadata
}