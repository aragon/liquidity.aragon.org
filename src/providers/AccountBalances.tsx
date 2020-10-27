import React, { ReactNode, useContext, useMemo } from 'react'
import { BigNumber } from 'ethers'
import { usePollTokenPriceUsd } from '../hooks/usePollTokenPriceUsd'
import {
  useBalancerStakedBalance,
  useIncentiveStakedBalance,
  useAntTokenBalance,
  useUniswapStakedBalance,
  useAntTotalSupply,
} from '../hooks/usePolledBalance'
import { useWallet } from 'use-wallet'
import { networkEnvironment } from '../environment'

const ANT_TOKEN_DECIMALS = 18

const { contracts } = networkEnvironment

type PolledValue = BigNumber | null

type BalancesContext = {
  antV1Balance: PolledValue
  antV2Balance: PolledValue
  antV2MigratorBalance: PolledValue
  antV2TotalSupply: PolledValue
  uniswapPoolBalance: PolledValue
  balancerPoolBalance: PolledValue
  incentivePoolBalance: PolledValue
  antTokenPriceUsd: string | null
}

const AccountBalancesContext = React.createContext<BalancesContext>({
  antV1Balance: null,
  antV2Balance: null,
  antV2MigratorBalance: null,
  antV2TotalSupply: null,
  uniswapPoolBalance: null,
  balancerPoolBalance: null,
  incentivePoolBalance: null,
  antTokenPriceUsd: null,
})

function AccountBalancesProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const { account } = useWallet()

  const antV1BalanceBn = useAntTokenBalance('v1', account)
  const antV2BalanceBn = useAntTokenBalance('v2', account)
  const antV2MigratorBalanceBn = useAntTokenBalance(
    'v2',
    contracts.migrator,
    true
  )
  const antV2TotalSupplyBn = useAntTotalSupply('v2')
  const antTokenPriceUsd = usePollTokenPriceUsd()

  const antInUniswapPoolBn = useUniswapStakedBalance()
  const antInBalancerPoolBn = useBalancerStakedBalance()
  const antInIncentivePoolBn = useIncentiveStakedBalance()

  const contextValue = useMemo(
    (): BalancesContext => ({
      antV1Balance: antV1BalanceBn,
      antV2Balance: antV2BalanceBn,
      antV2MigratorBalance: antV2MigratorBalanceBn,
      antV2TotalSupply: antV2TotalSupplyBn,
      uniswapPoolBalance: antInUniswapPoolBn,
      balancerPoolBalance: antInBalancerPoolBn,
      incentivePoolBalance: antInIncentivePoolBn,
      antTokenPriceUsd,
    }),
    [
      antV1BalanceBn,
      antV2BalanceBn,
      antV2MigratorBalanceBn,
      antV2TotalSupplyBn,
      antTokenPriceUsd,
      antInUniswapPoolBn,
      antInBalancerPoolBn,
      antInIncentivePoolBn,
    ]
  )

  return (
    <AccountBalancesContext.Provider value={contextValue}>
      {children}
    </AccountBalancesContext.Provider>
  )
}

type BalanceWithDecimals = {
  balance: PolledValue
  decimals: number
}

type LpPool = 'balancer' | 'uniswap' | 'incentive'
type LpBalances = [LpPool, BigNumber][]

type AccountBalances = {
  antV1: BalanceWithDecimals
  antV2: BalanceWithDecimals
  lpBalances: {
    all: LpBalances | null
    available: LpBalances | null
    hasBalances: boolean | null
  }
  antTokenPriceUsd: string | null
  antV2TotalSupply: PolledValue
  antV2MigratedAmount: PolledValue
}

function useAccountBalances(): AccountBalances {
  const {
    antV1Balance,
    antV2Balance,
    antV2MigratorBalance,
    antV2TotalSupply,
    antTokenPriceUsd,
    uniswapPoolBalance,
    balancerPoolBalance,
    incentivePoolBalance,
  } = useContext(AccountBalancesContext)

  const antV2MigratedAmount = useMemo((): BigNumber | null => {
    // Wait for both values to have been fetched before providing an update
    return antV2TotalSupply && antV2MigratorBalance
      ? antV2TotalSupply.sub(antV2MigratorBalance)
      : null
  }, [antV2TotalSupply, antV2MigratorBalance])

  const lpAllBalances = useMemo((): LpBalances | null => {
    const balances: [LpPool, PolledValue][] = [
      ['balancer', balancerPoolBalance],
      ['uniswap', uniswapPoolBalance],
      ['incentive', incentivePoolBalance],
    ]

    // To prevent value jumps within the UI we only want to
    // return the values after they have all been fetched
    const allBalancesFetched = balances.every((item) => Boolean(item[1]))

    return allBalancesFetched ? (balances as LpBalances) : null
  }, [balancerPoolBalance, uniswapPoolBalance, incentivePoolBalance])

  const lpAvailableBalances = useMemo((): LpBalances | null => {
    return (
      lpAllBalances &&
      lpAllBalances.filter(([, balance]) => balance && !balance.isZero())
    )
  }, [lpAllBalances])

  return {
    antV1: {
      balance: antV1Balance,
      // At the moment it doesn't make sense to request decimals via the contract
      // as we already know the value
      decimals: ANT_TOKEN_DECIMALS,
    },
    antV2: {
      balance: antV2Balance,
      decimals: ANT_TOKEN_DECIMALS,
    },
    lpBalances: {
      all: lpAllBalances,
      available: lpAvailableBalances,
      hasBalances: lpAvailableBalances && lpAvailableBalances.length > 0,
    },
    antTokenPriceUsd,
    antV2TotalSupply,
    antV2MigratedAmount,
  }
}

export { useAccountBalances, AccountBalancesProvider }
