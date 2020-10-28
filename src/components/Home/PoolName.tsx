import React from 'react'
// @ts-ignore
import { GU, useTheme, useLayout } from '@aragon/ui'
import TokenIcon from './TokenIcon'
import antV1 from '../../assets/token-ant-v1.svg'
import antV2 from '../../assets/token-ant-v2.svg'
import eth from '../../assets/token-eth.svg'
import usdc from '../../assets/token-usdc.svg'

type PoolInfo = {
  title: string
  tokenPair: [string, string]
}
type PoolNameProps = 'uniswapV2' | 'balancer' | 'uniswapV1'

const POOL_INFO: Record<PoolNameProps, PoolInfo> = {
  uniswapV2: {
    title: 'Uniswap ANTv2 / ETH',
    tokenPair: [antV2, eth],
  },
  balancer: {
    title: 'Balancer ANTv2 / USDC',
    tokenPair: [antV2, usdc],
  },
  uniswapV1: {
    title: 'Uniswap ANT / ETH',
    tokenPair: [antV1, eth],
  },
}

function PoolName({ name }: { name: PoolNameProps }): JSX.Element {
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
            css={`
              z-index: 1;
            `}
          />
          <TokenIcon
            logo={secondTokenLogo}
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

export default PoolName
