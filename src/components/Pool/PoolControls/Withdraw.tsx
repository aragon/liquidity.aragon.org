import React from 'react'
import AmountCard from '../../AmountCard/AmountCard'
import AmountInput from '../../AmountInput/AmountInput'
import BrandButton from '../../BrandButton/BrandButton'

function Withdraw(): JSX.Element {
  return (
    <>
      <AmountInput />
      <AmountCard
        label="Amount available to withdraw"
        value="Testing"
        css={`
          margin-top: 40px;
          margin-bottom: 40px;
        `}
      />
      <BrandButton wide mode="strong" size="large">
        Withdraw
      </BrandButton>
    </>
  )
}

export default Withdraw
