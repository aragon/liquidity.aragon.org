import React from 'react'
import AmountCard from '../../AmountCard/AmountCard'
import AmountInput from '../../AmountInput/AmountInput'
import BrandButton from '../../BrandButton/BrandButton'

function Stake(): JSX.Element {
  return (
    <>
      <AmountInput />
      <AmountCard
        label="Your estimated rewards"
        value="Testing"
        css={`
          margin-top: 40px;
          margin-bottom: 40px;
        `}
      />
      <BrandButton wide mode="strong" size="large">
        Stake
      </BrandButton>
    </>
  )
}

export default Stake
