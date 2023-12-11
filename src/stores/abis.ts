import _IHEX from '@hexpayday/stake-manager/artifacts/contracts/interfaces/HEX.sol/HEX.json' assert { type: 'json' }
import _IHEXStakeInstanceManager from '@hexpayday/stake-manager/artifacts/contracts/interfaces/HEXStakeInstanceManager.sol/HEXStakeInstanceManager.json' assert { type: 'json' }
import _StakeManager from '@hexpayday/stake-manager/artifacts/contracts/StakeManager.sol/StakeManager.json' assert { type: 'json' }
import _ExistingStakeManager from '@hexpayday/stake-manager/artifacts/contracts/ExistingStakeManager.sol/ExistingStakeManager.json' assert { type: 'json' }
import _Multicall from '@hexpayday/stake-manager/artifacts/contracts/interfaces/Multicall.sol/Multicall.json' assert { type: 'json' }
import _Perpetual from '@hexpayday/stake-manager/artifacts/contracts/test/MockPerpetual.sol/MockPerpetual.json' assert { type: 'json' }
import _Communis from '@hexpayday/stake-manager/artifacts/solmate/src/tokens/ERC20.sol/ERC20.json' assert { type: 'json' }
import _GigaCommunis from '@hexpayday/gigacommunis/artifacts/GigaCommunis.sol/GigaCommunis.json' assert { type: 'json' }

export {
  _Perpetual as Perpetual,
  _IHEX as IHex,
  _IHEXStakeInstanceManager as IHEXStakeInstanceManager,
  _StakeManager as StakeManager,
  _ExistingStakeManager as ExistingStakeManager,
  _Multicall as Multicall,
  _Communis as Communis,
  _GigaCommunis as GigaCommunis,
}
