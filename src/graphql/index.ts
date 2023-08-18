import * as graphqlRequest from 'graphql-request'
import * as _queries from './queries'

const hexUrls = new Map<number, string>([
  [1, 'https://graph.ethereum.pulsechain.com/subgraphs/name/Codeakk/Hex'],
  [369, 'https://graph.pulsechain.com/subgraphs/name/Codeakk/Hex'],
  [943, 'https://graph.v4.testnet.pulsechain.com/subgraphs/name/Codeakk/Hex'],
])

const hedronUrls = new Map<number, string>([
  [1, 'https://api.thegraph.com/subgraphs/name/seminatempus/hedron-v2'],
  [369, 'https://graph.pulsefusion.io/subgraphs/name/hedron'],
  // [943, 'https://graph.v4.testnet.pulsechain.com/subgraphs/name/Codeakk/Hex'],
])

export const createClients = (urls: Map<number, string>) => (
  new Map<number, graphqlRequest.GraphQLClient>([...urls.entries()].map(([chainId, url]) => (
    [chainId, new graphqlRequest.GraphQLClient(url)]
  )))
)

export const hexClients = createClients(hexUrls)

export const hedronClients = createClients(hedronUrls)

export const getHexByChainId = (chainId: number) => {
  const client = hexClients.get(chainId)
  if (!client) {
    throw new Error('unsupported chain id')
  }
  return client
}

export const getHedronByChainId = (chainId: number) => {
  const client = hedronClients.get(chainId)
  if (!client) {
    throw new Error('unsupported chain id')
  }
  return client
}

export const queries = _queries
