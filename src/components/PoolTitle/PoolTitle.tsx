import React from 'react'
// @ts-ignore
import { GU, useTheme, useLayout } from '@aragon/ui'
import TokenIcon from '../TokenIcon/TokenIcon'
import antV1 from '../../assets/token-ant-v1.svg'
import antV2 from '../../assets/token-ant-v2.svg'
import eth from '../../assets/token-eth.svg'
import usdc from '../../assets/token-usdc.svg'
import { PoolName } from '../../known-liquidity-pools'

type PoolInfo = {
  title: string
  endDate?: string
  tokenPair: [string, string]
}

const POOL_INFO: Record<PoolName, PoolInfo> = {
  unipoolAntV2Eth: {
    title: 'Uniswap ANTv2 / ETH',
    endDate: 'Ends November 12th, 15:00 UTC',
    tokenPair: [antV2, eth],
  },
  balancerAntV2Usdc: {
    title: 'Balancer ANTv2 / USDC',
    endDate: 'Ends November 12th, 15:00 UTC',
    tokenPair: [antV2, usdc],
  },
  unipoolAntV1Eth: {
    title: 'Uniswap ANT / ETH',
    tokenPair: [antV1, eth],
  },
}

type PoolTitleProps = {
  title: string
  endDate?: string
  name: PoolName
  tokenSize?: number
}

function PoolTitle({
  title,
  endDate,
  name,
  tokenSize,
}: PoolTitleProps): JSX.Element {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const { tokenPair } = POOL_INFO[name]
  const [firstTokenLogo, secondTokenLogo] = tokenPair

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: ${compactMode ? 'center' : 'inherit'};
      `}
    >
      <div
        css={`
          display: flex;
          flex-direction: ${compactMode ? 'column' : 'row'};
          align-items: center;
          text-decoration: none;
          white-space: initial;
          text-align: ${compactMode ? 'center' : 'left'};
        `}
      >
        <div
          css={`
            display: flex;
            flex-shrink: 0;
          `}
        >
          <TokenIcon
            logo={firstTokenLogo}
            size={tokenSize}
            css={`
              z-index: 1;
            `}
          />
          <TokenIcon
            logo={secondTokenLogo}
            size={tokenSize}
            css={`
              margin-left: -${1 * GU}px;
            `}
          />
        </div>
        <div
          css={`
            margin-top: ${compactMode ? 1.5 * GU : 0}px;
            margin-left: ${compactMode ? 0 : 2 * GU}px;
          `}
        >
          <h2
            css={`
              font-size: ${3 * GU}px;
              color: ${theme.content};
              line-height: 1.2;
            `}
          >
            {title}
          </h2>
          {endDate && (
            <p
              css={`
                font-size: 14px;
                color: ${theme.surfaceContentSecondary};
                margin-top: ${0.25 * GU}px;
              `}
            >
              Ends {endDate}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PoolTitle
