import React from 'react'
// @ts-ignore
import { GU, useTheme, useLayout } from '@aragon/ui'
import TokenIcon from './TokenIcon'
import antV1 from '../../assets/token-ant-v1.svg'
import antV2 from '../../assets/token-ant-v2.svg'
import eth from '../../assets/token-eth.svg'
import usdc from '../../assets/token-usdc.svg'
import { PoolName } from '../Pool/PoolInfoProvider'

type PoolInfo = {
  title: string
  tokenPair: [string, string]
}

const POOL_INFO: Record<PoolName, PoolInfo> = {
  unipoolAntV2Eth: {
    title: 'Uniswap ANTv2 / ETH',
    tokenPair: [antV2, eth],
  },
  balancerAntV2Usdc: {
    title: 'Balancer ANTv2 / USDC',
    tokenPair: [antV2, usdc],
  },
  unipoolAntV1Eth: {
    title: 'Uniswap ANT / ETH',
    tokenPair: [antV1, eth],
  },
}

function PoolTitle({
  name,
  size,
}: {
  name: PoolName
  size?: number
}): JSX.Element {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const { title, tokenPair } = POOL_INFO[name]
  const [firstTokenLogo, secondTokenLogo] = tokenPair

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        padding: ${0.5 * GU}px 0;
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
            padding: ${0.5 * GU}px;
          `}
        >
          <TokenIcon
            logo={firstTokenLogo}
            size={size}
            css={`
              z-index: 1;
            `}
          />
          <TokenIcon
            logo={secondTokenLogo}
            size={size}
            css={`
              margin-left: -${1 * GU}px;
            `}
          />
        </div>
        <h2
          css={`
            margin-left: ${compactMode ? 0 : 2 * GU}px;
            margin-top: ${compactMode ? 1.5 * GU : 0}px;
            font-size: ${3 * GU}px;
            color: ${theme.content};
          `}
        >
          {title}
        </h2>
      </div>
    </div>
  )
}

export default PoolTitle
