import React, { useMemo } from 'react'
import { css } from 'styled-components'
import {
  useTheme,
  useLayout,
  GU,
  // @ts-ignore
} from '@aragon/ui'
// @ts-ignore
import TokenAmount from 'token-amount'
import { fontWeight } from '../../../style/font'
import { TokenConversionType } from '../types'
import { useMigrateState } from '../MigrateStateProvider'
import { shadowDepth } from '../../../style/shadow'
import { useAccountBalances } from '../../../providers/AccountBalances'
import ConverterFormControls from './ConverterFormControls'
import { radius } from '../../../style/radius'
import ConversionRate from './ConversionRate'
import PageHeading from '../../PageHeading/PageHeading'

const TOKEN_SYMBOL: Record<TokenConversionType, string> = {
  ANT: 'ANT',
}

const multiColumnLayout = css`
  grid-template-columns: 55% auto;
  grid-template-rows: auto auto;
  grid-template-areas:
    'title rate'
    'inputs rate';
`

const stackedLayout = css`
  grid-template-rows: auto auto auto;
  grid-template-areas:
    'title'
    'rate'
    'inputs';
`

function ConverterForm(): JSX.Element {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const { conversionType } = useMigrateState()
  const { antV1 } = useAccountBalances()
  const { balance, decimals } = antV1

  const compactMode = layoutName === 'small' || layoutName === 'medium'
  const tokenSymbol = TOKEN_SYMBOL[conversionType]

  const formattedAntV1Balance = useMemo(
    () =>
      balance &&
      new TokenAmount(balance, decimals).format({
        digits: decimals,
      }),
    [balance, decimals]
  )

  return (
    <>
      <PageHeading
        title="Aragon Upgrade"
        description="How much ANTv1 would you like to upgrade?"
        css={`
          margin-bottom: ${7 * GU}px;
        `}
      />
      <div
        css={`
          padding: ${compactMode ? 4 * GU : 6 * GU}px;
          background-color: ${theme.surface};
          box-shadow: ${shadowDepth.high};
          border-radius: ${radius.high};
          display: grid;
          grid-gap: ${4 * GU}px;
          ${compactMode ? stackedLayout : multiColumnLayout}
        `}
      >
        <div
          css={`
            grid-area: title;
            text-align: ${compactMode ? 'center' : 'left'};
          `}
        >
          <h2
            css={`
              line-height: 1;
              font-weight: ${fontWeight.medium};
              font-size: 32px;
              margin-bottom: ${1.5 * GU}px;
            `}
          >
            Upgrade {tokenSymbol}v1
          </h2>
          <p
            css={`
              color: ${theme.surfaceContentSecondary};
            `}
          >
            {formattedAntV1Balance ? (
              <>
                Balance:{' '}
                <span
                  css={`
                    word-break: break-all;
                  `}
                >
                  {formattedAntV1Balance}
                </span>{' '}
                {tokenSymbol}v1
              </>
            ) : (
              'Connect your wallet to see your balance'
            )}
          </p>
        </div>
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: center;
            grid-area: rate;
            padding: ${2 * GU}px;
          `}
        >
          <ConversionRate compactMode={compactMode} />
        </div>
        <div
          css={`
            grid-area: inputs;
          `}
        >
          <ConverterFormControls tokenSymbol={tokenSymbol} />
        </div>
      </div>
    </>
  )
}

export default ConverterForm
