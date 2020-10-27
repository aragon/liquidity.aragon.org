export type EnvNetworkName = 'ethereum' | 'rinkeby'

type LegacyNetworkType = 'main' | 'rinkeby'
type ChainId = 1 | 4

export interface EnvVariables {
  NETWORK_ENVIRONMENT(): string
  IPFS_GATEWAY(): string
  FORTMATIC_API_KEY(): string
  PORTIS_DAPP_ID(): string
  SENTRY_DSN(): string
  ANALYTICS_ENABLED(): string
}

export interface EnvNetworkConfig {
  chainId: ChainId
  legacyNetworkType: LegacyNetworkType
  endpoints: {
    ethereum: string
  }
  ipfsGateway: string
  contracts: {
    tokenAntV1: string
    tokenAntV2: string
    migrator: string
    antEthUniswapPool?: string
    antUniIncentivePool?: string
    antEthBalancerPool?: string
  }
}
