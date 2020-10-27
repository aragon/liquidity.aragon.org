import React from 'react'
import { GU, useTheme, useImageExists } from '@aragon/ui'

function TokenIcon({ logo, size = 4.5 * GU, ...props }) {
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
        box-shadow: 0px 5px 10px rgba(26, 66, 75, 0.12),
          0px 15px 50px rgba(26, 66, 75, 0.08);
      `}
      {...props}
    >
      <TokenGraphic logo={logo} />
    </div>
  )
}

function TokenGraphic({ logo }) {
  return logo ? <img alt="" width="100%" src={logo} /> : <TokenPlaceholder />
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
