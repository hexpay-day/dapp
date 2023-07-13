import * as ids from '../ids'
import * as utils from '../utils'
import * as conf from '../../../src/config'
import type { Knex } from "knex";
import * as ethers from 'ethers'
import type { Contract, Network, Progress, Event, Transaction, Block, Log } from 'knex/types/tables';
import _ from 'lodash';
import { fewAtATime, printInterval, timeout } from '../../../src/utils';
import { key } from './004_progress'
import * as contracts from '../../stores/contracts'

const jump = 999

const createProvider = (chainId: number) => {
  const rpc = conf.args[`rpc${chainId}`] as string
  return new ethers.providers.WebSocketProvider(rpc, chainId)
}

export async function seed(knex: Knex): Promise<void> {
  const networks = await knex(utils.NETWORK)
    .withSchema(conf.args.databaseSchema)
    .select<Network[]>('*')
    // ensure mainnet eth is hit first so that we can
    // use that data to feed into forks
    .orderBy('chainId', 'asc')
  // move to parallel once first round is done collecting
  const mainnet = _.find(networks, {
    chainId: 1,
  }) as Network
  for (const network of networks) {
    await Promise.all([
      collect(knex, network, mainnet, contracts.Hex),
      collect(knex, network, mainnet, contracts.HSIM),
    ])
  }
}

const collect = async <T extends ethers.Contract>(knex: Knex, network: Network, mainnet: Network, contract: T) => {
  const provider = createProvider(network.chainId)
  const finalizedBlock = await provider.getBlock('finalized')
  const targetContract = await getContractUnderNetwork(knex, network.networkId, contract.address)
  const mainnetContract = await getContractUnderNetwork(knex, mainnet.networkId, contract.address)
  const transaction = await knex(utils.TRANSACTION)
    .withSchema(conf.args.databaseSchema)
    .join(utils.BLOCK, `${utils.BLOCK}.blockId`, `${utils.TRANSACTION}.blockId`)
    .where('transactionId', targetContract.transactionId)
    .first() as Transaction & Block
  await collectSharedHistory(
    knex,
    provider,
    network,
    mainnet,
    targetContract,
    mainnetContract,
    // contract,
    finalizedBlock.number,
  )
  await collectSplitHistory(
    knex,
    provider,
    network,
    targetContract,
    contract,
    Number(transaction.height),
    finalizedBlock.number
  )
}

const getContractUnderNetwork = async (knex: Knex, networkId: string, address: string) => await knex(utils.CONTRACT)
  .withSchema(conf.args.databaseSchema)
  .join(utils.ADDRESS, `${utils.ADDRESS}.addressId`, `${utils.CONTRACT}.addressId`)
  .where(`${utils.ADDRESS}.hash`, address)
  .where('networkId', networkId)
  .first() as Contract

const collectSplitHistory = async (
  knex: Knex,
  provider: ethers.providers.JsonRpcProvider,
  network: Network,
  targetContract: Contract,
  contract: ethers.Contract,
  startBlockNumber: number,
  endBlockNumber: number,
) => {
  const range = _.range(startBlockNumber, endBlockNumber - jump, jump + 1)
  const address = await knex(utils.ADDRESS)
    .withSchema(conf.args.databaseSchema)
    .where('addressId', targetContract.addressId)
    .first()
  const filter = {
    address: address?.hash,
  }
  const events = await knex(utils.EVENT)
    .withSchema(conf.args.databaseSchema)
    .where('contractId', targetContract.contractId)
  const eventIds = _.map(events, 'eventId')
  const eventsBySigHash = new Map<string, Event>(events.map((event) => [
    event.signature,
    event,
  ]))
  await printInterval(
    10, range, 'collecting-logs',
    async (targetBlock) => {
      if (targetBlock + jump >= endBlockNumber) {
        return
      }
      const l = await knex(utils.LOG)
        .withSchema(conf.args.databaseSchema)
        .whereIn('eventId', eventIds)
        .where('blockNumber', '>=', targetBlock)
        .where('blockNumber', '<=', targetBlock + jump)
        .first()
      if (l) {
        return
      }
      const [endBlock, allLogs] = await queryFilter(contract, filter, targetBlock, endBlockNumber)
      const logDescriptions = parseLogs(contract.interface, allLogs)
      const onlyRelevantEvents = (parsed: ParsedLog) => !!eventsBySigHash.get(parsed?.signature as string)
      const relevantLogs = _.filter(allLogs, (_log, index) => onlyRelevantEvents(logDescriptions[index]))
      const relevantLogDescriptions = _.filter(logDescriptions, (_log, index) => onlyRelevantEvents(logDescriptions[index]))
      const blockHeights = _(relevantLogs)
        .map('blockNumber')
        .uniq()
        .value()
      const uniqueTransactions = _(relevantLogs)
        .uniqBy('transactionHash')
        .uniq()
        .map((log) => ({
          transactionId: ids.transaction(network.networkId, log.transactionHash),
          blockId: ids.block(network.networkId, log.blockHash),
          hash: log.transactionHash,
          networkId: network.networkId,
          index: log.transactionIndex,
          fromAddressId: null,
          toAddressId: null,
        }))
        .value()
      const blockTimestamps = await getTimestamps(provider, blockHeights)
      const uniqueBlocks = _(relevantLogs)
        .uniqBy('blockNumber')
        .map((log) => ({
          blockId: ids.block(network.networkId, log.blockHash),
          minedTimestamp: new Date(blockTimestamps.get(log.blockNumber) as number * 1_000),
          networkId: network.networkId,
          finalized: true,
          hash: log.blockHash,
          height: BigInt(log.blockNumber),
        }))
        .value()
      const insertableLogs = relevantLogDescriptions.map((parsed, i) => {
        const log = relevantLogs[i]
        const event = eventsBySigHash.get(parsed?.signature as string) as Event
        if (!event) {
          throw new Error('unable to find event')
        }
        const logId = ids.log(
          event.eventId,
          Number(log.blockNumber),
          log.transactionHash,
          log.logIndex,
        )
        const args = parsed?.args.slice(0).map<string>((val) => val.toString())
        return {
          transactionHash: log.transactionHash,
          blockNumber: BigInt(log.blockNumber),
          eventId: event.eventId,
          logId,
          index: log.logIndex,
          args: JSON.stringify(args),
        }
      })
      if (!insertableLogs.length) {
        return
      }
      console.log('inserting', new Map<string, number>([
        ['tgt', targetBlock],
        ['blk', uniqueBlocks.length],
        ['txs', uniqueTransactions.length],
        ['log', insertableLogs.length],
      ]))
      await knex.transaction(async (tx) => {
        await utils.insertIntoTable(tx, utils.BLOCK, uniqueBlocks, ['blockId'], ['blockId'])
        await utils.insertIntoTable(tx, utils.TRANSACTION, uniqueTransactions, ['transactionId'], ['transactionId'])
        await utils.insertIntoTable(tx, utils.LOG, insertableLogs, ['logId'], ['logId'])
        await updateProgress(tx, targetContract.contractId, key, endBlock)
      })
    },
  )
}

