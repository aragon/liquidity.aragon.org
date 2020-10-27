import React from 'react'
import {
  GU,
  useTheme,
  useImageExists,
  // @ts-ignore
} from '@aragon/ui'
// @ts-ignore
import { useToken } from 'use-token'
import { networkEnvironment } from '../../../environment'
import { shadowDepth } from '../../../style/shadow'

const { chainId } = networkEnvironment

type TokenSymbolProps = {
  address: string
  size?: number
}

function TokenIcon({
  address,
  size = 3 * GU,
  ...props
}: TokenSymbolProps): JSX.Element {
  const theme = useTheme()
  return (
    <div
      css={`
        display: flex;
        width: ${size}px;
        height: ${size}px;
        border-radius: 100%;
        overflow: hidden;
        background-color: ${theme.surface};
        box-shadow: ${shadowDepth.high};
      `}
      {...props}
    >
      {chainId === 1 ? (
        <TokenGraphic address={address} />
      ) : (
        <TokenPlaceholder />
      )}
    </div>
  )
}

function TokenGraphic({ address }: { address: string }): JSX.Element {
  const { iconUrl } = useToken(address) as {
    iconUrl: string
    symbol: string
    name: string
  }

  const { exists } = useImageExists(iconUrl)

  return exists ? (
    <img alt="" width="100%" src={iconUrl} />
  ) : (
    <TokenPlaceholder />
  )
}

function TokenPlaceholder() {
  const theme = useTheme()
  return (
    <div
      css={`
        flex: 1;
        border-radius: 100%;
        border: 2px solid ${theme.border};
      `}
    />
  )
}

export default TokenIcon
