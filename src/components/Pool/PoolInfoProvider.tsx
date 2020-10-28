import React, { ReactNode, useContext, useMemo } from 'react'
import { ContractGroup } from '../../environment/types'
import tokenUsdcSvg from '../../assets/token-usdc.svg'
import tokenEthSvg from '../../assets/token-eth.svg'
import tokenUniSvg from '../../assets/token-uni.svg'
import tokenBptSvg from '../../assets/token-bpt.svg'

export type PoolName =
  | 'unipoolAntV1Eth'
  | 'unipoolAntV2Eth'
  | 'balancerAntV2Usdc'

type PoolInfoProviderState = {
  poolName: PoolName
  children: ReactNode
}

type PoolAttributes = {
  stakeToken: {
    graphic: string
    symbol: string
  }
  rewardToken: {
    graphic: string
    symbol: string
  }
  contractGroup: ContractGroup
  liquidityUrl: string | null
}

type PoolInfoContext = PoolAttributes & {
  poolName: PoolName
}

const UsePoolInfoContext = React.createContext<PoolInfoContext | null>(null)

function PoolInfoProvider({
  children,
  poolName,
}: PoolInfoProviderState): JSX.Element {
  const {
    stakeToken,
    rewardToken,
    contractGroup,
    liquidityUrl,
  } = useMemo((): PoolAttributes => {
    const attributes: Record<PoolName, PoolAttributes> = {
      unipoolAntV1Eth: {
        stakeToken: {
          graphic: tokenUniSvg,
          symbol: 'UNI',
        },
        rewardToken: {
          graphic: tokenEthSvg,
          symbol: 'ETH',
        },
        contractGroup: 'unipoolAntV1',
        liquidityUrl: null,
      },
      unipoolAntV2Eth: {
        stakeToken: {
          graphic: tokenUniSvg,
          symbol: 'UNI',
        },
        rewardToken: {
          graphic: tokenEthSvg,
          symbol: 'WETH',
        },
        contractGroup: 'unipoolAntV2',
        liquidityUrl:
          'https://info.uniswap.org/pair/0x9def9511fec79f83afcbffe4776b1d817dc775ae',
      },
      balancerAntV2Usdc: {
        stakeToken: {
          graphic: tokenBptSvg,
          symbol: 'BPT',
        },
        rewardToken: {
          graphic: tokenUsdcSvg,
          symbol: 'USDC',
        },
        contractGroup: 'balancer',
        liquidityUrl:
          'https://pools.balancer.exchange/#/pool/0xde0999ee4e4bea6fecb03bf4ebef2626942ec6f5/',
      },
    }

    return attributes[poolName]
  }, [poolName])

  const contextValue = useMemo(
    (): PoolInfoContext => ({
      stakeToken,
      rewardToken,
      contractGroup,
      liquidityUrl,
      poolName,
    }),
    [stakeToken, rewardToken, contractGroup, liquidityUrl, poolName]
  )

  return (
    <UsePoolInfoContext.Provider value={contextValue}>
      {children}
    </UsePoolInfoContext.Provider>
  )
}

function usePoolInfo(): PoolInfoContext {
  return useContext(UsePoolInfoContext) as PoolInfoContext
}

export { PoolInfoProvider, usePoolInfo }
