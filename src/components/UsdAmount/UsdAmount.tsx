import React from 'react'

type UsdAmountProps = {
  amount: string
}

function UsdAmount({ amount, ...props }: UsdAmountProps): JSX.Element {
  return (
    <span
      css={`
        font-variant-numeric: tabular-nums;
      `}
      {...props}
    >
      ${amount}
    </span>
  )
}

export default UsdAmount
