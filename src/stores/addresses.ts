export const Hex = '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39'
export const Hedron = '0x3819f64f282bf135d62168c1e513280daf905e06'
export const HSIM = '0x8BD3d1472A656e312E94fB1BbdD599B8C51D18e3'
export const StakeManager = '0xE971e07BF9917e91DFbeD9165f2ea8e6FF876880'

export const stakeManagerByChainId = new Map<number, string>([
  [1, StakeManager],
  [369, StakeManager],
  [943, StakeManager],
])

export const elipsisAddress = (addr: string, offset = 6) => `${addr.slice(0, offset + 2)}...${addr.slice(-offset)}`

export const perpetuals = new Set<string>([
  '0x0d86EB9f43C57f6FF3BC9E23D8F9d82503f0e84b',
  '0x6b32022693210cD2Cfc466b9Ac0085DE8fC34eA6',
  '0x6B0956258fF7bd7645aa35369B55B61b8e6d6140',
  '0xF55cD1e399e1cc3D95303048897a680be3313308',
  '0xe9f84d418B008888A992Ff8c6D22389C2C3504e0',
])
