import { configureWagmi } from 'svelte-wagmi';

configureWagmi({
  walletconnect: true,
  walletconnectProjectID: '05457629b418a921473733246d2aeafe',
  // alchemyKey: 'abcdefghijklmnopqrstuvwxyz123456',
  autoConnect: true,
})
