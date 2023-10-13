import * as ethers from 'ethers'

const urls = new Map<number, string>([
  [1, 'https://eth.llamarpc.com	'],
  [369, 'https://rpc.pulsechain.com'],
  [943, 'https://rpc.v4.testnet.pulsechain.com'],
])

export const getByChainId = (chainId: number) => {
  const url = urls.get(chainId)
  if (!url) throw new Error('unable to connect')
  return new ethers.JsonRpcProvider(url, chainId)
}
