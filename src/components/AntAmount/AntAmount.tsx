import React from 'react'
import {
  useTheme,
  GU,
  // @ts-ignore
} from '@aragon/ui'

type AntAmountProps = {
  amount: string
  version: 'v1' | 'v2'
}

function AntAmount({ amount, version, ...props }: AntAmountProps): JSX.Element {
  const theme = useTheme()

  return (
    <span
      css={`
        letter-spacing: -0.02em;
        font-variant-numeric: tabular-nums;
      `}
      {...props}
    >
      <span
        css={`
          color: ${amount === '0'
            ? theme.contentSecondary
            : theme.surfaceContent};
        `}
      >
        {amount}
      </span>
      <span
        css={`
          color: ${theme.contentSecondary};
          margin-left: ${0.75 * GU}px;
        `}
      >
        ANT{version}
      </span>
    </span>
  )
}

export default AntAmount
