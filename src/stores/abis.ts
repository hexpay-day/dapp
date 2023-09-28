import _IHEX from '@hexpayday/stake-manager/artifacts/contracts/reference/Hex.sol/HEX.json' assert { type: 'json' }
import _GlobalsAndUtility from '@hexpayday/stake-manager/artifacts/contracts/reference/Hex.sol/GlobalsAndUtility.json' assert { type: 'json' }
import _IHEXStakeInstanceManager from '@hexpayday/stake-manager/artifacts/contracts/interfaces/IHEXStakeInstanceManager.sol/IHEXStakeInstanceManager.json' assert { type: 'json' }
import _StakeManager from '@hexpayday/stake-manager/artifacts/contracts/StakeManager.sol/StakeManager.json' assert { type: 'json' }
import _Multicall from '@hexpayday/stake-manager/artifacts/contracts/test/IMulticall.sol/IMulticall3.json' assert { type: 'json' }
import _Perpetual from '@hexpayday/stake-manager/artifacts/contracts/test/MockPerpetual.sol/MockPerpetual.json' assert { type: 'json' }

export {
  _Perpetual as Perpetual,
  _IHEX as IHex,
  _GlobalsAndUtility as GlobalsAndUtility,
  _IHEXStakeInstanceManager as IHEXStakeInstanceManager,
  _StakeManager as StakeManager,
  _Multicall as Multicall,
}
