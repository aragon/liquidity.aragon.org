import React from 'react'
import { keyframes } from 'styled-components'
// @ts-ignore
import { GU, useTheme, textStyle, Link } from '@aragon/ui'
import {
  getProviderFromUseWalletId,
  getProviderString,
} from './ethereum-providers'

import loadingRing from './assets/loading-ring.svg'
import { WalletConnector } from './types'
import { fontWeight } from '../../style/font'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

type ScreenConnectingProps = {
  onCancel: () => void
  providerId: WalletConnector | null
}

function ScreenConnecting({
  onCancel,
  providerId,
}: ScreenConnectingProps): JSX.Element {
  const theme = useTheme()
  const provider = providerId
    ? getProviderFromUseWalletId(providerId)
    : { id: undefined, image: '', name: '' }

  return (
    <section
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
      `}
    >
      <div
        css={`
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        `}
      >
        <div
          css={`
            position: relative;
            width: ${10.5 * GU}px;
            height: ${10.5 * GU}px;
          `}
        >
          <div
            css={`
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url(${loadingRing}) no-repeat 0 0;
              animation-duration: 1s;
              animation-iteration-count: infinite;
              animation-timing-function: linear;
              animation-name: ${spin};
              // prevents flickering on Firefox
              backface-visibility: hidden;
            `}
          />
          <div
            css={`
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: 50% 50% / auto ${5 * GU}px no-repeat
                url(${provider.image});
            `}
          />
        </div>
        <h1
          css={`
            padding-top: ${2 * GU}px;
            ${textStyle('body1')};
            font-weight: ${fontWeight.medium};
            margin-bottom: ${0.5 * GU}px;
          `}
        >
          Connecting to {provider.name}
        </h1>
        <p
          css={`
            width: ${36 * GU}px;
            color: ${theme.surfaceContentSecondary};
            line-height: 1.4;
            margin-bottom: ${1 * GU}px;
          `}
        >
          Log into {getProviderString('your Ethereum wallet', provider.id)}. You
          may be temporarily redirected to a new screen.
        </p>
      </div>
      <div
        css={`
          flex-grow: 0;
        `}
      >
        <Link onClick={onCancel}>Cancel</Link>
      </div>
    </section>
  )
}

export default ScreenConnecting
