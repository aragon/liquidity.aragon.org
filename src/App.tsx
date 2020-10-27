import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
// @ts-ignore
import { LayoutProvider } from '@aragon/ui'
// @ts-ignore
import { UseTokenProvider } from 'use-token'
import MainView from './components/MainView'
import Routes from './Routes'
import { breakpoints } from './style/breakpoints'
import { WalletProvider } from './providers/Wallet'
import { AccountModuleProvider } from './components/Account/AccountModuleProvider'

function App(): JSX.Element {
  return (
    <WalletProvider>
      <UseTokenProvider>
        <AccountModuleProvider>
          <LayoutProvider breakpoints={breakpoints}>
            <Router>
              <MainView>
                <Routes />
              </MainView>
            </Router>
          </LayoutProvider>
        </AccountModuleProvider>
      </UseTokenProvider>
    </WalletProvider>
  )
}

export default App
