import * as ethers from 'ethers'
import { PUBLIC_INCLUDE_HARDHAT } from '$env/static/public'

const urls = new Map<number, string>([
  [1, 'https://eth.llamarpc.com	'],
  [369, 'https://rpc.pulsechain.com'],
  [943, 'https://rpc.v4.testnet.pulsechain.com'],
])

if (PUBLIC_INCLUDE_HARDHAT === 'true') {
  urls.set(31_337, 'http://localhost:8545')
}

export const getByChainId = (chainId: number) => {
  const url = urls.get(chainId)
  if (!url) return null
  const p = new ethers.JsonRpcProvider(url, chainId)
  p.on('error', (err) => {
    console.log(chainId, err)
  })
  return p
}
