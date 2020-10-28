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

interface PoolContracts {
  lpToken: string
  rewardToken: string
  poolContract: string
}

export type ContractGroup = 'unipoolAntV1' | 'unipoolAntV2' | 'balancer'

export interface EnvNetworkConfig {
  chainId: ChainId
  legacyNetworkType: LegacyNetworkType
  endpoints: {
    ethereum: string
  }
  ipfsGateway: string
  contracts: Record<ContractGroup, PoolContracts>
}