export const config = { transaction: false }

const getTimestamps = async (provider: ethers.providers.Provider, blockNumbers: number[]) => {
  return new Map<number, number>(await Promise.all(blockNumbers.map(
    async (blockNumber) => {
      const block = await rpcQuery(() => provider.getBlock(blockNumber))
      return [blockNumber, block.timestamp] as [number, number]
    },
  )))
}
export type ParsedLog = ethers.utils.LogDescription | null

export const parseLogs = (
  interfac: ethers.utils.Interface,
  logs: ethers.providers.Log[],
): ParsedLog[] => (
  logs.map<ParsedLog>((unparsedLog) => {
    try {
      return interfac.parseLog(unparsedLog)
    } catch (err) {
      return null
    }
  })
)

const queryFilter = async (
  contract: ethers.Contract,
  filter: ethers.EventFilter,
  targetBlock: number,
  endBlockNumber: number,
) => {
  const endBlock = Math.min(targetBlock + jump, endBlockNumber)
  return Promise.all([endBlock, await rpcQuery(() => contract.queryFilter(filter, targetBlock, endBlock))])
}

const rpcQuery = fewAtATime(200, async <T>(fn: () => Promise<T>) => {
  try {
    return await fn()
  } catch (err: any) {
    if (err.code === 'UND_ERR_HEADERS_TIMEOUT' || err.code === 'ENOTFOUND' || err.code === 'SERVER_ERROR') {
      await timeout(10_000)
      return await fn()
    }
    throw err
  }
})

