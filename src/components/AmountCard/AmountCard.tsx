import React from 'react'

type AmountCardProps = {
  label?: string
  value?: string
}

function AmountCard({ label, value }: AmountCardProps): JSX.Element {
  return (
    <div
      css={`
        background-color: red;
      `}
    >
      <h3>{label}</h3>
      <span>{value}</span>
    </div>
  )
}

export default AmountCard
