import React from 'react'
import { css, keyframes } from 'styled-components'
// @ts-ignore
import { useTheme } from '@aragon/ui'
import { radius } from '../../style/radius'

const shimmerAnimation = css`
  background-size: 400% 400%;
  animation: ${keyframes`
  from {
    background-position: 100% 50%;
  }
  to {
    background-position: 0% 50%;
  }
  `} 1s linear infinite;
`

function LoadingSkeleton({
  ...props
}: React.HTMLAttributes<HTMLElement>): JSX.Element {
  const theme = useTheme()

  return (
    <span
      css={`
        display: block;
        border-radius: ${radius.medium};
        background: linear-gradient(
          -45deg,
          ${theme.surfaceUnder},
          ${theme.border},
          ${theme.surfaceUnder},
          ${theme.border}
        );
        ${shimmerAnimation}
      `}
      {...props}
    >
      &nbsp;
    </span>
  )
}

export default LoadingSkeleton
