import type { Knex } from 'knex';

declare module 'knex/types/tables' {
  interface Network {
		chainId: number;
		name: string;
		testnet: boolean;
		createdAt: Date;
		updatedAt: Date;
  }
	interface GoodAccountingSignature {
		stakeId: string;
		signature: string;
		chainId: number;
		account: string;
		validStart: Date;
		validUntil: Date;
		createdAt: Date;
		updatedAt: Date;
	}
	interface Tables {
		network: Network;
		goodAccountingSignature: GoodAccountingSignature;
	}
}