const collectSharedHistory = async (
  knex: Knex,
  provider: ethers.providers.JsonRpcProvider,
  network: Network,
  mainnet: Network,
  targetContract: Contract,
  mainnetContract: Contract,
  // contract: ethers.Contract,
  finalizedBlockNumber: number,
) => {
  const collectingMainnet = network.chainId === mainnet.chainId
  console.log('collecting mainnet %o', collectingMainnet)
  if (collectingMainnet) {
    return
  }
  const transaction = await knex(utils.TRANSACTION)
    .withSchema(conf.args.databaseSchema)
    .join(utils.BLOCK, `${utils.BLOCK}.blockId`, `${utils.TRANSACTION}.blockId`)
    .where('transactionId', targetContract.transactionId)
    .first() as Transaction & Block
  const range = _.range(Number(transaction.height), finalizedBlockNumber - jump, jump + 1)
  const progress = await knex(utils.PROGRESS)
    .withSchema(conf.args.databaseSchema)
    .where('progressId', ids.progress(targetContract.contractId, key))
    .first() as Progress
  let progressValue = parseInt(progress.value.toString())
  let knownNotShared = 0
  console.log('collecting shared history %o', range.length)
  const targetEvents = await knex(utils.EVENT)
    .withSchema(conf.args.databaseSchema)
    .where('contractId', targetContract.contractId)
  const targetEventIds = _.map(targetEvents, 'eventId')
  const mainnetEvents = await knex(utils.EVENT)
    .withSchema(conf.args.databaseSchema)
    .where('contractId', mainnetContract.contractId)
  const mainnetEventIds = _.map(mainnetEvents, 'eventId')
  const parallel = 5
  await printInterval(
    parallel, range, 'shared-history',
    async (targetBlock) => {
      const endBlock = targetBlock + jump
      if (knownNotShared && knownNotShared < targetBlock) {
        return
      }
      if (progressValue - (parallel * 1_000) > targetBlock) {
        return
      }
      const [
        [{ count: mainnetCount }],
        [{ count: targetCount }],
      ] = await knex.transaction(async (tx) => {
        return Promise.all([
          getBetween(tx, mainnetEventIds, targetBlock, endBlock)
            .count('logId'),
          getBetween(tx, targetEventIds, targetBlock, endBlock)
            .count('logId'),
        ])
      })
      // already copied
      if (+mainnetCount === +targetCount) {
        return
      }
      const logs = await getBetween(knex, mainnetEventIds, targetBlock, endBlock)
        .select<(Log & {
          eventName: string;
          eventSignature: string;
          eventArgs: string[];
        })[]>([
          `${utils.LOG}.*`,
          `${utils.EVENT}.name as eventName`,
          `${utils.EVENT}.signature as eventSignature`,
          `${utils.EVENT}.args as eventArgs`,
        ])
        .orderBy('blockNumber', 'asc')
      const last = logs[logs.length - 1]
      if (last) {
        const block = await provider.getBlock(Number(last.blockNumber))
        if (block) {
          const insertable = logs.map((log) => {
            const eventId = ids.event(
              targetContract.contractId,
              log.eventName,
              log.eventSignature,
              log.eventArgs,
            )
            const logId = ids.log(
              eventId,
              Number(log.blockNumber),
              log.transactionHash,
              log.index,
            )
            return {
              transactionHash: log.transactionHash,
              blockNumber: log.blockNumber,
              index: log.index,
              args: JSON.stringify(log.args),
              eventId,
              logId,
            }
          })
          const transactionHashes = _.map(insertable, 'transactionHash')
          const [mainnetBlocks, mainnetTransactions] = await Promise.all([
            knex(utils.BLOCK)
              .withSchema(conf.args.databaseSchema)
              .where('height', '>=', targetBlock)
              .where('height', '<=', endBlock)
              .where('networkId', mainnet.networkId),
            knex(utils.TRANSACTION)
              .withSchema(conf.args.databaseSchema)
              .whereIn('hash', transactionHashes)
              .where('networkId', mainnet.networkId),
          ])
          const networkBlocks = mainnetBlocks.map((block) => ({
            ...block,
            networkId: network.networkId,
            blockId: ids.block(network.networkId, block.hash),
          }))
          const networkTransactions = mainnetTransactions.map((tx) => ({
            ...tx,
            networkId: network.networkId,
            transactionId: ids.transaction(network.networkId, tx.hash),
          }))
          await knex.transaction(async (tx) => {
            await utils.insertIntoTable(tx, utils.BLOCK, networkBlocks, ['blockId'], ['blockId'])
            await utils.insertIntoTable(tx, utils.TRANSACTION, networkTransactions, ['transactionId'], ['transactionId'])
            await utils.insertIntoTable(tx, utils.LOG, insertable, ['logId'], ['logId'])
            await updateProgress(tx, targetContract.contractId, key, endBlock - (parallel * 1_000))
          })
          return
        }
      }
      knownNotShared = targetBlock
    },
  )
}

const updateProgress = async (tx: utils.Tx, contractId: string, key: string, endBlock: number) => {
  const progressId = ids.progress(contractId, key)
  const progress = await tx(utils.PROGRESS)
    .withSchema(conf.args.databaseSchema)
    .where('progressId', progressId)
    .first() as Progress
  if (!progress) {
    return await tx(utils.PROGRESS)
      .withSchema(conf.args.databaseSchema)
      .insert([{
        progressId,
        contractId,
        key,
        value: BigInt(endBlock),
      }])
      .onConflict(['progressId'])
      .merge(['progressId'])
  } else {
    return await tx(utils.PROGRESS)
      .withSchema(conf.args.databaseSchema)
      .update('value', endBlock)
      .where('progressId', progressId)
      .where('value', '<', endBlock)
  }
}

const getBetween = (
  knex: Knex,
  eventIds: string[],
  targetBlock: number,
  finalBlock: number,
) => {
  return knex(utils.LOG)
    .withSchema(conf.args.databaseSchema)
    .join(utils.EVENT, `${utils.EVENT}.eventId`, `${utils.LOG}.eventId`)
    .whereIn(`${utils.EVENT}.eventId`, eventIds)
    .where('blockNumber', '>=', targetBlock)
    .where('blockNumber', '<=', finalBlock)
}
