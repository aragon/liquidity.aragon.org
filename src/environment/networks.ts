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
          poolContract: '0xEA4D68CF86BcE59Bf2bFA039B97794ce2c43dEBC',
          lpToken: '0xfa19de406e8F5b9100E4dD5CaD8a503a6d686Efe', // UNI
          rewardToken: '0x960b236A07cf122663c4303350609A66A7B288C0', // ANT
        },
        unipoolAntV2: {
          poolContract: '0x37b7870148b4b815cb6a4728a84816cc1150e3aa',
          lpToken: '0x9def9511fec79f83afcbffe4776b1d817dc775ae', // UNI
          rewardToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
        },
        balancer: {
          poolContract: '0x7f2b9e4134ba2f7e99859ae40436cbe888e86b79',
          lpToken: '0xde0999ee4e4bea6fecb03bf4ebef2626942ec6f5', // BPT
          rewardToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
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
          poolContract: '0xd91c406571cd6edcdd67e3519096c868dfc160d5',
          lpToken: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
          rewardToken: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
        },
        unipoolAntV2: {
          poolContract: '0xd91c406571cd6edcdd67e3519096c868dfc160d5',
          lpToken: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
          rewardToken: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
        },
        balancer: {
          poolContract: '0xd91c406571cd6edcdd67e3519096c868dfc160d5',
          lpToken: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
          rewardToken: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
        },
      },
    },
  ],
])

export function getNetworkConfig(name: EnvNetworkName): EnvNetworkConfig {
  return networks.get(name) as EnvNetworkConfig
}
