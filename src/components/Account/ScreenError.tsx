import React, { useMemo, useRef } from 'react'
// @ts-ignore
import { GU, Link, textStyle, useTheme } from '@aragon/ui'
import { ChainUnsupportedError } from 'use-wallet'
import { getNetworkName } from '../../lib/web3-utils'
import { networkEnvironment } from '../../environment'
import connectionError from './assets/connection-error.png'
import { WalletError } from './types'
import { fontWeight } from '../../style/font'

type ScreenErrorProps = {
  error: WalletError
  onBack: () => void
}

function ScreenError({ error, onBack }: ScreenErrorProps): JSX.Element {
  const theme = useTheme()
  const elementRef = useRef<HTMLElement | null>(null)

  const [title, secondary] = useMemo(() => {
    const networkName = getNetworkName(networkEnvironment.chainId)

    if (error instanceof ChainUnsupportedError) {
      return [
        'Wrong network',
        `Please select the ${networkName} network in your wallet and try again.`,
      ]
    }
    return [
      'Failed to enable your account',
      'You can try another Ethereum wallet.',
    ]
  }, [error])

  return (
    <section
      ref={elementRef}
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: -${2 * GU}px;
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
            width: 281px;
            height: 188px;
            background: 50% 50% / 100% 100% no-repeat url(${connectionError});
          `}
        />
        <h1
          css={`
            padding-top: ${2 * GU}px;
            ${textStyle('body1')};
            font-weight: ${fontWeight.medium};
            margin-bottom: ${0.5 * GU}px;
          `}
        >
          {title}
        </h1>
        <p
          css={`
            width: ${36 * GU}px;
            color: ${theme.surfaceContentSecondary};
            line-height: 1.4;
            margin-bottom: ${1 * GU}px;
          `}
        >
          {secondary}
        </p>
      </div>
      <div
        css={`
          flex-grow: 0;
        `}
      >
        <Link onClick={onBack}>OK, try again</Link>
      </div>
    </section>
  )
}

export default ScreenError
