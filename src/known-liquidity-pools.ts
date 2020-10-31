import tokenUsdcSvg from './assets/token-usdc.svg'
import tokenEthSvg from './assets/token-eth.svg'
import tokenUniSvg from './assets/token-uni.svg'
import tokenBptSvg from './assets/token-bpt.svg'
import { ContractGroup } from './environment/types'

export type PoolName =
  | 'unipoolAntV1Eth'
  | 'unipoolAntV2Eth'
  | 'balancerAntV2Usdc'

export type PoolAttributes = {
  stakeToken: {
    graphic: string
    symbol: string
    decimals: number
  }
  rewardToken: {
    graphic: string
    symbol: string
    decimals: number
  }
  contractGroup: ContractGroup
  liquidityUrl: string | null
  expired?: boolean
}

export const KNOWN_LIQUIDITY_POOLS = new Map<PoolName, PoolAttributes>([
  [
    'unipoolAntV2Eth',
    {
      stakeToken: {
        graphic: tokenUniSvg,
        symbol: 'UNI',
        decimals: 18,
      },
      rewardToken: {
        graphic: tokenEthSvg,
        symbol: 'WETH',
        decimals: 18,
      },
      contractGroup: 'unipoolAntV2',
      liquidityUrl:
        'https://info.uniswap.org/pair/0x9def9511fec79f83afcbffe4776b1d817dc775ae',
    },
  ],
  [
    'balancerAntV2Usdc',
    {
      stakeToken: {
        graphic: tokenBptSvg,
        symbol: 'BPT',
        decimals: 18,
      },
      rewardToken: {
        graphic: tokenUsdcSvg,
        symbol: 'USDC',
        decimals: 6,
      },
      contractGroup: 'balancer',
      liquidityUrl:
        'https://pools.balancer.exchange/#/pool/0xde0999ee4e4bea6fecb03bf4ebef2626942ec6f5/',
    },
  ],
  [
    'unipoolAntV1Eth',
    {
      stakeToken: {
        graphic: tokenUniSvg,
        symbol: 'UNI',
        decimals: 18,
      },
      rewardToken: {
        graphic: tokenEthSvg,
        symbol: 'ETH',
        decimals: 18,
      },
      contractGroup: 'unipoolAntV1',
      liquidityUrl: null,
      expired: true,
    },
  ],
])
