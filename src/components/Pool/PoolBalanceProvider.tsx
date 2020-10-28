import React, { ReactNode, useContext, useMemo } from 'react'
import { BigNumber } from 'ethers'
import { useWallet } from 'use-wallet'
import {
  LoadingStatus,
  usePoolStakedBalance,
  usePoolTokenBalance,
  useRewardsBalance,
} from '../../hooks/usePolledBalance'
import { ContractGroup } from '../../environment/types'

const TOKEN_DECIMALS = 18

// type PolledValue = BigNumber | null
type PolledValueWithStatus = [BigNumber | null, LoadingStatus]

type BalancesContext = {
  accountBalanceInfo: PolledValueWithStatus | null
  stakedBalanceInfo: PolledValueWithStatus | null
  rewardsBalanceInfo: PolledValueWithStatus | null
}

const AccountBalancesContext = React.createContext<BalancesContext>({
  accountBalanceInfo: null,
  stakedBalanceInfo: null,
  rewardsBalanceInfo: null,
})

type PoolBalanceProps = {
  children: ReactNode
  contractGroup: ContractGroup
}

function PoolBalanceProvider({
  children,
  contractGroup,
}: PoolBalanceProps): JSX.Element {
  const { account } = useWallet()

  const accountBalanceInfo = usePoolTokenBalance(contractGroup, account)
  const stakedBalanceInfo = usePoolStakedBalance(contractGroup, account)
  const rewardsBalanceInfo = useRewardsBalance(contractGroup, account)

  const contextValue = useMemo(
    (): BalancesContext => ({
      accountBalanceInfo,
      stakedBalanceInfo,
      rewardsBalanceInfo,
    }),
    [accountBalanceInfo, stakedBalanceInfo, rewardsBalanceInfo]
  )

  return (
    <AccountBalancesContext.Provider value={contextValue}>
      {children}
    </AccountBalancesContext.Provider>
  )
}

type AccountBalances = {
  accountBalanceInfo: PolledValueWithStatus
  stakedBalanceInfo: PolledValueWithStatus
  rewardsBalanceInfo: PolledValueWithStatus
  tokenDecimals: number
}

function usePoolBalance(): AccountBalances {
  const {
    accountBalanceInfo,
    stakedBalanceInfo,
    rewardsBalanceInfo,
  } = useContext(AccountBalancesContext)

  return {
    accountBalanceInfo,
    stakedBalanceInfo,
    rewardsBalanceInfo,
    tokenDecimals: TOKEN_DECIMALS,
  } as AccountBalances
}

export { usePoolBalance, PoolBalanceProvider }
