import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useWallet } from '../../providers/Wallet'
// @ts-ignore
import { IconConnect, useViewport, GU } from '@aragon/ui'
import AccountButton from './AccountButton'
import BrandButton from '../BrandButton/BrandButton'
import ScreenConnected from './ScreenConnected'
import ScreenConnecting from './ScreenConnecting'
import ScreenError from './ScreenError'
import ScreenProviders from './ScreenProviders'
import { ScreenConfig, WalletConnector } from './types'
import AccountModal from './AccountModal'
import { useAccountModule } from './AccountModuleProvider'
import { trackEvent } from '../../analytics'

const SCREENS: ScreenConfig[] = [
  { id: 'providers', title: 'Use account from' },
  { id: 'connecting', title: 'Use account from' },
  { id: 'connected', title: 'Active account' },
  { id: 'error', title: 'Connection error' },
]

function AccountModule(): JSX.Element {
  const wallet = useWallet()
  const { account, connector, error, status } = wallet
  const { accountVisible, showAccount, hideAccount } = useAccountModule()
  const [
    activatingDelayed,
    setActivatingDelayed,
  ] = useState<WalletConnector | null>(null)
  const buttonRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const { below } = useViewport()
  const compactMode = below('medium')

  const toggle = useCallback(
    () => (accountVisible ? hideAccount() : showAccount()),
    [accountVisible, showAccount, hideAccount]
  )

  useEffect(() => {
    let autocloseTimer: number

    if (status === 'error') {
      setActivatingDelayed(null)
    }

    if (status === 'connecting') {
      setActivatingDelayed(connector)
    }

    if (status === 'connected') {
      autocloseTimer = setTimeout(hideAccount, 500)
    }

    return () => clearTimeout(autocloseTimer)
  }, [connector, status, hideAccount])

  const handleResetConnection = useCallback(() => {
    wallet.reset()
  }, [wallet])

  const handleActivate = useCallback(
    async (providerId: WalletConnector) => {
      // This will just return a promises that resolves.
      // We should update use-wallet to return a boolean on
      // whether this was successful so we don't have to wait
      // until a next render to figure out the status.
      await wallet.connect(providerId)

      trackEvent('web3_connect', {
        segmentation: {
          provider: providerId,
        },
      })
    },
    [wallet]
  )

  const previousScreenIndex = useRef(-1)

  const { screenIndex, direction } = useMemo((): {
    direction: -1 | 1
    screenIndex: number
  } => {
    const screenId = status === 'disconnected' ? 'providers' : status

    const screenIndex = SCREENS.findIndex((screen) => screen.id === screenId)
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1

    previousScreenIndex.current = screenIndex

    return { direction, screenIndex }
  }, [status])

  const screen = SCREENS[screenIndex]
  const screenId = screen.id

  return (
    <div
      ref={buttonRef}
      css={`
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 100%;
        width: ${compactMode ? 'auto' : `${24.5 * GU}px`};
        outline: 0;
      `}
    >
      {screen.id === 'connected' ? (
        <AccountButton onClick={toggle} />
      ) : (
        <BrandButton
          icon={<IconConnect />}
          label="Connect wallet"
          onClick={toggle}
          display={compactMode ? 'icon' : 'all'}
        />
      )}

      <AccountModal
        direction={direction}
        heading={screen.title}
        onClose={hideAccount}
        screenId={screenId}
        screenData={{
          account,
          activating: activatingDelayed,
          activationError: error,
          status,
          screenId,
        }}
        visible={accountVisible}
      >
        {({ activating, activationError, screenId }) => {
          if (screenId === 'connecting') {
            return (
              <ScreenConnecting
                providerId={activating}
                onCancel={handleResetConnection}
              />
            )
          }
          if (screenId === 'connected') {
            return <ScreenConnected />
          }
          if (screenId === 'error') {
            return (
              <ScreenError
                error={activationError}
                onBack={handleResetConnection}
              />
            )
          }
          return <ScreenProviders onActivate={handleActivate} />
        }}
      </AccountModal>
    </div>
  )
}

export default AccountModule
