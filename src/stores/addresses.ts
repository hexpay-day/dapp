export const Hex = '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39'
export const Hedron = '0x3819f64f282bf135d62168c1e513280daf905e06'
export const HSIM = '0x8BD3d1472A656e312E94fB1BbdD599B8C51D18e3'
export const ExistingStakeManager = '0x209b1C66cB0Ea99DC2d4Ad13C35859DD1c258988'
export const StakeManager = '0x8B5fc9b2A02fB35155cE96A8Ff73d917a4fDB727'
export const IsolatedStakeManagerFactory = '0x415012b3029147ED1Ff30022cf11dd683A647D7E'
export const Multicall = '0xcA11bde05977b3631167028862bE2a173976CA11'
export const Communis = '0x5A9780Bfe63f3ec57f01b087cD65BD656C9034A8'
export const GigaCommunis = '0x947203e20813e4f7757fb2304fd1e34edc3c4ff9'

export const ellipsisAddress = (addr: string, offset = 6, onlyPrefix = false) => `${addr.slice(0, offset + 2)}...${onlyPrefix ? '' : addr.slice(-offset)}`

export const perpetuals = new Set<string>([
  '0x0d86EB9f43C57f6FF3BC9E23D8F9d82503f0e84b',
  '0x6b32022693210cD2Cfc466b9Ac0085DE8fC34eA6',
  '0x6B0956258fF7bd7645aa35369B55B61b8e6d6140',
  '0xF55cD1e399e1cc3D95303048897a680be3313308',
  '0xe9f84d418B008888A992Ff8c6D22389C2C3504e0',
])
