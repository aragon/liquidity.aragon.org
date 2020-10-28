import React from 'react'
import { css, keyframes } from 'styled-components'
// @ts-ignore
import { GU } from '@aragon/ui'

type Sizes = 'small'

type SizeConfig = {
  dimension: number
  borderWidth: number
}

const sizes: Record<Sizes, SizeConfig> = {
  small: {
    dimension: 2.25 * GU,
    borderWidth: 2,
  },
}

type LoadingSpinnerProps = {
  size?: Sizes
}

const ringSpinAnimation = css`
  mask-image: linear-gradient(35deg, rgba(0, 0, 0, 0.1) 25%, rgba(0, 0, 0, 1));
  animation: ${keyframes`
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  `} 0.6s linear infinite;
`

function LoadingSpinner({
  size = 'small',
  ...props
}: LoadingSpinnerProps): JSX.Element {
  const { dimension, borderWidth } = sizes[size]

  return (
    <div
      css={`
        border-radius: 100%;
        width: ${dimension}px;
        height: ${dimension}px;
        color: inherit;
        border: ${borderWidth}px solid currentColor;

        ${ringSpinAnimation}
      `}
      {...props}
    />
  )
}

export default LoadingSpinner
