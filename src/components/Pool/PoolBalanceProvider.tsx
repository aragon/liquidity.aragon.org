import React, { ReactNode, useContext, useMemo } from 'react'
import { BigNumber } from 'ethers'
import { useWallet } from 'use-wallet'
import { usePoolTokenBalance } from '../../hooks/usePolledBalance'
import { ContractGroup } from '../../environment/types'

const TOKEN_DECIMALS = 18

type PolledValue = BigNumber | null

type BalancesContext = {
  accountBalance: PolledValue
}

const AccountBalancesContext = React.createContext<BalancesContext>({
  accountBalance: null,
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

  const accountBalance = usePoolTokenBalance(contractGroup, account)

  console.log(accountBalance?.toString())

  const contextValue = useMemo(
    (): BalancesContext => ({
      accountBalance,
    }),
    [accountBalance]
  )

  return (
    <AccountBalancesContext.Provider value={contextValue}>
      {children}
    </AccountBalancesContext.Provider>
  )
}

type AccountBalances = {
  accountBalance: PolledValue
  tokenDecimals: number
}

function usePoolBalance(): AccountBalances {
  const { accountBalance } = useContext(AccountBalancesContext)

  return {
    accountBalance,
    tokenDecimals: TOKEN_DECIMALS,
  }
}

export { usePoolBalance, PoolBalanceProvider }
