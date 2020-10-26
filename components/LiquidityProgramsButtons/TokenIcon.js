import React from 'react'
import {
  GU,
  useTheme,
  useImageExists,
} from '@aragon/ui'
import { useToken } from 'use-token'

//TODO: Update chain id
const chainId  = 1


function TokenIcon({
  address,
  size = 3 * GU,
  ...props
}) {
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
        box-shadow: 0px 5px 10px rgba(26,	66,	75, 0.12), 0px 15px 50px rgba(26,	66,	75, 0.08);
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

function TokenGraphic({ address }){
  const { iconUrl } = useToken(address)

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
