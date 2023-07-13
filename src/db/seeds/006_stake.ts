import * as ids from '../ids'
import * as utils from '../utils'
import * as conf from '../../../src/config'
import * as addresses from '../../stores/addresses'
import type { Knex } from "knex";
import type { Address, Contract, Log, Network } from 'knex/types/tables';
import type { Stake } from 'knex/types/tables';
import _, { sortBy } from 'lodash';
import { ethers } from 'ethers';

export const config = { transaction: false }

const DAY = 24n * 60n * 60n

export async function seed(knex: Knex): Promise<void> {
  const networks = await knex(utils.NETWORK)
    .withSchema(conf.args.databaseSchema)
  await Promise.all(networks.map(async (network) => {
    const contract = await knex(utils.CONTRACT)
      .withSchema(conf.args.databaseSchema)
      .join(utils.ADDRESS, `${utils.ADDRESS}.addressId`, `${utils.CONTRACT}.addressId`)
      .join(utils.NETWORK, `${utils.NETWORK}.networkId`, `${utils.ADDRESS}.networkId`)
      .where(`${utils.NETWORK}.networkId`, network.networkId)
      .where(`${utils.CONTRACT}.name`, 'Hex')
      .first() as Contract & Address
    const hsimContract = await knex(utils.CONTRACT)
      .withSchema(conf.args.databaseSchema)
      .join(utils.ADDRESS, `${utils.ADDRESS}.addressId`, `${utils.CONTRACT}.addressId`)
      .join(utils.NETWORK, `${utils.NETWORK}.networkId`, `${utils.ADDRESS}.networkId`)
      .where(`${utils.NETWORK}.networkId`, network.networkId)
      .where(`${utils.ADDRESS}.hash`, addresses.HSIM)
      .first() as Contract
    const [[end, goodAccounting, start], hsimStartEvent, hsimEndEvent] = await Promise.all([
      knex(utils.EVENT)
        .withSchema(conf.args.databaseSchema)
        .join(utils.CONTRACT, `${utils.CONTRACT}.contractId`, `${utils.EVENT}.contractId`)
        .join(utils.ADDRESS, `${utils.ADDRESS}.addressId`, `${utils.CONTRACT}.addressId`)
        .join(utils.NETWORK, `${utils.NETWORK}.networkId`, `${utils.ADDRESS}.networkId`)
        .where(`${utils.NETWORK}.networkId`, network.networkId)
        .where(`${utils.CONTRACT}.contractId`, contract.contractId)
        .whereIn(`${utils.EVENT}.name`, [
          'StakeEnd',
          'StakeGoodAccounting',
          'StakeStart',
        ])
        .orderBy(`${utils.EVENT}.name`, 'asc'),
      knex(utils.EVENT)
        .withSchema(conf.args.databaseSchema)
        .join(utils.CONTRACT, `${utils.CONTRACT}.contractId`, `${utils.EVENT}.contractId`)
        .join(utils.ADDRESS, `${utils.ADDRESS}.addressId`, `${utils.CONTRACT}.addressId`)
        .join(utils.NETWORK, `${utils.NETWORK}.networkId`, `${utils.ADDRESS}.networkId`)
        .where(`${utils.NETWORK}.networkId`, network.networkId)
        .where(`${utils.CONTRACT}.contractId`, hsimContract.contractId)
        .whereIn(`${utils.EVENT}.name`, ['HSIStart'])
        .first(),
      knex(utils.EVENT)
        .withSchema(conf.args.databaseSchema)
        .join(utils.CONTRACT, `${utils.CONTRACT}.contractId`, `${utils.EVENT}.contractId`)
        .join(utils.ADDRESS, `${utils.ADDRESS}.addressId`, `${utils.CONTRACT}.addressId`)
        .join(utils.NETWORK, `${utils.NETWORK}.networkId`, `${utils.ADDRESS}.networkId`)
        .where(`${utils.NETWORK}.networkId`, network.networkId)
        .where(`${utils.CONTRACT}.contractId`, hsimContract.contractId)
        .whereIn(`${utils.EVENT}.name`, ['HSIEnd'])
        .first(),
    ])
    const startKey = `${contract.contractId}/StakeStart`
    const startProgressId = ids.progress(contract.contractId, startKey)
    const endKey = `${contract.contractId}/StakeEnd`
    const endProgressId = ids.progress(contract.contractId, endKey)
    const goodAccountingKey = `${contract.contractId}/StakeEnd`
    const goodAccountingProgressId = ids.progress(contract.contractId, goodAccountingKey)
    const startProgress = await knex(utils.PROGRESS)
      .withSchema(conf.args.databaseSchema)
      .where('contractId', contract.contractId)
      .where('key', startKey)
      .first() || {
        progressId: startProgressId,
        contractId: contract.contractId,
        key: startKey,
        value: '0',
      }
    const endProgress = await knex(utils.PROGRESS)
      .withSchema(conf.args.databaseSchema)
      .where('contractId', contract.contractId)
      .where('key', endKey)
      .first() || {
        progressId: endProgressId,
        contractId: contract.contractId,
        key: endKey,
        value: '0',
      }
    const goodAccountingProgress = await knex(utils.PROGRESS)
      .withSchema(conf.args.databaseSchema)
      .where('contractId', contract.contractId)
      .where('key', goodAccountingKey)
      .first() || {
        progressId: goodAccountingProgressId,
        contractId: contract.contractId,
        key: goodAccountingKey,
        value: '0',
      }

    const getStartedEvents = await knex(utils.tableNames.LOG)
      .select('*')
      .withSchema(conf.args.databaseSchema)
      .where(`${utils.LOG}.eventId`, start.eventId)
      .where('blockNumber', '>=', parseInt(startProgress.value.toString()))
      .orderBy('blockNumber', 'asc')
      .orderBy('index', 'asc')
    console.log('start events %o', getStartedEvents.length)
    const chunked = _.chunk(getStartedEvents, 10_000)
    for (const chunk of chunked) {
      const first = chunk[0]
      const last = chunk[chunk.length - 1]
      chunk.forEach((item, index) => {
        if (item === last) {
          return
        }
        const next = chunk[index + 1]
        if (BigInt(item.args[2]) + 1n === BigInt(next.args[2])) {
          return
        }
        console.log(item, next)
        throw new Error('gap in stakes - rerun log collection')
      })
      const low = parseInt(first.args[2])
      const high = parseInt(last.args[2])
      const existingStakes = await knex(utils.tableNames.STAKE)
        .withSchema(conf.args.databaseSchema)
        .select('stakeIdParam')
        .where(`${utils.STAKE}.contractId`, contract.contractId)
        .where(`${utils.STAKE}.stakeIdParam`, '>=', low)
        .where(`${utils.STAKE}.stakeIdParam`, '<=', high)

      const existingSet = new Set<number>(_.map(existingStakes, ({ stakeIdParam }) => (
        parseInt(stakeIdParam.toString())
      )))
      const toInsert = _.orderBy(chunk.filter(({ args }) => !existingSet.has(parseInt(args[2]))), ({ args }) => parseInt(args[2]))
      if (!toInsert.length) {
        continue
      }
      const hsiStakeStartEvents = await knex(utils.LOG)
        .withSchema(conf.args.databaseSchema)
        .where('eventId', hsimStartEvent.eventId)
        .where('blockNumber', '>=', low)
        .where('blockNumber', '<=', high)
      const hsiAddresses = new Set<string>(hsiStakeStartEvents.map(
        (stakeStart) => ethers.utils.getAddress(stakeStart.args[1])
      ))
      const ownerAddresses = _(toInsert)
        .map('args.1') // owner
        .map((hash) => ethers.utils.getAddress(hash))
        .uniq()
        .map((hash) => ({
          addressId: ids.address(network.networkId, hash),
          networkId: network.networkId,
          hash,
        }))
        .value()
      const insertable = await stakeFromStartEvents(contract, toInsert, hsiAddresses)
      console.log('inserting start stake @%o %o - %o to %o',
        network.chainId, insertable.length,
        insertable[0].stakeIdParam, insertable[insertable.length - 1].stakeIdParam)
      await knex.transaction(async (tx) => {
        await utils.insertIntoTable(tx, utils.ADDRESS, ownerAddresses, ['addressId'], ['addressId'])
        await utils.insertIntoTable(tx, utils.STAKE, insertable, ['stakeId'], ['stakeId'])
        await tx(utils.PROGRESS)
          .withSchema(conf.args.databaseSchema)
          .where('progressId', startProgressId)
          .update('value', last.blockNumber)
      })
    }
    const getEndableStakes = await knex(utils.tableNames.LOG)
      .select('*')
      .withSchema(conf.args.databaseSchema)
      .where(`${utils.LOG}.eventId`, end.eventId)
      .where('blockNumber', '>=', parseInt(endProgress.value.toString()))
      .orderBy('blockNumber', 'asc')
      .orderBy('index', 'asc')
    const endedChunks = _.chunk(getEndableStakes, 10_000)
    for (const chunk of endedChunks) {
      const first = chunk[0]
      const last = chunk[chunk.length - 1]
      const low = parseInt(first.args[3])
      const high = parseInt(last.args[3])

      const hsiStakeStartEvents = await knex(utils.LOG)
        .withSchema(conf.args.databaseSchema)
        .where('eventId', hsimEndEvent.eventId)
        .where('blockNumber', '>=', low)
        .where('blockNumber', '<=', high)
      const hsiAddresses = new Set<string>(hsiStakeStartEvents.map(
        (stakeStart) => ethers.utils.getAddress(stakeStart.args[1])
      ))
      const stakeUpdates = stakeUpdateFromEndEvents(contract, chunk, hsiAddresses)
      console.log('applying end stake %o', stakeUpdates.length)
      await knex.transaction(async (tx) => {
        await Promise.all(stakeUpdates.map((stakeUpdate) => {
          tx(utils.STAKE)
            .update(stakeUpdate)
            .where('stakeId', stakeUpdate.stakeId)
        }))
        await tx(utils.PROGRESS)
          .withSchema(conf.args.databaseSchema)
          .where('progressId', endProgressId)
          .update('value', last.blockNumber)
      })
    }
    const getGoodAccountingEvents = await knex(utils.tableNames.LOG)
      .select('*')
      .withSchema(conf.args.databaseSchema)
      .where(`${utils.LOG}.eventId`, goodAccounting.eventId)
      .where('blockNumber', '>=', parseInt(goodAccountingProgress.value.toString()))
      .orderBy('blockNumber', 'asc')
      .orderBy('index', 'asc')
    const goodAccountingChunks = _.chunk(getGoodAccountingEvents, 10_000)
    for (const chunk of goodAccountingChunks) {
      const last = chunk[chunk.length - 1]
      const stakeUpdates = stakeUpdateFromGoodAccountingEvents(contract, chunk)
      const addrs = _(chunk)
        .map('args.4')
        .map((addr) => ethers.utils.getAddress(addr))
        .uniq()
        .map((hash) => ({
          hash,
          addressId: ids.address(contract.networkId, hash),
          networkId: contract.networkId,
        }))
        .value()

      console.log('applying end stake %o', stakeUpdates.length)
      await knex.transaction(async (tx) => {
        await utils.insertIntoTable(tx, utils.ADDRESS, addrs, ['addressId'], ['addressId'])
        await Promise.all(stakeUpdates.map((stakeUpdate) => {
          tx(utils.STAKE)
            .update(stakeUpdate)
            .where('stakeId', stakeUpdate.stakeId)
        }))
        await tx(utils.PROGRESS)
          .withSchema(conf.args.databaseSchema)
          .where('progressId', goodAccountingProgressId)
          .update('value', last.blockNumber)
      })
    }
  }))
}

