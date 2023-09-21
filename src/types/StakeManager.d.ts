declare const schema: {
  "_format": "hh-sol-artifact-1",
  "contractName": "StakeManager",
  "sourceName": "contracts/StakeManager.sol",
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "expected",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "actual",
          "type": "bytes32"
        }
      ],
      "name": "BlockHash",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "currentTime",
          "type": "uint256"
        }
      ],
      "name": "Deadline",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotAllowed",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "provided",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "expected",
          "type": "address"
        }
      ],
      "name": "StakeNotOwned",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TransferFailed",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "AddCurrency",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "setting",
          "type": "uint256"
        }
      ],
      "name": "AddTip",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "setting",
          "type": "uint256"
        }
      ],
      "name": "RemoveTip",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "staker",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Tip",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "TransferStake",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "result",
          "type": "bytes"
        }
      ],
      "name": "TxFailed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "settings",
          "type": "uint256"
        }
      ],
      "name": "UpdateSettings",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "HEDRON",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "HSIM",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "INDEX_TODAY",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAX_256",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAX_CATCH_UP_DAYS",
      "outputs": [
        {
          "internalType": "uint128",
          "name": "",
          "type": "uint128"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAX_DAYS",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAX_TOTAL_PAYOUT",
      "outputs": [
        {
          "internalType": "uint128",
          "name": "",
          "type": "uint128"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "TARGET",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "addCurrencyToList",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "numerator",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "denominator",
          "type": "uint256"
        }
      ],
      "name": "addTipToStake",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "attributed",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "canTransfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "iterations",
          "type": "uint256"
        }
      ],
      "name": "catchUpDays",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "payout",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
            }
          ],
          "internalType": "struct EarningsOracle.Total",
          "name": "total",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "day",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "checkStakeGoodAccounting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "staker",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "checkStakeGoodAccountingFor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "max",
          "type": "uint256"
        }
      ],
      "name": "clamp",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "transferOut",
          "type": "bool"
        },
        {
          "internalType": "address payable",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "collectUnattributed",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "transferOut",
          "type": "bool"
        },
        {
          "internalType": "address payable",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "basisPoints",
          "type": "uint256"
        }
      ],
      "name": "collectUnattributedPercent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "limit",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "method",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "x",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "y",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint40",
              "name": "stakeId",
              "type": "uint40"
            },
            {
              "internalType": "uint72",
              "name": "stakedHearts",
              "type": "uint72"
            },
            {
              "internalType": "uint72",
              "name": "stakeShares",
              "type": "uint72"
            },
            {
              "internalType": "uint16",
              "name": "lockedDay",
              "type": "uint16"
            },
            {
              "internalType": "uint16",
              "name": "stakedDays",
              "type": "uint16"
            },
            {
              "internalType": "uint16",
              "name": "unlockedDay",
              "type": "uint16"
            },
            {
              "internalType": "bool",
              "name": "isAutoStake",
              "type": "bool"
            }
          ],
          "internalType": "struct IUnderlyingStakeable.StakeStore",
          "name": "stake",
          "type": "tuple"
        }
      ],
      "name": "computeMagnitude",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currencyListSize",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "currencyToIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentDay",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "abilities",
          "type": "uint256"
        }
      ],
      "name": "decodeConsentAbilities",
      "outputs": [
        {
          "components": [
            {
              "internalType": "bool",
              "name": "canStakeEnd",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "canEarlyStakeEnd",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "canMintHedron",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "canMintHedronAtEnd",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "shouldSendTokensToStaker",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "stakeIsTransferrable",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "copyExternalTips",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "hasExternalTips",
              "type": "bool"
            }
          ],
          "internalType": "struct EncodableSettings.ConsentAbilities",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "encoded",
          "type": "uint256"
        }
      ],
      "name": "decodeSettings",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "hedronTipMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "hedronTipMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "tipMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "tipMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "newStakeMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "newStakeMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "newStakeDaysMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint16",
              "name": "newStakeDaysMagnitude",
              "type": "uint16"
            },
            {
              "internalType": "uint8",
              "name": "copyIterations",
              "type": "uint8"
            },
            {
              "components": [
                {
                  "internalType": "bool",
                  "name": "canStakeEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canEarlyStakeEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canMintHedron",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canMintHedronAtEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "shouldSendTokensToStaker",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "stakeIsTransferrable",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "copyExternalTips",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "hasExternalTips",
                  "type": "bool"
                }
              ],
              "internalType": "struct EncodableSettings.ConsentAbilities",
              "name": "consentAbilities",
              "type": "tuple"
            }
          ],
          "internalType": "struct EncodableSettings.Settings",
          "name": "settings",
          "type": "tuple"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "settings",
          "type": "uint256"
        }
      ],
      "name": "decrementCopyIterations",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "defaultEncodedSettings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "defaultSettings",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "hedronTipMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "hedronTipMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "tipMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "tipMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "newStakeMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "newStakeMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "newStakeDaysMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint16",
              "name": "newStakeDaysMagnitude",
              "type": "uint16"
            },
            {
              "internalType": "uint8",
              "name": "copyIterations",
              "type": "uint8"
            },
            {
              "components": [
                {
                  "internalType": "bool",
                  "name": "canStakeEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canEarlyStakeEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canMintHedron",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canMintHedronAtEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "shouldSendTokensToStaker",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "stakeIsTransferrable",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "copyExternalTips",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "hasExternalTips",
                  "type": "bool"
                }
              ],
              "internalType": "struct EncodableSettings.ConsentAbilities",
              "name": "consentAbilities",
              "type": "tuple"
            }
          ],
          "internalType": "struct EncodableSettings.Settings",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "numerator",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "denominator",
          "type": "uint256"
        }
      ],
      "name": "depositAndAddTipToStake",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "depositToken",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "depositTokenTo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "depositTokenUnattributed",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bool",
              "name": "canStakeEnd",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "canEarlyStakeEnd",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "canMintHedron",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "canMintHedronAtEnd",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "shouldSendTokensToStaker",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "stakeIsTransferrable",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "copyExternalTips",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "hasExternalTips",
              "type": "bool"
            }
          ],
          "internalType": "struct EncodableSettings.ConsentAbilities",
          "name": "consentAbilities",
          "type": "tuple"
        }
      ],
      "name": "encodeConsentAbilities",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "encodeInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "hedronTipMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "hedronTipMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "tipMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "tipMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "newStakeMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "newStakeMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "newStakeDaysMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint16",
              "name": "newStakeDaysMagnitude",
              "type": "uint16"
            },
            {
              "internalType": "uint8",
              "name": "copyIterations",
              "type": "uint8"
            },
            {
              "components": [
                {
                  "internalType": "bool",
                  "name": "canStakeEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canEarlyStakeEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canMintHedron",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canMintHedronAtEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "shouldSendTokensToStaker",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "stakeIsTransferrable",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "copyExternalTips",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "hasExternalTips",
                  "type": "bool"
                }
              ],
              "internalType": "struct EncodableSettings.ConsentAbilities",
              "name": "consentAbilities",
              "type": "tuple"
            }
          ],
          "internalType": "struct EncodableSettings.Settings",
          "name": "settings",
          "type": "tuple"
        }
      ],
      "name": "encodeSettings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "encoded",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "currencyIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "numerator",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "denominator",
          "type": "uint256"
        }
      ],
      "name": "encodeTipSettings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getUnattributed",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "globalInfo",
      "outputs": [
        {
          "internalType": "uint256[13]",
          "name": "",
          "type": "uint256[13]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "incrementDay",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "payout",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
            }
          ],
          "internalType": "struct EarningsOracle.Total",
          "name": "total",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "day",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "indexToToken",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "setting",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "isCapable",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "lockedDay",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "stakedDays",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "targetDay",
          "type": "uint256"
        }
      ],
      "name": "isEarlyEnding",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "staker",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "isGoodAccountable",
      "outputs": [
        {
          "internalType": "enum GoodAccounting.GoodAccountingStatus",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "isStakeIdGoodAccountable",
      "outputs": [
        {
          "internalType": "enum GoodAccounting.GoodAccountingStatus",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lastZeroDay",
      "outputs": [
        {
          "internalType": "uint96",
          "name": "",
          "type": "uint96"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "stakeIds",
          "type": "uint256[]"
        }
      ],
      "name": "mintHedronRewards",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes[]",
          "name": "calls",
          "type": "bytes[]"
        },
        {
          "internalType": "bool",
          "name": "allowFailures",
          "type": "bool"
        }
      ],
      "name": "multicall",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "bytes[]",
          "name": "calls",
          "type": "bytes[]"
        },
        {
          "internalType": "bool",
          "name": "allowFailures",
          "type": "bool"
        }
      ],
      "name": "multicallWithDeadline",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "previousBlockhash",
          "type": "bytes32"
        },
        {
          "internalType": "bytes[]",
          "name": "calls",
          "type": "bytes[]"
        },
        {
          "internalType": "bool",
          "name": "allowFailures",
          "type": "bool"
        }
      ],
      "name": "multicallWithPreviousBlockHash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "startDay",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "untilDay",
          "type": "uint256"
        }
      ],
      "name": "payoutDelta",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "payout",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "shares",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "startDay",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "untilDay",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "multiplier",
          "type": "uint256"
        }
      ],
      "name": "payoutDeltaTrucated",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "payout",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "settings",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "fromEnd",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "length",
          "type": "uint256"
        }
      ],
      "name": "readEncodedSettings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "indexes",
          "type": "uint256[]"
        }
      ],
      "name": "removeTipFromStake",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "removeTransferrability",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "settings",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "staker",
          "type": "address"
        }
      ],
      "name": "stakeCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint40",
          "name": "stakeId",
          "type": "uint40"
        }
      ],
      "name": "stakeEnd",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "stakeEndByConsent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "delta",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "count",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "stakeIds",
          "type": "uint256[]"
        }
      ],
      "name": "stakeEndByConsentForMany",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "stakeEndById",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "stakerAddr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "stakeIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint40",
          "name": "stakeIdParam",
          "type": "uint40"
        }
      ],
      "name": "stakeGoodAccounting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "stakeIdInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "stakeIdSettings",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "hedronTipMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "hedronTipMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "tipMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "tipMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "newStakeMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "newStakeMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "newStakeDaysMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint16",
              "name": "newStakeDaysMagnitude",
              "type": "uint16"
            },
            {
              "internalType": "uint8",
              "name": "copyIterations",
              "type": "uint8"
            },
            {
              "components": [
                {
                  "internalType": "bool",
                  "name": "canStakeEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canEarlyStakeEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canMintHedron",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canMintHedronAtEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "shouldSendTokensToStaker",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "stakeIsTransferrable",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "copyExternalTips",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "hasExternalTips",
                  "type": "bool"
                }
              ],
              "internalType": "struct EncodableSettings.ConsentAbilities",
              "name": "consentAbilities",
              "type": "tuple"
            }
          ],
          "internalType": "struct EncodableSettings.Settings",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "stakeIdTipSize",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "stakeIdTips",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "stakeIdToIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "stakeIdToInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "stakeIdToOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "stakeIdToSettings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "staker",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "stakeLists",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint40",
              "name": "stakeId",
              "type": "uint40"
            },
            {
              "internalType": "uint72",
              "name": "stakedHearts",
              "type": "uint72"
            },
            {
              "internalType": "uint72",
              "name": "stakeShares",
              "type": "uint72"
            },
            {
              "internalType": "uint16",
              "name": "lockedDay",
              "type": "uint16"
            },
            {
              "internalType": "uint16",
              "name": "stakedDays",
              "type": "uint16"
            },
            {
              "internalType": "uint16",
              "name": "unlockedDay",
              "type": "uint16"
            },
            {
              "internalType": "bool",
              "name": "isAutoStake",
              "type": "bool"
            }
          ],
          "internalType": "struct IUnderlyingStakeable.StakeStore",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "stakeRestartById",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "newStakeId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "stakeIds",
          "type": "uint256[]"
        }
      ],
      "name": "stakeRestartManyById",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "newStakedDays",
          "type": "uint256"
        }
      ],
      "name": "stakeStart",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "newStakedDays",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "settings",
          "type": "uint256"
        }
      ],
      "name": "stakeStartFromBalanceFor",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "newStakedDays",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "settings",
          "type": "uint256"
        }
      ],
      "name": "stakeStartFromUnattributedFor",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "newStakedDays",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "settings",
          "type": "uint256"
        }
      ],
      "name": "stakeStartFromWithdrawableFor",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "stakeTransfer",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "day",
          "type": "uint256"
        }
      ],
      "name": "storeDay",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "payout",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
            }
          ],
          "internalType": "struct EarningsOracle.Total",
          "name": "total",
          "type": "tuple"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "startDay",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "untilDay",
          "type": "uint256"
        }
      ],
      "name": "storeDays",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "payout",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "shares",
              "type": "uint256"
            }
          ],
          "internalType": "struct EarningsOracle.Total",
          "name": "total",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "day",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "totals",
      "outputs": [
        {
          "internalType": "uint128",
          "name": "payout",
          "type": "uint128"
        },
        {
          "internalType": "uint128",
          "name": "shares",
          "type": "uint128"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "count",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "hedronTipMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "hedronTipMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "tipMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "tipMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "newStakeMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "newStakeMagnitude",
              "type": "uint64"
            },
            {
              "internalType": "uint8",
              "name": "newStakeDaysMethod",
              "type": "uint8"
            },
            {
              "internalType": "uint16",
              "name": "newStakeDaysMagnitude",
              "type": "uint16"
            },
            {
              "internalType": "uint8",
              "name": "copyIterations",
              "type": "uint8"
            },
            {
              "components": [
                {
                  "internalType": "bool",
                  "name": "canStakeEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canEarlyStakeEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canMintHedron",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "canMintHedronAtEnd",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "shouldSendTokensToStaker",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "stakeIsTransferrable",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "copyExternalTips",
                  "type": "bool"
                },
                {
                  "internalType": "bool",
                  "name": "hasExternalTips",
                  "type": "bool"
                }
              ],
              "internalType": "struct EncodableSettings.ConsentAbilities",
              "name": "consentAbilities",
              "type": "tuple"
            }
          ],
          "internalType": "struct EncodableSettings.Settings",
          "name": "settings",
          "type": "tuple"
        }
      ],
      "name": "updateSettings",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "settings",
          "type": "uint256"
        }
      ],
      "name": "updateSettingsEncoded",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "verifyCustodian",
      "outputs": [],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "stakeId",
          "type": "uint256"
        }
      ],
      "name": "verifyStakeOwnership",
      "outputs": [],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "address payable",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withdrawTokenTo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "withdrawableBalanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ],
  "bytecode": "0x60a06040523480156200001157600080fd5b50600080805260046020527f17ef568e3e12ab5b9c7254a8d58478811de00f9e6eb34345acd53bf8fd09d3ec8190556001906200004e81620000bb565b506200006e732b591e99afe9f32eaa6214f7b7629768c40eeb39620000bb565b506200008e733819f64f282bf135d62168c1e513280daf905e06620000bb565b506001600160601b0382166080528015620000b357620000b060008262000147565b50505b5050620004d0565b600280546001600160a01b0383166000818152600360205260408082208490556001840185559381527f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace830180546001600160a01b0319168317905592518291907f1707ae19990646bcbe529f1bdf88a39a0365ca51f56298de8d0349aab5b01595908590a392915050565b604080518082019091526000808252602082015260008284101562000184575b6200017384836200018a565b915083600101935082841062000167575b50929050565b60408051808201909152600080825260208201526008548314620001c157604051631eb49d6d60e11b815260040160405180910390fd5b6040516390de687160e01b8152600481018490526000908190732b591e99afe9f32eaa6214f7b7629768c40eeb39906390de687190602401606060405180830381865afa15801562000217573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200023d919062000419565b506001600160481b031691506001600160481b031691506080516001600160601b0316851180156200026d575080155b156200028c57604051631eb49d6d60e11b815260040160405180910390fd5b8351602085015181158015620002a0575080155b8015620002ad5750600087115b15620003145760006008620002c460018a62000488565b81548110620002d757620002d7620004a4565b6000918252602091829020604080518082019091529101546001600160801b03808216808452600160801b90920416919092018190529093509150505b620003208285620004ba565b8086526001600160801b0310156200034b57604051631eb49d6d60e11b815260040160405180910390fd5b620003578184620004ba565b602086018190526001600160801b0310156200038657604051631eb49d6d60e11b815260040160405180910390fd5b50506040805180820190915283516001600160801b039081168252602080860151821690830190815260088054600181018255600091909152925190518216600160801b029116177ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee39091015550909392505050565b80516001600160481b03811681146200041457600080fd5b919050565b6000806000606084860312156200042f57600080fd5b6200043a84620003fc565b92506200044a60208501620003fc565b9150604084015166ffffffffffffff811681146200046757600080fd5b809150509250925092565b634e487b7160e01b600052601160045260246000fd5b818103818111156200049e576200049e62000472565b92915050565b634e487b7160e01b600052603260045260246000fd5b808201808211156200049e576200049e62000472565b608051614f53620004f360003960008181610b8101526131e50152614f536000f3fe6080604052600436106104b95760003560e01c80638529beb61161026b578063d02f80ab1161014f578063ecfbb788116100c1578063f6f7863a11610085578063f6f7863a14610fa6578063f6f98f7414610fd3578063fbd512b814610ff3578063fd0bc8fb14611020578063fe63fde614611033578063ff839dab1461105357600080fd5b8063ecfbb78814610f16578063eef0246814610f36578063f04b5fa014610f49578063f288caaf14610f6b578063f3e349ae14610f8b57600080fd5b8063d8b7715011610113578063d8b7715014610e61578063dbfda93914610e89578063dfc1b17414610eb0578063e031031214610ec3578063e5dcb01614610ee3578063e9aaa29a14610f0357600080fd5b8063d02f80ab14610d99578063d3650a6914610db9578063d4138e6e14610de6578063d63a4d5c14610e14578063d84a183514610e3457600080fd5b8063ae4358d7116101e8578063c6cfdd2a116101ac578063c6cfdd2a14610cd7578063c89ade2414610cf7578063c9ed8bfa14610d24578063cc1f2afa14610d37578063ce16025114610d59578063d0085e7e14610d7957600080fd5b8063ae4358d714610c44578063b197a6e114610c64578063b6fae73914610c84578063bdbb43b714610c97578063befef31114610cb757600080fd5b80639b63e4681161022f5780639b63e46814610bbb5780639c97026e14610bdb5780639d00317f14610bfb578063a32d7dbe14610c0e578063a971207014610c2e57600080fd5b80638529beb614610af15780638b1e31c714610b2957806397e5c16614610b3c5780639803864f14610b4f5780639a8a785514610b6f57600080fd5b80633f9d89501161039d5780635965f8371161030f578063693eafff116102d3578063693eafff14610a1b5780636c7d076514610a4457806370a0823114610a645780637705f7d614610a845780637d1e7da114610aa45780637d78a58c14610ac457600080fd5b80635965f837146109ab5780635c9302c9146109be5780635e606478146109d357806365cf71b2146109e657806367ed0c7914610a0657600080fd5b80634ac139c8116103615780634ac139c8146108d85780634d4f6ea9146108f85780634dadffa21461092857806351f2db8e1461094857806352a438b814610969578063553f0a661461098957600080fd5b80633f9d8950146108185780633fc214b914610850578063401bce531461087057806343a2b084146108985780634868f61d146108b857600080fd5b8063223c217b1161043657806333060d90116103fa57806333060d9014610772578063338b5dea14610792578063338d52a7146107a5578063343009a2146107c5578063380c1273146107e55780633a785e431461080557600080fd5b8063223c217b1461065d5780632607443b1461067057806327d0cd761461070a57806327ef53491461072a578063329125961461075f57600080fd5b80631354e15f1161047d5780631354e15f1461058a57806319ff5fff1461059d5780631b338710146105bd5780631e9701d4146105fd578063216cd5a41461061d57600080fd5b806304ed31f7146104c557806309c14479146104e95780630e4af6741461050b5780630e5f88f61461053857806310c09bbd1461054d57600080fd5b366104c057005b600080fd5b3480156104d157600080fd5b506008545b6040519081526020015b60405180910390f35b3480156104f557600080fd5b506105096105043660046141eb565b611073565b005b34801561051757600080fd5b5061052b61052636600461425e565b6110ca565b6040516104e091906142a9565b34801561054457600080fd5b506002546104d6565b34801561055957600080fd5b5061056d6105683660046142d1565b6110e1565b604080519283526001600160a01b039091166020830152016104e0565b6104d66105983660046142ea565b611102565b3480156105a957600080fd5b506104d66105b83660046142d1565b61114b565b3480156105c957600080fd5b506105dd6105d83660046142d1565b611164565b604080516001600160801b039384168152929091166020830152016104e0565b34801561060957600080fd5b50610509610618366004614325565b611199565b34801561062957600080fd5b5061063d6106383660046142d1565b6111a9565b6040805183518152602093840151938101939093528201526060016104e0565b6104d661066b36600461437b565b611283565b34801561067c57600080fd5b5061069061068b3660046143bc565b61129a565b6040516104e09190600060e08201905064ffffffffff835116825260208301516001600160481b0380821660208501528060408601511660408501525050606083015161ffff80821660608501528060808601511660808501528060a08601511660a0850152505060c0830151151560c083015292915050565b34801561071657600080fd5b506104d661072536600461448c565b6112ac565b34801561073657600080fd5b5061074a6107453660046142d1565b6112df565b604080519283526020830191909152016104e0565b61050961076d366004614567565b6112eb565b34801561077e57600080fd5b506104d661078d3660046145a8565b611341565b6104d66107a03660046143bc565b61134c565b3480156107b157600080fd5b506105096107c03660046142d1565b611359565b3480156107d157600080fd5b506105096107e03660046145c5565b61137f565b3480156107f157600080fd5b506104d66108003660046145f5565b6113d3565b61074a610813366004614621565b6113e0565b34801561082457600080fd5b506108386108333660046142d1565b61142f565b6040516001600160a01b0390911681526020016104e0565b34801561085c57600080fd5b5061050961086b366004614567565b611443565b34801561087c57600080fd5b50610838738bd3d1472a656e312e94fb1bbdd599b8c51d18e381565b3480156108a457600080fd5b506104d66108b3366004614665565b6115ba565b3480156108c457600080fd5b506105096108d33660046143bc565b6115f8565b3480156108e457600080fd5b506104d66108f33660046145f5565b611603565b34801561090457600080fd5b506109186109133660046142d1565b61170b565b60405190151581526020016104e0565b34801561093457600080fd5b506104d66109433660046142d1565b611716565b34801561095457600080fd5b506d040000000100000001020000ff016104d6565b34801561097557600080fd5b506105096109843660046146b6565b61172a565b34801561099557600080fd5b5061099e611753565b6040516104e09190614749565b6105096109b93660046146b6565b611768565b3480156109ca57600080fd5b506104d6611776565b6104d66109e13660046142ea565b611780565b3480156109f257600080fd5b50610509610a01366004614824565b6117ab565b348015610a1257600080fd5b5061063d6117bd565b348015610a2757600080fd5b50610a316115b381565b60405161ffff90911681526020016104e0565b348015610a5057600080fd5b506104d6610a5f3660046146b6565b611883565b348015610a7057600080fd5b506104d6610a7f3660046145a8565b6118b4565b348015610a9057600080fd5b50610918610a9f3660046145f5565b6118bf565b348015610ab057600080fd5b5061052b610abf3660046142d1565b6118cc565b348015610ad057600080fd5b50610ae4610adf3660046142d1565b6118ea565b6040516104e0919061485b565b348015610afd57600080fd5b506104d6610b0c36600461486a565b600160209081526000928352604080842090915290825290205481565b610509610b37366004614898565b6118fb565b610509610b4a3660046148bd565b611999565b348015610b5b57600080fd5b5061074a610b6a3660046146b6565b6119b9565b348015610b7b57600080fd5b50610ba37f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160601b0390911681526020016104e0565b348015610bc757600080fd5b506104d6610bd63660046148f7565b611a8c565b348015610be757600080fd5b50610509610bf6366004614567565b611aa5565b61074a610c09366004614621565b611adf565b348015610c1a57600080fd5b50610509610c293660046141eb565b611b12565b348015610c3a57600080fd5b506104d660001981565b348015610c5057600080fd5b506104d6610c5f3660046149fe565b611b3c565b348015610c7057600080fd5b50610509610c7f36600461425e565b611b47565b6104d6610c923660046142ea565b611b52565b348015610ca357600080fd5b50610509610cb23660046142d1565b611b71565b348015610cc357600080fd5b506104d6610cd23660046145a8565b611b7a565b348015610ce357600080fd5b50610509610cf23660046143bc565b611b85565b348015610d0357600080fd5b506104d6610d123660046145a8565b60006020819052908152604090205481565b6104d6610d323660046142d1565b611b8f565b348015610d4357600080fd5b50610838600080516020614efe83398151915281565b348015610d6557600080fd5b5061099e610d743660046142d1565b611b9c565b348015610d8557600080fd5b506104d6610d94366004614ac7565b611bbc565b348015610da557600080fd5b50610838610db43660046142d1565b611bca565b348015610dc557600080fd5b506104d6610dd43660046142d1565b60056020526000908152604090205481565b348015610df257600080fd5b50610dfc6103e881565b6040516001600160801b0390911681526020016104e0565b348015610e2057600080fd5b506104d6610e2f3660046146b6565b611bf4565b348015610e4057600080fd5b50610e54610e4f3660046142d1565b611c00565b6040516104e09190614af9565b348015610e6d57600080fd5b50610838733819f64f282bf135d62168c1e513280daf905e0681565b348015610e9557600080fd5b50610e9e608081565b60405160ff90911681526020016104e0565b6104d6610ebe366004614665565b611c34565b348015610ecf57600080fd5b506104d6610ede3660046145a8565b611c4b565b348015610eef57600080fd5b50610918610efe3660046146b6565b611ccc565b610509610f11366004614b10565b611cd8565b348015610f2257600080fd5b5061063d610f313660046146b6565b611d15565b6104d6610f4436600461437b565b611d40565b348015610f5557600080fd5b50610f5e611d4d565b6040516104e09190614b5b565b348015610f7757600080fd5b5061099e610f863660046142d1565b611dc6565b348015610f9757600080fd5b50610dfc6001600160801b0381565b348015610fb257600080fd5b506104d6610fc13660046145a8565b60036020526000908152604090205481565b348015610fdf57600080fd5b506104d6610fee366004614898565b611dd7565b348015610fff57600080fd5b506104d661100e3660046142d1565b60046020526000908152604090205481565b61074a61102e3660046142d1565b611dee565b34801561103f57600080fd5b506104d661104e3660046142d1565b611e10565b34801561105f57600080fd5b506104d661106e3660046142d1565b611e1b565b8361107f600143614ba3565b40146110b95783611091600143614ba3565b6040516302e4f0f160e31b815260048101929092524060248201526044015b60405180910390fd5b6110c4838383611e6b565b50505050565b60006110d7848484611f51565b90505b9392505050565b600081815260046020526040812054819060a081901c905b91509150915091565b60006111378561112886611123600080516020614efe8339815191526120c7565b6120f4565b8561113230612112565b61218c565b9050611143818361229a565b949350505050565b60008181526004602052604081205460a01c5b92915050565b6008818154811061117457600080fd5b6000918252602090912001546001600160801b038082169250600160801b9091041682565b6111a4838383611e6b565b505050565b604080518082019091526000808252602082015260006103e883116111ce57826111d2565b6103e85b6008549093506111e28185614bb6565b93506000600080516020614efe8339815191526001600160a01b0316635c9302c96040518163ffffffff1660e01b8152600401602060405180830381865afa158015611232573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112569190614bc9565b90508185148061126557508085115b1561126e578094505b61127882866122c4565b935093505050915091565b60006110d78484611295873387612303565b61237b565b6112a261408f565b6110da8383612452565b60008515806112b9575084155b156112c6575060006112d6565b6112d386868686866124d7565b90505b95945050505050565b6000806110f9836125e6565b600081816112f830612112565b6080611302612659565b901b1790505b61132a85858581811061131d5761131d614be2565b90506020020135826126cb565b600190940193915050818310611308575050505050565b600061115e82612112565b60006110da8333846129de565b61137c306113768360009081526004602052604090205460a01c90565b836129f8565b50565b611390338264ffffffffff16612a26565b60006113b8838364ffffffffff1660016113a930612112565b6113b39190614ba3565b612a8b565b90506110c4600080516020614efe833981519152338361237b565b60006110d7848484612b6c565b6000806113ee873387612b87565b945060006113fc8787612c5d565b9050611409888288612ca1565b61141287612ce2565b611420888289898989612d54565b92509250509550959350505050565b60008181526004602052604081205461115e565b600080805260056020527f05b8ccbb9d4d8fb16ea74ce3c29a41f1b461fbdaff4714a0d9a8eb05499746bc548291908190819081908190816114b0826114ab8c8b858161149257611492614be2565b9050602002013560009081526004602052604090205490565b612f06565b90505b8989888181106114c5576114c5614be2565b9050602002013592506114e98360009081526004602052604090205460a081901c91565b6000858152600560205260409020549096509094509150336001600160a01b038616148061151d575061151d826002612f3e565b1561157957600061152e8387612f06565b905081811461155e57611559836004733819f64f282bf135d62168c1e513280daf905e06858b612f5c565b600096505b80915061156b8585612f8e565b6115759088614bb6565b9650505b8660010196508787106114b35785156115ae576115ae826004733819f64f282bf135d62168c1e513280daf905e06848a612f5c565b50505050505050505050565b6000806115c6866120c7565b90506127106115d58483614bf8565b6115df9190614c25565b91506115ee8686868585612f9a565b5050949350505050565b6111a4823383612b87565b600061160f8484614ba3565b6008858154811061162257611622614be2565b9060005260206000200160000160109054906101000a90046001600160801b03166008858154811061165657611656614be2565b60009182526020909120015461167c9190600160801b90046001600160801b0316614c39565b6001600160801b0316836008878154811061169957611699614be2565b600091825260209091200154600880546001600160801b0390921691889081106116c5576116c5614be2565b6000918252602090912001546116e491906001600160801b0316614c39565b6001600160801b03166116f79190614bf8565b6117019190614c25565b6110d79190614ba3565b600061115e82612fd0565b60008181526007602052604081205461115e565b611743600080516020614efe8339815191523384612b87565b506111a433838361113230612112565b61175b6140cb565b611763612fea565b905090565b611772828261308f565b5050565b6000611763612659565b600061179b600080516020614efe8339815191523386612b87565b5061113785858561113230612112565b6111a483838364ffffffffff166130a3565b60408051808201909152600080825260208201526000806008805490509050600080516020614efe8339815191526001600160a01b0316635c9302c96040518163ffffffff1660e01b8152600401602060405180830381865afa158015611828573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061184c9190614bc9565b811061185b5750909160009150565b61187b816040518060400160405280600081526020016000815250613123565b939092509050565b6007602052816000526040600020818154811061189f57600080fd5b90600052602060002001600091509150505481565b600061115e82613399565b60006110d78484846133d6565b60008181526004602052604081205461115e90309060a01c84611f51565b6118f2614126565b61115e826133ec565b6119053383612a26565b61190e82612fd0565b61192b57604051631eb49d6d60e11b815260040160405180910390fd5b60008281526004602090815260409182902080546001600160a01b0385166001600160a01b03198216811790925583518681529283019190915260a01c917f615a7c35d84db011c8af86f253bd0dcee771fb0da2c206a4abd88f671cbf29ce910160405180910390a1505050565b611772826119b46119af368590038501856149fe565b6134be565b61308f565b6000806000600885815481106119d1576119d1614be2565b60009182526020808320604080518082019091529201546001600160801b038082168452600160801b9091041690820152600880549193509086908110611a1a57611a1a614be2565b6000918252602091829020604080518082019091529101546001600160801b03808216808452600160801b90920416928201929092528351909250611a5e91614c39565b82602001518260200151611a729190614c39565b6001600160801b03918216955016925050505b9250929050565b600061115e611aa036849003840184614c59565b613579565b6000815b611aca848484818110611abe57611abe614be2565b905060200201356125e6565b5050816001019150808210611aa95750505050565b600080611aec8686612c5d565b50611af686612ce2565b611b04873388888888612d54565b915091509550959350505050565b834211156110b95760405163b979466160e01b8152600481018590524260248201526044016110b0565b600061115e826134be565b6111a48383836129f8565b600061113785611128600080516020614efe8339815191523388612303565b61137c81613666565b600061115e826120c7565b6117728282612a26565b600061115e8260006136bc565b611ba46140cb565b60008281526005602052604090205461115e906136f5565b60006112d68585858561379c565b60028181548110611bda57600080fd5b6000918252602090912001546001600160a01b0316905081565b60006110da83836120f4565b604080518082019091526000808252602082015261115e826040518060400160405280600081526020016000815250613123565b60006112d685858585611c468a6120c7565b612f9a565b60006001600160a01b0382163b611c7557604051631eb49d6d60e11b815260040160405180910390fd5b6001600160a01b038216600090815260036020526040902054151580611ca257506001600160a01b038216155b15611cc357506001600160a01b031660009081526003602052604090205490565b61115e82613800565b60006110da8383612f3e565b6111a48383838080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525061388c92505050565b60408051808201909152600080825260208201526000611d3584846122c4565b915091509250929050565b60006110d78484846129de565b611d5561416a565b600080516020614efe8339815191526001600160a01b031663f04b5fa06040518163ffffffff1660e01b81526004016101a060405180830381865afa158015611da2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117639190614c76565b611dce6140cb565b61115e826136f5565b600060a083901b6001600160a01b038316176110da565b6000806110f983611dfe30612112565b6080611e08612659565b901b176126cb565b600061115e82613a72565b6000611e273383612a26565b60008281526004602052604090205460a01c611e49818460016113a930612112565b9150611e64600080516020614efe833981519152338461237b565b5050919050565b8160008060605b30878785818110611e8557611e85614be2565b9050602002810190611e979190614cf4565b604051611ea5929190614d3a565b600060405180830381855af49150503d8060008114611ee0576040519150601f19603f3d011682016040523d82523d6000602084013e611ee5565b606091505b50909250905081611f3b578415611f3357827f73214f6d0ff4c562fafa80c5c6631b79482a52c9f4769d2cec51b9bc6751e1ec82604051611f269190614d4a565b60405180910390a2611f3b565b805160208201fd5b826001019250838310611e725750505050505050565b60405163033060d960e41b81526001600160a01b03841660048201526000908190600080516020614efe833981519152906333060d9090602401602060405180830381865afa158015611fa8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611fcc9190614bc9565b9050808410611fdf5760049150506110da565b6000611feb8686612452565b805190915064ffffffffff168414612008576003925050506110da565b612092816060015161ffff16826080015161ffff16600080516020614efe8339815191526001600160a01b0316635c9302c96040518163ffffffff1660e01b8152600401602060405180830381865afa158015612069573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061208d9190614bc9565b6133d6565b156120a2576002925050506110da565b60a081015161ffff16156120bb576001925050506110da565b50600095945050505050565b6001600160a01b0381166000908152602081905260408120546120ea8330613ac0565b61115e9190614ba3565b600082158061210257508183115b61210c57826110da565b50919050565b60405163033060d960e41b81526001600160a01b0382166004820152600090600080516020614efe833981519152906333060d90906024015b602060405180830381865afa158015612168573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061115e9190614bc9565b604051630a54871760e31b81526004810184905260248101839052600090600080516020614efe833981519152906352a438b890604401600060405180830381600087803b1580156121dd57600080fd5b505af11580156121f1573d6000803e3d6000fd5b5050604051632607443b60e01b815230600482015260248101859052600080516020614efe8339815191529250632607443b915060440160e060405180830381865afa158015612245573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122699190614d98565b5164ffffffffff16905060a082901b6001600160a01b03861617600082815260046020526040902055949350505050565b60008281526005602052604090205461177290839060ff198416608090911617607f841617613b4b565b60408051808201909152600080825260208201526000828410156122fd575b6122ed8483613123565b91508360010193508284106122e3575b50929050565b6001600160a01b03808416600090815260016020908152604080832093861683529290529081205461233583826120f4565b6001600160a01b03958616600081815260016020908152604080832098909916825296875287812093839003909355825293819052939093208054839003905550919050565b60006001600160a01b0384166123a35761239e6001600160a01b03841683613b9c565b61244b565b60405163a9059cbb60e01b81526001600160a01b0384811660048301526024820184905285169063a9059cbb906044016020604051808303816000875af11580156123f2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124169190614e38565b61244b576040516317e3057d60e31b81523060048201526001600160a01b0384166024820152604481018390526064016110b0565b5092915050565b61245a61408f565b604051632607443b60e01b81526001600160a01b038416600482015260248101839052600080516020614efe83398151915290632607443b9060440160e060405180830381865afa1580156124b3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110da9190614d98565b6000600485101561255c57600385101561250957846001036124fa5750826125cf565b50608081015161ffff166125cf565b6080820151606083015161ffff918216911680850382810361252d57829350612554565b82811061254c5782600101818161254657612546614c0f565b06860391505b818603830393505b5050506125cf565b846005036125795781602001516001600160481b031692506125a9565b846006036125a95781602001516001600160481b03168311156125a95781602001516001600160481b0316830392505b63ffffffff80851690602086901c1681858202816125c9576125c9614c0f565b04925050505b8581116125dc57806112d3565b5093949350505050565b6000806125f33384612a26565b60008381526004602052604081205460a081901c916126123084612452565b90506000600161262130612112565b61262b9190614ba3565b9050612638848883612a8b565b955061264e8387846080015161ffff168461218c565b945050505050915091565b6000600080516020614efe8339815191526001600160a01b0316635c9302c96040518163ffffffff1660e01b8152600401602060405180830381865afa1580156126a7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117639190614bc9565b60008181806126eb8660009081526004602052604090205460a081901c91565b9150915060006126fb8388613cb5565b805190915064ffffffffff1660000361271a5760009450505050611a85565b60008781526005602052604081205490612735908290612f3e565b612746576000955050505050611a85565b612768826060015161ffff16836080015161ffff16608060ff1688901c6133d6565b801561277c575061277a816001612f3e565b155b1561278e576000955050505050611a85565b612799816003612f3e565b1561282c5760006127aa858a612f8e565b905060f882901c80156128015760006127d383836001600160401b0360b888901c1682896124d7565b905080156127ff576127fc8b87733819f64f282bf135d62168c1e513280daf905e068487613ce8565b92505b505b811561282957612829836004733819f64f282bf135d62168c1e513280daf905e068886612f5c565b50505b61283585614e55565b945061284b8489876001600160801b0316612a8b565b955060b081901c60ff16801561289f57600061287788836001600160401b03607087901c1682886124d7565b9050801561289d5761289a8a86600080516020614efe833981519152848c613ce8565b97505b505b50606881901c60ff16600087158015906128b95750600082115b156129645760006128da89846001600160401b03602888901c1682896124d7565b90506000602085901c60ff166128f1576000612913565b6129136115b3602087901c60ff16601088901c61ffff1660808d901c8a6124d7565b9050801561296157818a0399506129358783838c6001600160801b031661218c565b925061294089614e6c565b985060028061294e87613a72565b901c901b60011794506129618386613b4b565b50505b871561298657612986836004600080516020614efe833981519152888c612f5c565b60008a8152600560205260408120556129a0836007612f3e565b156129d1576129d18a866000841180156129c057506129c0866006612f3e565b6129cb576000613d57565b83613d57565b5050505050509250929050565b60006129eb843384612b87565b915061244b848484612ca1565b6000612a05848484611f51565b6004811115612a1657612a16614293565b036111a4576111a48383836130a3565b6000818152600460205260409020546001600160a01b038316906001600160a01b0316146117725760008181526004602052604090205482906040516318c1e22960e31b81526001600160a01b039283166004820152911660248201526044016110b0565b600080612a9730613399565b604051631a1804d160e11b81526004810187905264ffffffffff86166024820152909150600080516020614efe8339815191529063343009a290604401600060405180830381600087803b158015612aee57600080fd5b505af1158015612b02573d6000803e3d6000fd5b5050505084831115612b45576000612b1a3087612452565b5164ffffffffff16600090815260046020526040902080546001600160a01b031660a088901b179055505b80612b4f30613399565b600095865260046020526040862095909555909303949350505050565b6000612b7a82610100614ba3565b9390921b90921c92915050565b60006001600160a01b03841615612c54578115612c4f576040516323b872dd60e01b81526001600160a01b038481166004830152306024830152604482018490528516906323b872dd906064016020604051808303816000875af1158015612bf3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612c179190614e38565b612c4c576040516317e3057d60e31b81526001600160a01b0384166004820152306024820152604481018390526064016110b0565b50805b6110da565b50349392505050565b60008281526004602052604090205481158015612c835750336001600160a01b03821614155b1561115e57604051631eb49d6d60e11b815260040160405180910390fd5b6001600160a01b0392831660008181526001602090815260408083209590961682529384528481208054840190559081529182905291902080549091019055565b612ceb30612112565b600003612d0b57604051631eb49d6d60e11b815260040160405180910390fd5b80612d2e30612d298460009081526004602052604090205460a01c90565b612452565b5164ffffffffff161461137c57604051631eb49d6d60e11b815260040160405180910390fd5b6001600160a01b0380871660009081526001602090815260408083209389168352929052908120548190612d899086906120f4565b94506001851015612d9f57506000905080612efb565b6000868152600460209081526040808320546006835281842080546001600160a01b0319166001600160a01b03909216919091179055600590915290205460808117808214612df257612df28882613b4b565b8615612e25576001600160a01b03808b166000908152600160209081526040808320938d16835292905220805488900390555b6001600160a01b038a1660009081526003602052604090205480158015612e5457506001600160a01b038b1615155b15612e7257604051631eb49d6d60e11b815260040160405180910390fd5b6000612e80828a8a8a61379c565b60008b8152600760209081526040808320805460018101825590845291909220810183905590519192509081906001600160a01b038f16908d907f457d1c14c88c62c38e74ae53403c8f2539261a4b95ee942daaa268be84058cb690612ee99087815260200190565b60405180910390a49550889450505050505b965096945050505050565b60008160a0612f16856004612f3e565b612f21576000612f24565b60015b60ff16901b60ff16176001600160a01b0316905092915050565b600060ff612f4c8382614ba3565b84901b901c600114905092915050565b612f668585612f3e565b15612f7c57612f7683838361237b565b50612f87565b612f87838383612ca1565b5050505050565b60006110da8383614009565b6000612fa683836120f4565b905080156112d6578415612fc557612fbf86858361237b565b506112d6565b6112d6868583612ca1565b600081815260056020819052604082205461115e91612f3e565b612ff26140cb565b506040805161014081018252600080825260208083018290528284018290526060808401839052600460808086019190915264010000000160a080870191909152600260c08088019190915260e080880187905260ff610100808a019190915289519081018a5260018152958601879052978501869052928401859052908301849052820183905281018290529283015261012081019190915290565b6130993383612a26565b611772828261229a565b6040516332e7b8d960e11b81526001600160a01b03841660048201526024810183905264ffffffffff82166044820152600080516020614efe833981519152906365cf71b290606401600060405180830381600087803b15801561310657600080fd5b505af115801561311a573d6000803e3d6000fd5b50505050505050565b6040805180820190915260008082526020820152600854831461315957604051631eb49d6d60e11b815260040160405180910390fd5b6040516390de687160e01b8152600481018490526000908190600080516020614efe833981519152906390de687190602401606060405180830381865afa1580156131a8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906131cc9190614e85565b506001600160481b031691506001600160481b031691507f00000000000000000000000000000000000000000000000000000000000000006001600160601b031685118015613219575080155b1561323757604051631eb49d6d60e11b815260040160405180910390fd5b835160208501518115801561324a575080155b80156132565750600087115b156132b7576000600861326a60018a614ba3565b8154811061327a5761327a614be2565b6000918252602091829020604080518082019091529101546001600160801b03808216808452600160801b90920416919092018190529093509150505b6132c18285614bb6565b8086526001600160801b0310156132eb57604051631eb49d6d60e11b815260040160405180910390fd5b6132f58184614bb6565b602086018190526001600160801b03101561332357604051631eb49d6d60e11b815260040160405180910390fd5b50506040805180820190915283516001600160801b039081168252602080860151821690830190815260088054600181018255600091909152925190518216600160801b029116177ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee39091015550909392505050565b6040516370a0823160e01b81526001600160a01b0382166004820152600090600080516020614efe833981519152906370a082319060240161214b565b6000816133e38486614bb6565b11949350505050565b6133f4614126565b60405180610100016040528060028461340d9190614ed3565b600114151581526020016002600160ff1685901c61342b9190614ed3565b6001148152602001613440600285811c614ed3565b60011481526020016134576002600386901c614ed3565b600114815260200161346e6002600486901c614ed3565b60011481526020016134856002600586901c614ed3565b600114815260200161349c6002600686901c614ed3565b60011481526020016134b36002600786901c614ed3565b600114905292915050565b60006134ce826101200151613579565b600860ff1683610100015160ff16901b601060ff168460e0015161ffff16901b602060ff168560c0015160ff16901b602860ff168660a001516001600160401b0316901b606860ff16876080015160ff16901b607060ff1688606001516001600160401b0316901b60b060ff16896040015160ff16901b60b860ff168a602001516001600160401b0316901b60f860ff168b6000015160ff16901b1717171717171717179050919050565b805160009061358957600061358c565b60015b602083015160019061359f5760006135a2565b60015b60ff16901b600260ff1684604001516135bc5760006135bf565b60015b60ff16901b600360ff1685606001516135d95760006135dc565b60015b60ff16901b600460ff1686608001516135f65760006135f9565b60015b60ff16901b600560ff168760a00151613613576000613616565b60015b60ff16901b600660ff168860c00151613630576000613633565b60015b60ff16901b600760ff168960e0015161364d576000613650565b60015b60ff16901b1717171717171760ff169050919050565b6000818152600460205260409020546001600160a01b031661137c576000818152600460205260409020546040516318c1e22960e31b81526001600160a01b0390911660048201523060248201526044016110b0565b60006136c83384612a26565b50600082815260056020819052604090912054603f198116601f909116179082901b1761115e8382613b4b565b6136fd6140cb565b604080516101408101825260f884901c81526001600160401b0360b885901c811660208084019190915260b086901c60ff90811694840194909452607086901c82166060840152606886901c84166080840152602886901c90911660a083015284901c821660c082015261ffff601085901c1660e0820152600884901c8216610100820152906101208201906137949085166133ec565b905292915050565b600080831180156137ab575081155b156137c957604051631eb49d6d60e11b815260040160405180910390fd5b5060e084901b608084901b176fffffffffffffffff0000000000000000604084901b16176001600160401b03821617949350505050565b600280546001600160a01b0383166000818152600360205260408082208490556001840185559381527f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace830180546001600160a01b0319168317905592518291907f1707ae19990646bcbe529f1bdf88a39a0365ca51f56298de8d0349aab5b01595908590a392915050565b600082815260046020526040812054156138b1576138aa3384612a26565b50336138cb565b506000828152600660205260409020546001600160a01b03165b600083815260076020526040812080549091906138ea90600190614ba3565b845190915060005b600086828151811061390657613906614be2565b60200260200101519050600085828154811061392457613924614be2565b9060005260206000200154905060008511156139765785858154811061394c5761394c614be2565b906000526020600020015486838154811061396957613969614be2565b6000918252602090912001555b8580548061398657613986614ee7565b600190038181906000526020600020016000905590556000600260e083901c815481106139b5576139b5614be2565b6000918252602090912001546001600160a01b031690506139e481896001600160601b03608086901c16612ca1565b82816001600160a01b03168b7f0cf144859ed0b60e76de3e005a909e8dd54359675ba26a9321c32b1fc578007385604051613a2191815260200190565b60405180910390a4505060001990930192506001018181106138f257600019830361311a57600087815260056020526040902054613a688860ff198316607f841617613b4b565b5050505050505050565b6000600882901c60ff16808203613a8b57505060ff1690565b60fe198101613a9b575090919050565b613aa481614e55565b61ffff19841660089190911b1760ff9093169290921792915050565b60006001600160a01b03831615613b3b576040516370a0823160e01b81526001600160a01b0383811660048301528416906370a0823190602401602060405180830381865afa158015613b17573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612c4f9190614bc9565b506001600160a01b031631919050565b600082815260056020526040908190208290555182907f6a1078c91220965ad51b5fb47f0c9098a1f0dc4ee8f3b2e019eb390c3f586c1590613b909084815260200190565b60405180910390a25050565b80471015613bec5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e636500000060448201526064016110b0565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114613c39576040519150601f19603f3d011682016040523d82523d6000602084013e613c3e565b606091505b50509050806111a45760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d6179206861766520726576657274656400000000000060648201526084016110b0565b613cbd61408f565b613cc73084612452565b805190915064ffffffffff16821461115e57613ce161408f565b905061115e565b6000818311613cf75782613cf9565b815b92508282039150836001600160a01b0316856001600160a01b0316877f23085cb6357862a12f1bdb84a0cb1a05b42455b4baa94f3aa8c09c76731bd12186604051613d4691815260200190565b60405180910390a450949350505050565b60008381526007602052604081205481805b600087815260076020526040902084613d83600186614ba3565b613d8d9190614ba3565b81548110613d9d57613d9d614be2565b9060005260206000200154915081905060076000888152602001908152602001600020805480613dcf57613dcf614ee7565b600190038181906000526020600020016000905590556000600260e084901c81548110613dfe57613dfe614be2565b60009182526020808320909101546001600160a01b03908116808452600183526040808520928c168552919092528220549092506001600160801b0385168203613e5a57608085901c6001600160601b03169450849150613eaa565b608085901c6001600160601b03169150846001600160401b031648604087901c6001600160401b0316613e8d9190614bf8565b613e979190614c25565b9450613ea385836120f4565b9450848203015b8415613f1e57826001600160a01b0316896001600160a01b03168b7f23085cb6357862a12f1bdb84a0cb1a05b42455b4baa94f3aa8c09c76731bd12188604051613ef691815260200190565b60405180910390a46001600160a01b0383166000908152602081905260409020805486900390555b8715613fcb57613f2e82826120f4565b91508115613fcb5760008881526007602090815260408083208054600181018255908452919092206001600160e01b03198716608086901b176001600160801b03909716969096179581018690559051918390039181906001600160a01b038616908b907f457d1c14c88c62c38e74ae53403c8f2539261a4b95ee942daaa268be84058cb690613fc1908a815260200190565b60405180910390a4505b6001600160a01b039283166000908152600160208181526040808420968d16845295905293902055509390930192828410613d695750505050505050565b604051633e04ae6960e21b81526004810183905264ffffffffff82166024820152600090733819f64f282bf135d62168c1e513280daf905e069063f812b9a4906044016020604051808303816000875af115801561406b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110da9190614bc9565b6040805160e081018252600080825260208201819052918101829052606081018290526080810182905260a0810182905260c081019190915290565b6040805161014081018252600080825260208201819052918101829052606081018290526080810182905260a0810182905260c0810182905260e081018290526101008101919091526101208101614121614126565b905290565b6040805161010081018252600080825260208201819052918101829052606081018290526080810182905260a0810182905260c0810182905260e081019190915290565b604051806101a00160405280600d906020820280368337509192915050565b60008083601f84011261419b57600080fd5b5081356001600160401b038111156141b257600080fd5b6020830191508360208260051b8501011115611a8557600080fd5b801515811461137c57600080fd5b80356141e6816141cd565b919050565b6000806000806060858703121561420157600080fd5b8435935060208501356001600160401b0381111561421e57600080fd5b61422a87828801614189565b909450925050604085013561423e816141cd565b939692955090935050565b6001600160a01b038116811461137c57600080fd5b60008060006060848603121561427357600080fd5b833561427e81614249565b95602085013595506040909401359392505050565b634e487b7160e01b600052602160045260246000fd5b60208101600583106142cb57634e487b7160e01b600052602160045260246000fd5b91905290565b6000602082840312156142e357600080fd5b5035919050565b6000806000806080858703121561430057600080fd5b843561430b81614249565b966020860135965060408601359560600135945092505050565b60008060006040848603121561433a57600080fd5b83356001600160401b0381111561435057600080fd5b61435c86828701614189565b9094509250506020840135614370816141cd565b809150509250925092565b60008060006060848603121561439057600080fd5b833561439b81614249565b925060208401356143ab81614249565b929592945050506040919091013590565b600080604083850312156143cf57600080fd5b82356143da81614249565b946020939093013593505050565b634e487b7160e01b600052604160045260246000fd5b60405160e081016001600160401b0381118282101715614420576144206143e8565b60405290565b60405161014081016001600160401b0381118282101715614420576144206143e8565b64ffffffffff8116811461137c57600080fd5b6001600160481b038116811461137c57600080fd5b61ffff8116811461137c57600080fd5b80356141e681614471565b60008060008060008587036101608112156144a657600080fd5b8635955060208701359450604087013593506060870135925060e0607f19820112156144d157600080fd5b506144da6143fe565b60808701356144e881614449565b815260a08701356144f88161445c565b602082015260c087013561450b8161445c565b604082015260e087013561451e81614471565b60608201526145306101008801614481565b60808201526145426101208801614481565b60a082015261455461014088016141db565b60c0820152809150509295509295909350565b6000806020838503121561457a57600080fd5b82356001600160401b0381111561459057600080fd5b61459c85828601614189565b90969095509350505050565b6000602082840312156145ba57600080fd5b81356110da81614249565b600080604083850312156145d857600080fd5b8235915060208301356145ea81614449565b809150509250929050565b60008060006060848603121561460a57600080fd5b505081359360208301359350604090920135919050565b600080600080600060a0868803121561463957600080fd5b853561464481614249565b97602087013597506040870135966060810135965060800135945092505050565b6000806000806080858703121561467b57600080fd5b843561468681614249565b93506020850135614696816141cd565b925060408501356146a681614249565b9396929550929360600135925050565b600080604083850312156146c957600080fd5b50508035926020909101359150565b80511515825260208101511515602083015260408101511515604083015260608101511515606083015260808101511515608083015260a081015161472160a084018215159052565b5060c081015161473560c084018215159052565b5060e08101516111a460e084018215159052565b815160ff1681526102208101602083015161476f60208401826001600160401b03169052565b506040830151614784604084018260ff169052565b50606083015161479f60608401826001600160401b03169052565b5060808301516147b4608084018260ff169052565b5060a08301516147cf60a08401826001600160401b03169052565b5060c08301516147e460c084018260ff169052565b5060e08301516147fa60e084018261ffff169052565b506101008381015160ff16908301526101208084015161481c828501826146d8565b505092915050565b60008060006060848603121561483957600080fd5b833561484481614249565b925060208401359150604084013561437081614449565b610100810161115e82846146d8565b6000806040838503121561487d57600080fd5b823561488881614249565b915060208301356145ea81614249565b600080604083850312156148ab57600080fd5b8235915060208301356145ea81614249565b6000808284036102408112156148d257600080fd5b83359250610220601f19820112156148e957600080fd5b506020830190509250929050565b6000610100828403121561210c57600080fd5b803560ff811681146141e657600080fd5b80356001600160401b03811681146141e657600080fd5b600061010080838503121561494657600080fd5b604051908101906001600160401b0382118183101715614968576149686143e8565b816040528092508335915061497c826141cd565b81815261498b602085016141db565b602082015261499c604085016141db565b60408201526149ad606085016141db565b60608201526149be608085016141db565b60808201526149cf60a085016141db565b60a08201526149e060c085016141db565b60c08201526149f160e085016141db565b60e0820152505092915050565b60006102208284031215614a1157600080fd5b614a19614426565b614a228361490a565b8152614a306020840161491b565b6020820152614a416040840161490a565b6040820152614a526060840161491b565b6060820152614a636080840161490a565b6080820152614a7460a0840161491b565b60a0820152614a8560c0840161490a565b60c0820152614a9660e08401614481565b60e0820152610100614aa981850161490a565b90820152610120614abc85858301614932565b908201529392505050565b60008060008060808587031215614add57600080fd5b5050823594602084013594506040840135936060013592509050565b81518152602080830151908201526040810161115e565b600080600060408486031215614b2557600080fd5b8335925060208401356001600160401b03811115614b4257600080fd5b614b4e86828701614189565b9497909650939450505050565b6101a08101818360005b600d811015614b84578151835260209283019290910190600101614b65565b50505092915050565b634e487b7160e01b600052601160045260246000fd5b8181038181111561115e5761115e614b8d565b8082018082111561115e5761115e614b8d565b600060208284031215614bdb57600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b808202811582820484141761115e5761115e614b8d565b634e487b7160e01b600052601260045260246000fd5b600082614c3457614c34614c0f565b500490565b6001600160801b0382811682821603908082111561244b5761244b614b8d565b60006101008284031215614c6c57600080fd5b6110da8383614932565b60006101a0808385031215614c8a57600080fd5b83601f840112614c9957600080fd5b6040518181018181106001600160401b0382111715614cba57614cba6143e8565b604052908301908085831115614ccf57600080fd5b845b83811015614ce9578051825260209182019101614cd1565b509095945050505050565b6000808335601e19843603018112614d0b57600080fd5b8301803591506001600160401b03821115614d2557600080fd5b602001915036819003821315611a8557600080fd5b8183823760009101908152919050565b600060208083528351808285015260005b81811015614d7757858101830151858201604001528201614d5b565b506000604082860101526040601f19601f8301168501019250505092915050565b600060e08284031215614daa57600080fd5b614db26143fe565b8251614dbd81614449565b81526020830151614dcd8161445c565b60208201526040830151614de08161445c565b60408201526060830151614df381614471565b60608201526080830151614e0681614471565b608082015260a0830151614e1981614471565b60a082015260c0830151614e2c816141cd565b60c08201529392505050565b600060208284031215614e4a57600080fd5b81516110da816141cd565b600081614e6457614e64614b8d565b506000190190565b600060018201614e7e57614e7e614b8d565b5060010190565b600080600060608486031215614e9a57600080fd5b8351614ea58161445c565b6020850151909350614eb68161445c565b604085015190925066ffffffffffffff8116811461437057600080fd5b600082614ee257614ee2614c0f565b500690565b634e487b7160e01b600052603160045260246000fdfe0000000000000000000000002b591e99afe9f32eaa6214f7b7629768c40eeb39a26469706673582212201c4a1eebc2fe62104a2bb0aa2eac15fb6171f364fc9ba4d33e5664d83040ab6464736f6c63430008120033",
  "deployedBytecode": "0x6080604052600436106104b95760003560e01c80638529beb61161026b578063d02f80ab1161014f578063ecfbb788116100c1578063f6f7863a11610085578063f6f7863a14610fa6578063f6f98f7414610fd3578063fbd512b814610ff3578063fd0bc8fb14611020578063fe63fde614611033578063ff839dab1461105357600080fd5b8063ecfbb78814610f16578063eef0246814610f36578063f04b5fa014610f49578063f288caaf14610f6b578063f3e349ae14610f8b57600080fd5b8063d8b7715011610113578063d8b7715014610e61578063dbfda93914610e89578063dfc1b17414610eb0578063e031031214610ec3578063e5dcb01614610ee3578063e9aaa29a14610f0357600080fd5b8063d02f80ab14610d99578063d3650a6914610db9578063d4138e6e14610de6578063d63a4d5c14610e14578063d84a183514610e3457600080fd5b8063ae4358d7116101e8578063c6cfdd2a116101ac578063c6cfdd2a14610cd7578063c89ade2414610cf7578063c9ed8bfa14610d24578063cc1f2afa14610d37578063ce16025114610d59578063d0085e7e14610d7957600080fd5b8063ae4358d714610c44578063b197a6e114610c64578063b6fae73914610c84578063bdbb43b714610c97578063befef31114610cb757600080fd5b80639b63e4681161022f5780639b63e46814610bbb5780639c97026e14610bdb5780639d00317f14610bfb578063a32d7dbe14610c0e578063a971207014610c2e57600080fd5b80638529beb614610af15780638b1e31c714610b2957806397e5c16614610b3c5780639803864f14610b4f5780639a8a785514610b6f57600080fd5b80633f9d89501161039d5780635965f8371161030f578063693eafff116102d3578063693eafff14610a1b5780636c7d076514610a4457806370a0823114610a645780637705f7d614610a845780637d1e7da114610aa45780637d78a58c14610ac457600080fd5b80635965f837146109ab5780635c9302c9146109be5780635e606478146109d357806365cf71b2146109e657806367ed0c7914610a0657600080fd5b80634ac139c8116103615780634ac139c8146108d85780634d4f6ea9146108f85780634dadffa21461092857806351f2db8e1461094857806352a438b814610969578063553f0a661461098957600080fd5b80633f9d8950146108185780633fc214b914610850578063401bce531461087057806343a2b084146108985780634868f61d146108b857600080fd5b8063223c217b1161043657806333060d90116103fa57806333060d9014610772578063338b5dea14610792578063338d52a7146107a5578063343009a2146107c5578063380c1273146107e55780633a785e431461080557600080fd5b8063223c217b1461065d5780632607443b1461067057806327d0cd761461070a57806327ef53491461072a578063329125961461075f57600080fd5b80631354e15f1161047d5780631354e15f1461058a57806319ff5fff1461059d5780631b338710146105bd5780631e9701d4146105fd578063216cd5a41461061d57600080fd5b806304ed31f7146104c557806309c14479146104e95780630e4af6741461050b5780630e5f88f61461053857806310c09bbd1461054d57600080fd5b366104c057005b600080fd5b3480156104d157600080fd5b506008545b6040519081526020015b60405180910390f35b3480156104f557600080fd5b506105096105043660046141eb565b611073565b005b34801561051757600080fd5b5061052b61052636600461425e565b6110ca565b6040516104e091906142a9565b34801561054457600080fd5b506002546104d6565b34801561055957600080fd5b5061056d6105683660046142d1565b6110e1565b604080519283526001600160a01b039091166020830152016104e0565b6104d66105983660046142ea565b611102565b3480156105a957600080fd5b506104d66105b83660046142d1565b61114b565b3480156105c957600080fd5b506105dd6105d83660046142d1565b611164565b604080516001600160801b039384168152929091166020830152016104e0565b34801561060957600080fd5b50610509610618366004614325565b611199565b34801561062957600080fd5b5061063d6106383660046142d1565b6111a9565b6040805183518152602093840151938101939093528201526060016104e0565b6104d661066b36600461437b565b611283565b34801561067c57600080fd5b5061069061068b3660046143bc565b61129a565b6040516104e09190600060e08201905064ffffffffff835116825260208301516001600160481b0380821660208501528060408601511660408501525050606083015161ffff80821660608501528060808601511660808501528060a08601511660a0850152505060c0830151151560c083015292915050565b34801561071657600080fd5b506104d661072536600461448c565b6112ac565b34801561073657600080fd5b5061074a6107453660046142d1565b6112df565b604080519283526020830191909152016104e0565b61050961076d366004614567565b6112eb565b34801561077e57600080fd5b506104d661078d3660046145a8565b611341565b6104d66107a03660046143bc565b61134c565b3480156107b157600080fd5b506105096107c03660046142d1565b611359565b3480156107d157600080fd5b506105096107e03660046145c5565b61137f565b3480156107f157600080fd5b506104d66108003660046145f5565b6113d3565b61074a610813366004614621565b6113e0565b34801561082457600080fd5b506108386108333660046142d1565b61142f565b6040516001600160a01b0390911681526020016104e0565b34801561085c57600080fd5b5061050961086b366004614567565b611443565b34801561087c57600080fd5b50610838738bd3d1472a656e312e94fb1bbdd599b8c51d18e381565b3480156108a457600080fd5b506104d66108b3366004614665565b6115ba565b3480156108c457600080fd5b506105096108d33660046143bc565b6115f8565b3480156108e457600080fd5b506104d66108f33660046145f5565b611603565b34801561090457600080fd5b506109186109133660046142d1565b61170b565b60405190151581526020016104e0565b34801561093457600080fd5b506104d66109433660046142d1565b611716565b34801561095457600080fd5b506d040000000100000001020000ff016104d6565b34801561097557600080fd5b506105096109843660046146b6565b61172a565b34801561099557600080fd5b5061099e611753565b6040516104e09190614749565b6105096109b93660046146b6565b611768565b3480156109ca57600080fd5b506104d6611776565b6104d66109e13660046142ea565b611780565b3480156109f257600080fd5b50610509610a01366004614824565b6117ab565b348015610a1257600080fd5b5061063d6117bd565b348015610a2757600080fd5b50610a316115b381565b60405161ffff90911681526020016104e0565b348015610a5057600080fd5b506104d6610a5f3660046146b6565b611883565b348015610a7057600080fd5b506104d6610a7f3660046145a8565b6118b4565b348015610a9057600080fd5b50610918610a9f3660046145f5565b6118bf565b348015610ab057600080fd5b5061052b610abf3660046142d1565b6118cc565b348015610ad057600080fd5b50610ae4610adf3660046142d1565b6118ea565b6040516104e0919061485b565b348015610afd57600080fd5b506104d6610b0c36600461486a565b600160209081526000928352604080842090915290825290205481565b610509610b37366004614898565b6118fb565b610509610b4a3660046148bd565b611999565b348015610b5b57600080fd5b5061074a610b6a3660046146b6565b6119b9565b348015610b7b57600080fd5b50610ba37f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160601b0390911681526020016104e0565b348015610bc757600080fd5b506104d6610bd63660046148f7565b611a8c565b348015610be757600080fd5b50610509610bf6366004614567565b611aa5565b61074a610c09366004614621565b611adf565b348015610c1a57600080fd5b50610509610c293660046141eb565b611b12565b348015610c3a57600080fd5b506104d660001981565b348015610c5057600080fd5b506104d6610c5f3660046149fe565b611b3c565b348015610c7057600080fd5b50610509610c7f36600461425e565b611b47565b6104d6610c923660046142ea565b611b52565b348015610ca357600080fd5b50610509610cb23660046142d1565b611b71565b348015610cc357600080fd5b506104d6610cd23660046145a8565b611b7a565b348015610ce357600080fd5b50610509610cf23660046143bc565b611b85565b348015610d0357600080fd5b506104d6610d123660046145a8565b60006020819052908152604090205481565b6104d6610d323660046142d1565b611b8f565b348015610d4357600080fd5b50610838600080516020614efe83398151915281565b348015610d6557600080fd5b5061099e610d743660046142d1565b611b9c565b348015610d8557600080fd5b506104d6610d94366004614ac7565b611bbc565b348015610da557600080fd5b50610838610db43660046142d1565b611bca565b348015610dc557600080fd5b506104d6610dd43660046142d1565b60056020526000908152604090205481565b348015610df257600080fd5b50610dfc6103e881565b6040516001600160801b0390911681526020016104e0565b348015610e2057600080fd5b506104d6610e2f3660046146b6565b611bf4565b348015610e4057600080fd5b50610e54610e4f3660046142d1565b611c00565b6040516104e09190614af9565b348015610e6d57600080fd5b50610838733819f64f282bf135d62168c1e513280daf905e0681565b348015610e9557600080fd5b50610e9e608081565b60405160ff90911681526020016104e0565b6104d6610ebe366004614665565b611c34565b348015610ecf57600080fd5b506104d6610ede3660046145a8565b611c4b565b348015610eef57600080fd5b50610918610efe3660046146b6565b611ccc565b610509610f11366004614b10565b611cd8565b348015610f2257600080fd5b5061063d610f313660046146b6565b611d15565b6104d6610f4436600461437b565b611d40565b348015610f5557600080fd5b50610f5e611d4d565b6040516104e09190614b5b565b348015610f7757600080fd5b5061099e610f863660046142d1565b611dc6565b348015610f9757600080fd5b50610dfc6001600160801b0381565b348015610fb257600080fd5b506104d6610fc13660046145a8565b60036020526000908152604090205481565b348015610fdf57600080fd5b506104d6610fee366004614898565b611dd7565b348015610fff57600080fd5b506104d661100e3660046142d1565b60046020526000908152604090205481565b61074a61102e3660046142d1565b611dee565b34801561103f57600080fd5b506104d661104e3660046142d1565b611e10565b34801561105f57600080fd5b506104d661106e3660046142d1565b611e1b565b8361107f600143614ba3565b40146110b95783611091600143614ba3565b6040516302e4f0f160e31b815260048101929092524060248201526044015b60405180910390fd5b6110c4838383611e6b565b50505050565b60006110d7848484611f51565b90505b9392505050565b600081815260046020526040812054819060a081901c905b91509150915091565b60006111378561112886611123600080516020614efe8339815191526120c7565b6120f4565b8561113230612112565b61218c565b9050611143818361229a565b949350505050565b60008181526004602052604081205460a01c5b92915050565b6008818154811061117457600080fd5b6000918252602090912001546001600160801b038082169250600160801b9091041682565b6111a4838383611e6b565b505050565b604080518082019091526000808252602082015260006103e883116111ce57826111d2565b6103e85b6008549093506111e28185614bb6565b93506000600080516020614efe8339815191526001600160a01b0316635c9302c96040518163ffffffff1660e01b8152600401602060405180830381865afa158015611232573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112569190614bc9565b90508185148061126557508085115b1561126e578094505b61127882866122c4565b935093505050915091565b60006110d78484611295873387612303565b61237b565b6112a261408f565b6110da8383612452565b60008515806112b9575084155b156112c6575060006112d6565b6112d386868686866124d7565b90505b95945050505050565b6000806110f9836125e6565b600081816112f830612112565b6080611302612659565b901b1790505b61132a85858581811061131d5761131d614be2565b90506020020135826126cb565b600190940193915050818310611308575050505050565b600061115e82612112565b60006110da8333846129de565b61137c306113768360009081526004602052604090205460a01c90565b836129f8565b50565b611390338264ffffffffff16612a26565b60006113b8838364ffffffffff1660016113a930612112565b6113b39190614ba3565b612a8b565b90506110c4600080516020614efe833981519152338361237b565b60006110d7848484612b6c565b6000806113ee873387612b87565b945060006113fc8787612c5d565b9050611409888288612ca1565b61141287612ce2565b611420888289898989612d54565b92509250509550959350505050565b60008181526004602052604081205461115e565b600080805260056020527f05b8ccbb9d4d8fb16ea74ce3c29a41f1b461fbdaff4714a0d9a8eb05499746bc548291908190819081908190816114b0826114ab8c8b858161149257611492614be2565b9050602002013560009081526004602052604090205490565b612f06565b90505b8989888181106114c5576114c5614be2565b9050602002013592506114e98360009081526004602052604090205460a081901c91565b6000858152600560205260409020549096509094509150336001600160a01b038616148061151d575061151d826002612f3e565b1561157957600061152e8387612f06565b905081811461155e57611559836004733819f64f282bf135d62168c1e513280daf905e06858b612f5c565b600096505b80915061156b8585612f8e565b6115759088614bb6565b9650505b8660010196508787106114b35785156115ae576115ae826004733819f64f282bf135d62168c1e513280daf905e06848a612f5c565b50505050505050505050565b6000806115c6866120c7565b90506127106115d58483614bf8565b6115df9190614c25565b91506115ee8686868585612f9a565b5050949350505050565b6111a4823383612b87565b600061160f8484614ba3565b6008858154811061162257611622614be2565b9060005260206000200160000160109054906101000a90046001600160801b03166008858154811061165657611656614be2565b60009182526020909120015461167c9190600160801b90046001600160801b0316614c39565b6001600160801b0316836008878154811061169957611699614be2565b600091825260209091200154600880546001600160801b0390921691889081106116c5576116c5614be2565b6000918252602090912001546116e491906001600160801b0316614c39565b6001600160801b03166116f79190614bf8565b6117019190614c25565b6110d79190614ba3565b600061115e82612fd0565b60008181526007602052604081205461115e565b611743600080516020614efe8339815191523384612b87565b506111a433838361113230612112565b61175b6140cb565b611763612fea565b905090565b611772828261308f565b5050565b6000611763612659565b600061179b600080516020614efe8339815191523386612b87565b5061113785858561113230612112565b6111a483838364ffffffffff166130a3565b60408051808201909152600080825260208201526000806008805490509050600080516020614efe8339815191526001600160a01b0316635c9302c96040518163ffffffff1660e01b8152600401602060405180830381865afa158015611828573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061184c9190614bc9565b811061185b5750909160009150565b61187b816040518060400160405280600081526020016000815250613123565b939092509050565b6007602052816000526040600020818154811061189f57600080fd5b90600052602060002001600091509150505481565b600061115e82613399565b60006110d78484846133d6565b60008181526004602052604081205461115e90309060a01c84611f51565b6118f2614126565b61115e826133ec565b6119053383612a26565b61190e82612fd0565b61192b57604051631eb49d6d60e11b815260040160405180910390fd5b60008281526004602090815260409182902080546001600160a01b0385166001600160a01b03198216811790925583518681529283019190915260a01c917f615a7c35d84db011c8af86f253bd0dcee771fb0da2c206a4abd88f671cbf29ce910160405180910390a1505050565b611772826119b46119af368590038501856149fe565b6134be565b61308f565b6000806000600885815481106119d1576119d1614be2565b60009182526020808320604080518082019091529201546001600160801b038082168452600160801b9091041690820152600880549193509086908110611a1a57611a1a614be2565b6000918252602091829020604080518082019091529101546001600160801b03808216808452600160801b90920416928201929092528351909250611a5e91614c39565b82602001518260200151611a729190614c39565b6001600160801b03918216955016925050505b9250929050565b600061115e611aa036849003840184614c59565b613579565b6000815b611aca848484818110611abe57611abe614be2565b905060200201356125e6565b5050816001019150808210611aa95750505050565b600080611aec8686612c5d565b50611af686612ce2565b611b04873388888888612d54565b915091509550959350505050565b834211156110b95760405163b979466160e01b8152600481018590524260248201526044016110b0565b600061115e826134be565b6111a48383836129f8565b600061113785611128600080516020614efe8339815191523388612303565b61137c81613666565b600061115e826120c7565b6117728282612a26565b600061115e8260006136bc565b611ba46140cb565b60008281526005602052604090205461115e906136f5565b60006112d68585858561379c565b60028181548110611bda57600080fd5b6000918252602090912001546001600160a01b0316905081565b60006110da83836120f4565b604080518082019091526000808252602082015261115e826040518060400160405280600081526020016000815250613123565b60006112d685858585611c468a6120c7565b612f9a565b60006001600160a01b0382163b611c7557604051631eb49d6d60e11b815260040160405180910390fd5b6001600160a01b038216600090815260036020526040902054151580611ca257506001600160a01b038216155b15611cc357506001600160a01b031660009081526003602052604090205490565b61115e82613800565b60006110da8383612f3e565b6111a48383838080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525061388c92505050565b60408051808201909152600080825260208201526000611d3584846122c4565b915091509250929050565b60006110d78484846129de565b611d5561416a565b600080516020614efe8339815191526001600160a01b031663f04b5fa06040518163ffffffff1660e01b81526004016101a060405180830381865afa158015611da2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117639190614c76565b611dce6140cb565b61115e826136f5565b600060a083901b6001600160a01b038316176110da565b6000806110f983611dfe30612112565b6080611e08612659565b901b176126cb565b600061115e82613a72565b6000611e273383612a26565b60008281526004602052604090205460a01c611e49818460016113a930612112565b9150611e64600080516020614efe833981519152338461237b565b5050919050565b8160008060605b30878785818110611e8557611e85614be2565b9050602002810190611e979190614cf4565b604051611ea5929190614d3a565b600060405180830381855af49150503d8060008114611ee0576040519150601f19603f3d011682016040523d82523d6000602084013e611ee5565b606091505b50909250905081611f3b578415611f3357827f73214f6d0ff4c562fafa80c5c6631b79482a52c9f4769d2cec51b9bc6751e1ec82604051611f269190614d4a565b60405180910390a2611f3b565b805160208201fd5b826001019250838310611e725750505050505050565b60405163033060d960e41b81526001600160a01b03841660048201526000908190600080516020614efe833981519152906333060d9090602401602060405180830381865afa158015611fa8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611fcc9190614bc9565b9050808410611fdf5760049150506110da565b6000611feb8686612452565b805190915064ffffffffff168414612008576003925050506110da565b612092816060015161ffff16826080015161ffff16600080516020614efe8339815191526001600160a01b0316635c9302c96040518163ffffffff1660e01b8152600401602060405180830381865afa158015612069573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061208d9190614bc9565b6133d6565b156120a2576002925050506110da565b60a081015161ffff16156120bb576001925050506110da565b50600095945050505050565b6001600160a01b0381166000908152602081905260408120546120ea8330613ac0565b61115e9190614ba3565b600082158061210257508183115b61210c57826110da565b50919050565b60405163033060d960e41b81526001600160a01b0382166004820152600090600080516020614efe833981519152906333060d90906024015b602060405180830381865afa158015612168573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061115e9190614bc9565b604051630a54871760e31b81526004810184905260248101839052600090600080516020614efe833981519152906352a438b890604401600060405180830381600087803b1580156121dd57600080fd5b505af11580156121f1573d6000803e3d6000fd5b5050604051632607443b60e01b815230600482015260248101859052600080516020614efe8339815191529250632607443b915060440160e060405180830381865afa158015612245573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122699190614d98565b5164ffffffffff16905060a082901b6001600160a01b03861617600082815260046020526040902055949350505050565b60008281526005602052604090205461177290839060ff198416608090911617607f841617613b4b565b60408051808201909152600080825260208201526000828410156122fd575b6122ed8483613123565b91508360010193508284106122e3575b50929050565b6001600160a01b03808416600090815260016020908152604080832093861683529290529081205461233583826120f4565b6001600160a01b03958616600081815260016020908152604080832098909916825296875287812093839003909355825293819052939093208054839003905550919050565b60006001600160a01b0384166123a35761239e6001600160a01b03841683613b9c565b61244b565b60405163a9059cbb60e01b81526001600160a01b0384811660048301526024820184905285169063a9059cbb906044016020604051808303816000875af11580156123f2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124169190614e38565b61244b576040516317e3057d60e31b81523060048201526001600160a01b0384166024820152604481018390526064016110b0565b5092915050565b61245a61408f565b604051632607443b60e01b81526001600160a01b038416600482015260248101839052600080516020614efe83398151915290632607443b9060440160e060405180830381865afa1580156124b3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110da9190614d98565b6000600485101561255c57600385101561250957846001036124fa5750826125cf565b50608081015161ffff166125cf565b6080820151606083015161ffff918216911680850382810361252d57829350612554565b82811061254c5782600101818161254657612546614c0f565b06860391505b818603830393505b5050506125cf565b846005036125795781602001516001600160481b031692506125a9565b846006036125a95781602001516001600160481b03168311156125a95781602001516001600160481b0316830392505b63ffffffff80851690602086901c1681858202816125c9576125c9614c0f565b04925050505b8581116125dc57806112d3565b5093949350505050565b6000806125f33384612a26565b60008381526004602052604081205460a081901c916126123084612452565b90506000600161262130612112565b61262b9190614ba3565b9050612638848883612a8b565b955061264e8387846080015161ffff168461218c565b945050505050915091565b6000600080516020614efe8339815191526001600160a01b0316635c9302c96040518163ffffffff1660e01b8152600401602060405180830381865afa1580156126a7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117639190614bc9565b60008181806126eb8660009081526004602052604090205460a081901c91565b9150915060006126fb8388613cb5565b805190915064ffffffffff1660000361271a5760009450505050611a85565b60008781526005602052604081205490612735908290612f3e565b612746576000955050505050611a85565b612768826060015161ffff16836080015161ffff16608060ff1688901c6133d6565b801561277c575061277a816001612f3e565b155b1561278e576000955050505050611a85565b612799816003612f3e565b1561282c5760006127aa858a612f8e565b905060f882901c80156128015760006127d383836001600160401b0360b888901c1682896124d7565b905080156127ff576127fc8b87733819f64f282bf135d62168c1e513280daf905e068487613ce8565b92505b505b811561282957612829836004733819f64f282bf135d62168c1e513280daf905e068886612f5c565b50505b61283585614e55565b945061284b8489876001600160801b0316612a8b565b955060b081901c60ff16801561289f57600061287788836001600160401b03607087901c1682886124d7565b9050801561289d5761289a8a86600080516020614efe833981519152848c613ce8565b97505b505b50606881901c60ff16600087158015906128b95750600082115b156129645760006128da89846001600160401b03602888901c1682896124d7565b90506000602085901c60ff166128f1576000612913565b6129136115b3602087901c60ff16601088901c61ffff1660808d901c8a6124d7565b9050801561296157818a0399506129358783838c6001600160801b031661218c565b925061294089614e6c565b985060028061294e87613a72565b901c901b60011794506129618386613b4b565b50505b871561298657612986836004600080516020614efe833981519152888c612f5c565b60008a8152600560205260408120556129a0836007612f3e565b156129d1576129d18a866000841180156129c057506129c0866006612f3e565b6129cb576000613d57565b83613d57565b5050505050509250929050565b60006129eb843384612b87565b915061244b848484612ca1565b6000612a05848484611f51565b6004811115612a1657612a16614293565b036111a4576111a48383836130a3565b6000818152600460205260409020546001600160a01b038316906001600160a01b0316146117725760008181526004602052604090205482906040516318c1e22960e31b81526001600160a01b039283166004820152911660248201526044016110b0565b600080612a9730613399565b604051631a1804d160e11b81526004810187905264ffffffffff86166024820152909150600080516020614efe8339815191529063343009a290604401600060405180830381600087803b158015612aee57600080fd5b505af1158015612b02573d6000803e3d6000fd5b5050505084831115612b45576000612b1a3087612452565b5164ffffffffff16600090815260046020526040902080546001600160a01b031660a088901b179055505b80612b4f30613399565b600095865260046020526040862095909555909303949350505050565b6000612b7a82610100614ba3565b9390921b90921c92915050565b60006001600160a01b03841615612c54578115612c4f576040516323b872dd60e01b81526001600160a01b038481166004830152306024830152604482018490528516906323b872dd906064016020604051808303816000875af1158015612bf3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612c179190614e38565b612c4c576040516317e3057d60e31b81526001600160a01b0384166004820152306024820152604481018390526064016110b0565b50805b6110da565b50349392505050565b60008281526004602052604090205481158015612c835750336001600160a01b03821614155b1561115e57604051631eb49d6d60e11b815260040160405180910390fd5b6001600160a01b0392831660008181526001602090815260408083209590961682529384528481208054840190559081529182905291902080549091019055565b612ceb30612112565b600003612d0b57604051631eb49d6d60e11b815260040160405180910390fd5b80612d2e30612d298460009081526004602052604090205460a01c90565b612452565b5164ffffffffff161461137c57604051631eb49d6d60e11b815260040160405180910390fd5b6001600160a01b0380871660009081526001602090815260408083209389168352929052908120548190612d899086906120f4565b94506001851015612d9f57506000905080612efb565b6000868152600460209081526040808320546006835281842080546001600160a01b0319166001600160a01b03909216919091179055600590915290205460808117808214612df257612df28882613b4b565b8615612e25576001600160a01b03808b166000908152600160209081526040808320938d16835292905220805488900390555b6001600160a01b038a1660009081526003602052604090205480158015612e5457506001600160a01b038b1615155b15612e7257604051631eb49d6d60e11b815260040160405180910390fd5b6000612e80828a8a8a61379c565b60008b8152600760209081526040808320805460018101825590845291909220810183905590519192509081906001600160a01b038f16908d907f457d1c14c88c62c38e74ae53403c8f2539261a4b95ee942daaa268be84058cb690612ee99087815260200190565b60405180910390a49550889450505050505b965096945050505050565b60008160a0612f16856004612f3e565b612f21576000612f24565b60015b60ff16901b60ff16176001600160a01b0316905092915050565b600060ff612f4c8382614ba3565b84901b901c600114905092915050565b612f668585612f3e565b15612f7c57612f7683838361237b565b50612f87565b612f87838383612ca1565b5050505050565b60006110da8383614009565b6000612fa683836120f4565b905080156112d6578415612fc557612fbf86858361237b565b506112d6565b6112d6868583612ca1565b600081815260056020819052604082205461115e91612f3e565b612ff26140cb565b506040805161014081018252600080825260208083018290528284018290526060808401839052600460808086019190915264010000000160a080870191909152600260c08088019190915260e080880187905260ff610100808a019190915289519081018a5260018152958601879052978501869052928401859052908301849052820183905281018290529283015261012081019190915290565b6130993383612a26565b611772828261229a565b6040516332e7b8d960e11b81526001600160a01b03841660048201526024810183905264ffffffffff82166044820152600080516020614efe833981519152906365cf71b290606401600060405180830381600087803b15801561310657600080fd5b505af115801561311a573d6000803e3d6000fd5b50505050505050565b6040805180820190915260008082526020820152600854831461315957604051631eb49d6d60e11b815260040160405180910390fd5b6040516390de687160e01b8152600481018490526000908190600080516020614efe833981519152906390de687190602401606060405180830381865afa1580156131a8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906131cc9190614e85565b506001600160481b031691506001600160481b031691507f00000000000000000000000000000000000000000000000000000000000000006001600160601b031685118015613219575080155b1561323757604051631eb49d6d60e11b815260040160405180910390fd5b835160208501518115801561324a575080155b80156132565750600087115b156132b7576000600861326a60018a614ba3565b8154811061327a5761327a614be2565b6000918252602091829020604080518082019091529101546001600160801b03808216808452600160801b90920416919092018190529093509150505b6132c18285614bb6565b8086526001600160801b0310156132eb57604051631eb49d6d60e11b815260040160405180910390fd5b6132f58184614bb6565b602086018190526001600160801b03101561332357604051631eb49d6d60e11b815260040160405180910390fd5b50506040805180820190915283516001600160801b039081168252602080860151821690830190815260088054600181018255600091909152925190518216600160801b029116177ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee39091015550909392505050565b6040516370a0823160e01b81526001600160a01b0382166004820152600090600080516020614efe833981519152906370a082319060240161214b565b6000816133e38486614bb6565b11949350505050565b6133f4614126565b60405180610100016040528060028461340d9190614ed3565b600114151581526020016002600160ff1685901c61342b9190614ed3565b6001148152602001613440600285811c614ed3565b60011481526020016134576002600386901c614ed3565b600114815260200161346e6002600486901c614ed3565b60011481526020016134856002600586901c614ed3565b600114815260200161349c6002600686901c614ed3565b60011481526020016134b36002600786901c614ed3565b600114905292915050565b60006134ce826101200151613579565b600860ff1683610100015160ff16901b601060ff168460e0015161ffff16901b602060ff168560c0015160ff16901b602860ff168660a001516001600160401b0316901b606860ff16876080015160ff16901b607060ff1688606001516001600160401b0316901b60b060ff16896040015160ff16901b60b860ff168a602001516001600160401b0316901b60f860ff168b6000015160ff16901b1717171717171717179050919050565b805160009061358957600061358c565b60015b602083015160019061359f5760006135a2565b60015b60ff16901b600260ff1684604001516135bc5760006135bf565b60015b60ff16901b600360ff1685606001516135d95760006135dc565b60015b60ff16901b600460ff1686608001516135f65760006135f9565b60015b60ff16901b600560ff168760a00151613613576000613616565b60015b60ff16901b600660ff168860c00151613630576000613633565b60015b60ff16901b600760ff168960e0015161364d576000613650565b60015b60ff16901b1717171717171760ff169050919050565b6000818152600460205260409020546001600160a01b031661137c576000818152600460205260409020546040516318c1e22960e31b81526001600160a01b0390911660048201523060248201526044016110b0565b60006136c83384612a26565b50600082815260056020819052604090912054603f198116601f909116179082901b1761115e8382613b4b565b6136fd6140cb565b604080516101408101825260f884901c81526001600160401b0360b885901c811660208084019190915260b086901c60ff90811694840194909452607086901c82166060840152606886901c84166080840152602886901c90911660a083015284901c821660c082015261ffff601085901c1660e0820152600884901c8216610100820152906101208201906137949085166133ec565b905292915050565b600080831180156137ab575081155b156137c957604051631eb49d6d60e11b815260040160405180910390fd5b5060e084901b608084901b176fffffffffffffffff0000000000000000604084901b16176001600160401b03821617949350505050565b600280546001600160a01b0383166000818152600360205260408082208490556001840185559381527f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace830180546001600160a01b0319168317905592518291907f1707ae19990646bcbe529f1bdf88a39a0365ca51f56298de8d0349aab5b01595908590a392915050565b600082815260046020526040812054156138b1576138aa3384612a26565b50336138cb565b506000828152600660205260409020546001600160a01b03165b600083815260076020526040812080549091906138ea90600190614ba3565b845190915060005b600086828151811061390657613906614be2565b60200260200101519050600085828154811061392457613924614be2565b9060005260206000200154905060008511156139765785858154811061394c5761394c614be2565b906000526020600020015486838154811061396957613969614be2565b6000918252602090912001555b8580548061398657613986614ee7565b600190038181906000526020600020016000905590556000600260e083901c815481106139b5576139b5614be2565b6000918252602090912001546001600160a01b031690506139e481896001600160601b03608086901c16612ca1565b82816001600160a01b03168b7f0cf144859ed0b60e76de3e005a909e8dd54359675ba26a9321c32b1fc578007385604051613a2191815260200190565b60405180910390a4505060001990930192506001018181106138f257600019830361311a57600087815260056020526040902054613a688860ff198316607f841617613b4b565b5050505050505050565b6000600882901c60ff16808203613a8b57505060ff1690565b60fe198101613a9b575090919050565b613aa481614e55565b61ffff19841660089190911b1760ff9093169290921792915050565b60006001600160a01b03831615613b3b576040516370a0823160e01b81526001600160a01b0383811660048301528416906370a0823190602401602060405180830381865afa158015613b17573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612c4f9190614bc9565b506001600160a01b031631919050565b600082815260056020526040908190208290555182907f6a1078c91220965ad51b5fb47f0c9098a1f0dc4ee8f3b2e019eb390c3f586c1590613b909084815260200190565b60405180910390a25050565b80471015613bec5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e636500000060448201526064016110b0565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114613c39576040519150601f19603f3d011682016040523d82523d6000602084013e613c3e565b606091505b50509050806111a45760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d6179206861766520726576657274656400000000000060648201526084016110b0565b613cbd61408f565b613cc73084612452565b805190915064ffffffffff16821461115e57613ce161408f565b905061115e565b6000818311613cf75782613cf9565b815b92508282039150836001600160a01b0316856001600160a01b0316877f23085cb6357862a12f1bdb84a0cb1a05b42455b4baa94f3aa8c09c76731bd12186604051613d4691815260200190565b60405180910390a450949350505050565b60008381526007602052604081205481805b600087815260076020526040902084613d83600186614ba3565b613d8d9190614ba3565b81548110613d9d57613d9d614be2565b9060005260206000200154915081905060076000888152602001908152602001600020805480613dcf57613dcf614ee7565b600190038181906000526020600020016000905590556000600260e084901c81548110613dfe57613dfe614be2565b60009182526020808320909101546001600160a01b03908116808452600183526040808520928c168552919092528220549092506001600160801b0385168203613e5a57608085901c6001600160601b03169450849150613eaa565b608085901c6001600160601b03169150846001600160401b031648604087901c6001600160401b0316613e8d9190614bf8565b613e979190614c25565b9450613ea385836120f4565b9450848203015b8415613f1e57826001600160a01b0316896001600160a01b03168b7f23085cb6357862a12f1bdb84a0cb1a05b42455b4baa94f3aa8c09c76731bd12188604051613ef691815260200190565b60405180910390a46001600160a01b0383166000908152602081905260409020805486900390555b8715613fcb57613f2e82826120f4565b91508115613fcb5760008881526007602090815260408083208054600181018255908452919092206001600160e01b03198716608086901b176001600160801b03909716969096179581018690559051918390039181906001600160a01b038616908b907f457d1c14c88c62c38e74ae53403c8f2539261a4b95ee942daaa268be84058cb690613fc1908a815260200190565b60405180910390a4505b6001600160a01b039283166000908152600160208181526040808420968d16845295905293902055509390930192828410613d695750505050505050565b604051633e04ae6960e21b81526004810183905264ffffffffff82166024820152600090733819f64f282bf135d62168c1e513280daf905e069063f812b9a4906044016020604051808303816000875af115801561406b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110da9190614bc9565b6040805160e081018252600080825260208201819052918101829052606081018290526080810182905260a0810182905260c081019190915290565b6040805161014081018252600080825260208201819052918101829052606081018290526080810182905260a0810182905260c0810182905260e081018290526101008101919091526101208101614121614126565b905290565b6040805161010081018252600080825260208201819052918101829052606081018290526080810182905260a0810182905260c0810182905260e081019190915290565b604051806101a00160405280600d906020820280368337509192915050565b60008083601f84011261419b57600080fd5b5081356001600160401b038111156141b257600080fd5b6020830191508360208260051b8501011115611a8557600080fd5b801515811461137c57600080fd5b80356141e6816141cd565b919050565b6000806000806060858703121561420157600080fd5b8435935060208501356001600160401b0381111561421e57600080fd5b61422a87828801614189565b909450925050604085013561423e816141cd565b939692955090935050565b6001600160a01b038116811461137c57600080fd5b60008060006060848603121561427357600080fd5b833561427e81614249565b95602085013595506040909401359392505050565b634e487b7160e01b600052602160045260246000fd5b60208101600583106142cb57634e487b7160e01b600052602160045260246000fd5b91905290565b6000602082840312156142e357600080fd5b5035919050565b6000806000806080858703121561430057600080fd5b843561430b81614249565b966020860135965060408601359560600135945092505050565b60008060006040848603121561433a57600080fd5b83356001600160401b0381111561435057600080fd5b61435c86828701614189565b9094509250506020840135614370816141cd565b809150509250925092565b60008060006060848603121561439057600080fd5b833561439b81614249565b925060208401356143ab81614249565b929592945050506040919091013590565b600080604083850312156143cf57600080fd5b82356143da81614249565b946020939093013593505050565b634e487b7160e01b600052604160045260246000fd5b60405160e081016001600160401b0381118282101715614420576144206143e8565b60405290565b60405161014081016001600160401b0381118282101715614420576144206143e8565b64ffffffffff8116811461137c57600080fd5b6001600160481b038116811461137c57600080fd5b61ffff8116811461137c57600080fd5b80356141e681614471565b60008060008060008587036101608112156144a657600080fd5b8635955060208701359450604087013593506060870135925060e0607f19820112156144d157600080fd5b506144da6143fe565b60808701356144e881614449565b815260a08701356144f88161445c565b602082015260c087013561450b8161445c565b604082015260e087013561451e81614471565b60608201526145306101008801614481565b60808201526145426101208801614481565b60a082015261455461014088016141db565b60c0820152809150509295509295909350565b6000806020838503121561457a57600080fd5b82356001600160401b0381111561459057600080fd5b61459c85828601614189565b90969095509350505050565b6000602082840312156145ba57600080fd5b81356110da81614249565b600080604083850312156145d857600080fd5b8235915060208301356145ea81614449565b809150509250929050565b60008060006060848603121561460a57600080fd5b505081359360208301359350604090920135919050565b600080600080600060a0868803121561463957600080fd5b853561464481614249565b97602087013597506040870135966060810135965060800135945092505050565b6000806000806080858703121561467b57600080fd5b843561468681614249565b93506020850135614696816141cd565b925060408501356146a681614249565b9396929550929360600135925050565b600080604083850312156146c957600080fd5b50508035926020909101359150565b80511515825260208101511515602083015260408101511515604083015260608101511515606083015260808101511515608083015260a081015161472160a084018215159052565b5060c081015161473560c084018215159052565b5060e08101516111a460e084018215159052565b815160ff1681526102208101602083015161476f60208401826001600160401b03169052565b506040830151614784604084018260ff169052565b50606083015161479f60608401826001600160401b03169052565b5060808301516147b4608084018260ff169052565b5060a08301516147cf60a08401826001600160401b03169052565b5060c08301516147e460c084018260ff169052565b5060e08301516147fa60e084018261ffff169052565b506101008381015160ff16908301526101208084015161481c828501826146d8565b505092915050565b60008060006060848603121561483957600080fd5b833561484481614249565b925060208401359150604084013561437081614449565b610100810161115e82846146d8565b6000806040838503121561487d57600080fd5b823561488881614249565b915060208301356145ea81614249565b600080604083850312156148ab57600080fd5b8235915060208301356145ea81614249565b6000808284036102408112156148d257600080fd5b83359250610220601f19820112156148e957600080fd5b506020830190509250929050565b6000610100828403121561210c57600080fd5b803560ff811681146141e657600080fd5b80356001600160401b03811681146141e657600080fd5b600061010080838503121561494657600080fd5b604051908101906001600160401b0382118183101715614968576149686143e8565b816040528092508335915061497c826141cd565b81815261498b602085016141db565b602082015261499c604085016141db565b60408201526149ad606085016141db565b60608201526149be608085016141db565b60808201526149cf60a085016141db565b60a08201526149e060c085016141db565b60c08201526149f160e085016141db565b60e0820152505092915050565b60006102208284031215614a1157600080fd5b614a19614426565b614a228361490a565b8152614a306020840161491b565b6020820152614a416040840161490a565b6040820152614a526060840161491b565b6060820152614a636080840161490a565b6080820152614a7460a0840161491b565b60a0820152614a8560c0840161490a565b60c0820152614a9660e08401614481565b60e0820152610100614aa981850161490a565b90820152610120614abc85858301614932565b908201529392505050565b60008060008060808587031215614add57600080fd5b5050823594602084013594506040840135936060013592509050565b81518152602080830151908201526040810161115e565b600080600060408486031215614b2557600080fd5b8335925060208401356001600160401b03811115614b4257600080fd5b614b4e86828701614189565b9497909650939450505050565b6101a08101818360005b600d811015614b84578151835260209283019290910190600101614b65565b50505092915050565b634e487b7160e01b600052601160045260246000fd5b8181038181111561115e5761115e614b8d565b8082018082111561115e5761115e614b8d565b600060208284031215614bdb57600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b808202811582820484141761115e5761115e614b8d565b634e487b7160e01b600052601260045260246000fd5b600082614c3457614c34614c0f565b500490565b6001600160801b0382811682821603908082111561244b5761244b614b8d565b60006101008284031215614c6c57600080fd5b6110da8383614932565b60006101a0808385031215614c8a57600080fd5b83601f840112614c9957600080fd5b6040518181018181106001600160401b0382111715614cba57614cba6143e8565b604052908301908085831115614ccf57600080fd5b845b83811015614ce9578051825260209182019101614cd1565b509095945050505050565b6000808335601e19843603018112614d0b57600080fd5b8301803591506001600160401b03821115614d2557600080fd5b602001915036819003821315611a8557600080fd5b8183823760009101908152919050565b600060208083528351808285015260005b81811015614d7757858101830151858201604001528201614d5b565b506000604082860101526040601f19601f8301168501019250505092915050565b600060e08284031215614daa57600080fd5b614db26143fe565b8251614dbd81614449565b81526020830151614dcd8161445c565b60208201526040830151614de08161445c565b60408201526060830151614df381614471565b60608201526080830151614e0681614471565b608082015260a0830151614e1981614471565b60a082015260c0830151614e2c816141cd565b60c08201529392505050565b600060208284031215614e4a57600080fd5b81516110da816141cd565b600081614e6457614e64614b8d565b506000190190565b600060018201614e7e57614e7e614b8d565b5060010190565b600080600060608486031215614e9a57600080fd5b8351614ea58161445c565b6020850151909350614eb68161445c565b604085015190925066ffffffffffffff8116811461437057600080fd5b600082614ee257614ee2614c0f565b500690565b634e487b7160e01b600052603160045260246000fdfe0000000000000000000000002b591e99afe9f32eaa6214f7b7629768c40eeb39a26469706673582212201c4a1eebc2fe62104a2bb0aa2eac15fb6171f364fc9ba4d33e5664d83040ab6464736f6c63430008120033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}; export default schema;
