import React, { ReactNode, useMemo } from 'react'
import {
  GU,
  Link,
  useTheme,
  useLayout,
} from '@aragon/ui'
import TokenAmount from 'token-amount'
import TokenIcon from './TokenIcon'
import antV1 from '../assets/ANTv1.svg'
import antV2 from '../assets/ANTv2.svg'
import eth from '../assets/ETH.svg'
import usdc from '../assets/USDC.svg'

 // TODO: update pool links
const POOL_INFO = {
  uniswapV2: {
    title: 'Uniswap ANT / ETH',
    tokenPair: [antV2, eth],
    link: '',
  },
  balancer: {
    title: 'Balancer ANT / USDC',
    tokenPair: [antV2, usdc],
    link: '',
  },
  uniswapV1: {
    title: 'Uniswap ANT / ETH',
    tokenPair: [antV1, eth],
    link: '',
  },
}

function LiquidityPoolName({
  liquidityPool,
  size = 4.5 * GU
}) {
  const theme = useTheme()
  const { title, tokenPair, link } = POOL_INFO[liquidityPool]
  const [firstTokenLogo, secondTokenLogo] = tokenPair

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        padding: ${0.5 * GU}px 0;
      `}
    >
      <Link
        href={link}
        css={`
          display: flex;
          align-items: center;
          text-decoration: none;
          white-space: initial;
          text-align: left;
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
        <span
          css={`
            margin-left: ${2 * GU}px;
            font-size: ${3 * GU}px;
          `}
        >
          {title} Pool
        </span>
      </Link>
    </div>
  )
}

export default LiquidityPoolName
