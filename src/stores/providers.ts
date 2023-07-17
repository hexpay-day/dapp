import * as ethers from 'ethers'

const urls = new Map<number, string>([
  [1, 'https://endpoints.omniatech.io/v1/eth/mainnet/public'],
  [369, 'https://rpc.pulsechain.com'],
  [943, 'https://rpc.v4.testnet.pulsechain.com'],
])

export const getByChainId = (chainId: number) => {
  const url = urls.get(chainId)
  return new ethers.providers.JsonRpcProvider(url, chainId)
}
