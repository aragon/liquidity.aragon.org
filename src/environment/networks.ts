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
        unipoolAntV1: {
          lpToken: '',
          rewardToken: '',
          poolContract: '',
        },
        unipoolAntV2: {
          lpToken: '',
          rewardToken: '',
          poolContract: '',
        },
        balancer: {
          lpToken: '',
          rewardToken: '',
          poolContract: '',
        },
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
        unipoolAntV1: {
          lpToken: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
          rewardToken: '',
          poolContract: '0xd91c406571cd6edcdd67e3519096c868dfc160d5',
        },
        unipoolAntV2: {
          lpToken: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
          rewardToken: '',
          poolContract: '0xd91c406571cd6edcdd67e3519096c868dfc160d5',
        },
        balancer: {
          lpToken: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
          rewardToken: '',
          poolContract: '0xd91c406571cd6edcdd67e3519096c868dfc160d5',
        },
      },
    },
  ],
])

export function getNetworkConfig(name: EnvNetworkName): EnvNetworkConfig {
  return networks.get(name) as EnvNetworkConfig
}
