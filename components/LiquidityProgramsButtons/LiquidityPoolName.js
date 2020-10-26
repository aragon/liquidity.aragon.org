import React, { ReactNode, useMemo } from 'react'
import {
  GU,
  Link,
  useTheme,
  useLayout,
} from '@aragon/ui'
import TokenAmount from 'token-amount'
import TokenIcon from './TokenIcon'

const KNOWN_TOKENS = new Map([
  ['ANTv1', '0x960b236A07cf122663c4303350609A66A7B288C0'],
  ['ANTv2', '0x960b236A07cf122663c4303350609A66A7B288C0'],
  ['ETH', '0x0000000000000000000000000000000000000000'],
  ['UNI', '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'],
])

const POOL_INFO = {
  uniswapV2: {
    title: 'Uniswap ANT / UNI',
    tokenPair: getTokenPair('ANTv2', 'UNI'),
  },
  balancer: {
    title: 'Balancer ANT / ETH',
    tokenPair: getTokenPair('ANTv2', 'ETH'),
  },
  uniswapV1: {
    title: 'Aragon Rewards ANT / ETH',
    tokenPair: getTokenPair('ANTv1', 'ETH'),
  },
}

function getTokenPair(firstSymbol, secondSymbol) {
  return [
    KNOWN_TOKENS.get(firstSymbol) ?? '',
    KNOWN_TOKENS.get(secondSymbol) ?? '',
  ]
}

function LiquidityPoolName({
  liquidityPool
}) {
  const theme = useTheme()
  const { title, tokenPair } = POOL_INFO[liquidityPool]
  const [firstTokenAddress, secondTokenAddress] = tokenPair
  const url = ''
  

  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <Link
        href={url}
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
            background-color: ${theme.surface};
            border-radius: ${100 * GU}px;
            box-shadow: 0px 4px 6px rgba(109, 118, 147, 0.12);
          `}
        >
        <TokenIcon
          address={firstTokenAddress}
          css={`
            z-index: 1;
          `}
        />
        <TokenIcon
          address={secondTokenAddress}
          css={`
            margin-left: -${1 * GU}px;
          `}
        />
        </div>
        <span
          css={`
            margin-left: ${2 * GU}px;
          `}
        >
          {title} Pool
        </span>
      </Link>
    </div>
  )
}

export default LiquidityPoolName