const stakeUpdateFromGoodAccountingEvents = (contract: Contract & Address, chunk: Log[]) => {
  return chunk.map((item) => {
    const stakeId = BigInt(item.args[3])
    return {
      stakeId: ids.stake(contract.contractId, stakeId),
      stakeIdParam: stakeId.toString(),
      goodAccountingAddressId: ids.address(contract.networkId, item.args[4]),
      penalty: BigInt.asUintN(72, BigInt(item.args[1])),
      payout: BigInt.asUintN(72, BigInt(item.args[0]) >> 184n),
    }
  })
}

const stakeUpdateFromEndEvents = (contract: Contract & Address, chunk: Log[], hsiAddresses: Set<string>) => {
  return chunk.map<Partial<Stake>>((log) => {
    const data0 = BigInt(log.args[0])
    const data1 = BigInt(log.args[1])
    const timestamp = BigInt.asUintN(40, data0)
    const payout = BigInt.asUintN(72, data0 >> 184n)
    const penalty = BigInt.asUintN(72, data1)
    const unlockedDay = (timestamp / DAY) - 18233n + 1n
    return {
      stakeId: ids.stake(contract.contractId, BigInt(log.args[3])),
      stakeEndLogId: log.logId,
      unlockedDay,
      isHsi: hsiAddresses.has(ethers.utils.getAddress(log.args[2])),
      payout,
      penalty,
      isEnded: true,
    }
  })
}

