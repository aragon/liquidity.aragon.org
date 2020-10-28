import React, { ReactNode, useContext, useMemo } from 'react'
import { BigNumber } from 'ethers'
import { useWallet } from 'use-wallet'
import {
  LoadingStatus,
  usePoolStakedBalance,
  usePoolTokenBalance,
} from '../../hooks/usePolledBalance'
import { ContractGroup } from '../../environment/types'

const TOKEN_DECIMALS = 18

// type PolledValue = BigNumber | null
type PolledValueWithStatus = [BigNumber | null, LoadingStatus]

type BalancesContext = {
  accountBalanceInfo: PolledValueWithStatus | null
  stakedBalanceInfo: PolledValueWithStatus | null
}

const AccountBalancesContext = React.createContext<BalancesContext>({
  accountBalanceInfo: null,
  stakedBalanceInfo: null,
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

  const contextValue = useMemo(
    (): BalancesContext => ({
      accountBalanceInfo,
      stakedBalanceInfo,
    }),
    [accountBalanceInfo, stakedBalanceInfo]
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
  tokenDecimals: number
}

function usePoolBalance(): AccountBalances {
  const { accountBalanceInfo, stakedBalanceInfo } = useContext(
    AccountBalancesContext
  )

  return {
    accountBalanceInfo,
    stakedBalanceInfo,
    tokenDecimals: TOKEN_DECIMALS,
  } as AccountBalances
}

export { usePoolBalance, PoolBalanceProvider }
