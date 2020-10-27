import React from 'react'
// @ts-ignore
import { useTheme } from '@aragon/ui'
import { radius } from '../../style/radius'
import { shadowDepth } from '../../style/shadow'

type AmountCardProps = {
  label?: string
  value?: string
}

function AmountCard({ label, value, ...props }: AmountCardProps): JSX.Element {
  const theme = useTheme()

  return (
    <div
      css={`
        background-color: ${theme.surface};
        padding: 30px;
        border-radius: ${radius.high};
        box-shadow: ${shadowDepth.medium};
      `}
      {...props}
    >
      <h3>{label}</h3>
      <span>{value}</span>
    </div>
  )
}

export default AmountCard
