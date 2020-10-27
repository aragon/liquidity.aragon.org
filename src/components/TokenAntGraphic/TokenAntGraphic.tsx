import React from 'react'
import { rgba } from 'polished'
// @ts-ignore
import { useTheme } from '@aragon/ui'
import v1TokenSvg from '../../assets/aragon-v1-token.svg'
import v2TokenSvg from '../../assets/aragon-v2-token.svg'

type TokenAntGraphicProps = {
  type: 'v1' | 'v2'
  shadow?: boolean
  size?: number
}

const TOKEN_GRAPHIC = {
  v1: v1TokenSvg,
  v2: v2TokenSvg,
}

const shadowTint = '#3f899b'

function TokenAntGraphic({
  type,
  shadow,
  size = 100,
  ...props
}: TokenAntGraphicProps): JSX.Element {
  const theme = useTheme()

  const tokenGraphic = TOKEN_GRAPHIC[type]

  return (
    <div
      css={`
        position: relative;
        width: ${size}px;
        height: ${size}px;
        background-color: ${theme.background};
        border-radius: 100%;
        overflow: hidden;

        box-shadow: ${shadow
          ? `0px 5px 10px ${rgba(shadowTint, 0.2)}, 2px 12px 20px ${rgba(
              shadowTint,
              0.4
            )}`
          : ''};
      `}
      {...props}
    >
      <img
        alt=""
        src={tokenGraphic}
        css={`
          display: block;
          width: 100%;
        `}
      />
    </div>
  )
}

export default TokenAntGraphic
