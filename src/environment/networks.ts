import { EnvNetworkConfig, EnvNetworkName } from './types'

const networks = new Map<EnvNetworkName, EnvNetworkConfig>([
  [
    'ethereum',
    {
      chainId: 1,
      legacyNetworkType: 'main',
      endpoints: {
        ethereum: 'https://mainnet.eth.aragon.network/',
      },
      ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
      contracts: {
        tokenAntV1: '0x960b236A07cf122663c4303350609A66A7B288C0',
        tokenAntV2: '0xa117000000f279D81A1D3cc75430fAA017FA5A2e',
        migrator: '0x078BEbC744B819657e1927bF41aB8C74cBBF912D',
        antEthUniswapPool: '0xfa19de406e8f5b9100e4dd5cad8a503a6d686efe',
        antUniIncentivePool: '0xea4d68cf86bce59bf2bfa039b97794ce2c43debc',
        antEthBalancerPool: '0x2cf9106faf2c5c8713035d40df655fb1b9b0f9b9',
      },
    },
  ],
  [
    'rinkeby',
    {
      chainId: 4,
      legacyNetworkType: 'rinkeby',
      endpoints: {
        ethereum: 'https://rinkeby.eth.aragon.network/',
      },
      ipfsGateway: 'https://ipfs.eth.aragon.network/ipfs',
      contracts: {
        tokenAntV1: '0x7278e85BfFCE26A1C9f21b879595BD63F6289297',
        tokenAntV2: '0xa117000000f279D81A1D3cc75430fAA017FA5A2e',
        migrator: '0x078BEbC744B819657e1927bF41aB8C74cBBF912D',
      },
    },
  ],
])

export function getNetworkConfig(name: EnvNetworkName): EnvNetworkConfig {
  return networks.get(name) as EnvNetworkConfig
}
