import type { Knex } from 'knex';
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}
declare module 'knex/types/tables' {
  interface Network {
    networkId: string;
		chainId: number;
		name: string;
		testnet: boolean;
		createdAt: Date;
		updatedAt: Date;
  }
	interface Address {
		addressId: string;
		networkId: string;
		hash: string;
		createdAt: Date;
		updatedAt: Date;
	}
	interface Block {
		blockId: string;
		networkId: string;
		hash: string;
		height: bigint;
		minedTimestamp: Date;
		finalized: boolean;
		createdAt: Date;
		updatedAt: Date;
	}
	interface Transaction {
		transactionId: string;
		networkId: string;
		blockId: string;
		hash: string;
		index: number | null;
		fromAddressId: string | null;
		toAddressId: string | null;
		createdAt: Date;
		updatedAt: Date;
	}
	interface Contract {
		contractId: string;
		addressId: string;
		transactionId: string;
		name: string;
		createdAt: Date;
		updatedAt: Date;
	}
	interface Progress {
		progressId: string;
		contractId: string;
		key: string;
		value: bigint;
		createdAt: Date;
		updatedAt: Date;
	}
	interface Log {
		logId: string;
		eventId: string;
		transactionHash: string;
		blockNumber: bigint;
		index: number;
		args: string[];
	}
	interface Event {
		eventId: string;
		contractId: string;
		args: string[];
		name: string;
		signature: string;
	}
	interface Stake {
		stakeId: string;
		stakeIdParam: string;
		stakeShares: bigint;
		stakedHearts: bigint;
		lockedDay: bigint;
		stakedDays: bigint;
		unlockedDay: bigint | null;
		penalty: bigint | null;
		payout: bigint | null;
		isAutoStake: boolean;
		stakeStartLogId: string | null;
		stakeEndLogId: string | null;
	}
	interface Tables {
		network: Network;
		address: Address;
		block: Block;
		transaction: Transaction;
		contract: Contract;
		progress: Progress;
		event: Event;
		event_composite: Knex.CompositeTableType<Event, Omit<Event, 'args'> & {
			args: string;
		}>;
		log: Log;
		log_composite: Knex.CompositeTableType<Log, Omit<Log, 'args'> & {
			args: string;
		}>;
		stake: Stake;
	}
}
declare global {
  interface Window {
    ethereum: import('ethers').ExternalProvider;
  }
}
import type { SvelteComponentTyped } from "svelte";
class ComponentName extends SvelteComponentTyped<{propertyName: string;}> {}