const stakeFromStartEvents = async (
  contract: Contract & Address,
  startLogs: Log[],
  hsiAddresses: Set<string>,
) => {
  return startLogs.map<Stake>((log) => {
    const data = BigInt(log.args[0])
    const timestamp = BigInt.asUintN(40, data)
    const stakedHearts = BigInt.asUintN(256, data << 144n) >> 184n
    const stakeShares = BigInt.asUintN(256, data << 72n) >> 184n
    const stakedDays = BigInt.asUintN(256, data << 56n) >> 240n
    const isAutoStake = data >> 200n === 1n
    const lockedDay = (timestamp / DAY) - 18233n + 1n
    const stakeIdParam = log.args[2]
    const owner = ethers.utils.getAddress(log.args[1])
    return {
      stakeId: ids.stake(contract.contractId, BigInt(stakeIdParam)),
      stakeIdParam,
      stakeStartLogId: log.logId,
      stakeEndLogId: null,
      contractId: contract.contractId,
      lockedDay,
      stakedHearts,
      stakeShares,
      stakedDays,
      isAutoStake,
      isHsi: hsiAddresses.has(owner),
      penalty: null,
      payout: null,
      unlockedDay: null,
      ownerAddressId: ids.address(contract.networkId, owner),
    }
  })
}
