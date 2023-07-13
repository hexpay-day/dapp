import * as ids from '../ids'
import * as utils from '../utils'
import * as config from '../../config'
import type { Knex } from "knex";
import * as contracts from '../../stores/contracts'
import type { Contract, Event } from 'knex/types/tables';
import _ from 'lodash';
import type { ethers } from 'ethers';

export async function seed(knex: Knex): Promise<void> {
  await Promise.all([
    insertEvents(knex, contracts.Hex),
    insertEvents(knex, contracts.HSIM),
  ])
}

const insertEvents = async (knex: Knex, contract: ethers.Contract) => {
  const contractItems = await knex(utils.CONTRACT)
    .withSchema(config.args.databaseSchema)
    .select<Contract[]>('*')
    .join(utils.ADDRESS, `${utils.ADDRESS}.addressId`, `${utils.CONTRACT}.addressId`)
    .where(`${utils.ADDRESS}.hash`, contract.address)
  const eventEntries = Object.entries(contract.interface.events)
  const insertable = eventEntries.map(([signature, fragment]) => {
    if (fragment.name.includes('Approval') || fragment.name.includes('Transfer')) {
      return []
    }
    const eventBase = {
      name: fragment.name,
      args: _.map(fragment.inputs, 'name'),
    }
    return contractItems.map(({ contractId }) => ({
      name: eventBase.name,
      args: JSON.stringify(eventBase.args),
      contractId,
      signature,
      eventId: ids.event(
        contractId,
        eventBase.name,
        signature,
        eventBase.args,
      ),
    } as unknown as Event))
  })
  await knex(utils.EVENT)
    .withSchema(config.args.databaseSchema)
    .insert(_.flatten(insertable))
    .onConflict(['eventId'])
    .merge(['eventId'])
}
