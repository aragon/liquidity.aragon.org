import React, {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type AccountContext = {
  accountVisible: boolean
  showAccount: () => void
  hideAccount: () => void
}

const AccountModuleContext = React.createContext<AccountContext | null>(null)

function AccountModuleProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const [accountVisible, setAccountVisible] = useState(false)

  const showAccount = useCallback(() => setAccountVisible(true), [])
  const hideAccount = useCallback(() => setAccountVisible(false), [])

  const contextValue = useMemo(
    (): AccountContext => ({
      accountVisible,
      showAccount,
      hideAccount,
    }),

    [accountVisible, showAccount, hideAccount]
  )

  return (
    <AccountModuleContext.Provider value={contextValue}>
      {children}
    </AccountModuleContext.Provider>
  )
}

function useAccountModule(): AccountContext {
  return useContext(AccountModuleContext) as AccountContext
}

export { useAccountModule, AccountModuleProvider }
