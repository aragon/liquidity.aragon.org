import React, { ReactNode, useContext, useMemo } from 'react'
import { BigNumber } from 'ethers'
import { useWallet } from 'use-wallet'
import {
  LoadingStatus,
  usePoolRewardRate,
  usePoolStakedBalance,
  usePoolTokenBalance,
  usePoolTotalSupply,
  useRewardsBalance,
} from '../../hooks/usePolledBalance'
import { ContractGroup } from '../../environment/types'

const FORMATTED_DIGITS = 5

type PolledValueWithStatus = [BigNumber | null, LoadingStatus]

type BalancesContext = {
  accountBalanceInfo: PolledValueWithStatus | null
  stakedBalanceInfo: PolledValueWithStatus | null
  rewardsBalanceInfo: PolledValueWithStatus | null
  totalSupplyInfo: PolledValueWithStatus | null
  rewardRateInfo: PolledValueWithStatus | null
}

const AccountBalancesContext = React.createContext<BalancesContext>({
  accountBalanceInfo: null,
  stakedBalanceInfo: null,
  rewardsBalanceInfo: null,
  totalSupplyInfo: null,
  rewardRateInfo: null,
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
  const totalSupplyInfo = usePoolTotalSupply(contractGroup)
  const rewardRateInfo = usePoolRewardRate(contractGroup)

  const contextValue = useMemo(
    (): BalancesContext => ({
      accountBalanceInfo,
      stakedBalanceInfo,
      rewardsBalanceInfo,
      totalSupplyInfo,
      rewardRateInfo,
    }),
    [
      accountBalanceInfo,
      stakedBalanceInfo,
      rewardsBalanceInfo,
      totalSupplyInfo,
      rewardRateInfo,
    ]
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
  totalSupplyInfo: PolledValueWithStatus
  rewardRateInfo: PolledValueWithStatus
  formattedDigits: number
}

function usePoolBalance(): AccountBalances {
  const {
    accountBalanceInfo,
    stakedBalanceInfo,
    rewardsBalanceInfo,
    totalSupplyInfo,
    rewardRateInfo,
  } = useContext(AccountBalancesContext)

  return {
    accountBalanceInfo,
    stakedBalanceInfo,
    rewardsBalanceInfo,
    totalSupplyInfo,
    rewardRateInfo,
    formattedDigits: FORMATTED_DIGITS,
  } as AccountBalances
}

export { usePoolBalance, PoolBalanceProvider }
