import React, { useCallback } from 'react'
// @ts-ignore
import { ButtonBase, GU, Link, useTheme, textStyle } from '@aragon/ui'
import {
  getProviderFromUseWalletId,
  getUseWalletProviders,
} from './ethereum-providers'
import { ProviderConfig, WalletConnector } from './types'
import { shadowDepth } from '../../style/shadow'
import { radius } from '../../style/radius'
import { fontWeight } from '../../style/font'

const PROVIDERS_INFO: [
  WalletConnector,
  ProviderConfig
][] = getUseWalletProviders().map((provider) => [
  provider.id,
  getProviderFromUseWalletId(provider.id),
])

type ScreenProvidersProps = {
  onActivate: (providerId: WalletConnector) => Promise<void>
}

function ScreenProviders({ onActivate }: ScreenProvidersProps): JSX.Element {
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
      `}
    >
      <div
        css={`
          display: grid;
          grid-gap: ${1.5 * GU}px;
          grid-auto-flow: row;
        `}
      >
        {PROVIDERS_INFO.map(([id, provider]) => (
          <ProviderButton
            key={id}
            id={id}
            provider={provider}
            onActivate={onActivate}
          />
        ))}
      </div>
      <div
        css={`
          display: flex;
          justify-content: center;
          margin-top: ${3.5 * GU}px;
        `}
      >
        <Link
          href="https://ethereum.org/wallets/"
          css={`
            text-decoration: none;
            line-height: 1;
          `}
        >
          What is an Ethereum provider?
        </Link>
      </div>
    </div>
  )
}

type ProviderButtonProps = {
  id: WalletConnector
  provider: ProviderConfig
  onActivate: ScreenProvidersProps['onActivate']
}

function ProviderButton({ id, provider, onActivate }: ProviderButtonProps) {
  const theme = useTheme()

  const handleClick = useCallback(() => {
    onActivate(id)
  }, [onActivate, id])

  return (
    <ButtonBase
      key={id}
      onClick={handleClick}
      css={`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: ${2.5 * GU}px;
        background-color: ${theme.surface};
        box-shadow: ${shadowDepth.low};
        border-radius: ${radius.medium};

        &:active {
          top: 1px;
          box-shadow: ${shadowDepth.extraLow};
        }
      `}
    >
      <img
        src={provider.image}
        alt=""
        css={`
          height: ${3.5 * GU}px;
        `}
      />
      <div
        css={`
          margin-left: ${1.5 * GU}px;
          ${textStyle('body1')};
          font-weight: ${fontWeight.medium};
          line-height: 1;
        `}
      >
        {provider.name}
      </div>
    </ButtonBase>
  )
}

export default ScreenProviders
