import React from 'react'
import AmountCard from '../../AmountCard/AmountCard'
import BrandButton from '../../BrandButton/BrandButton'

function Claim(): JSX.Element {
  return (
    <>
      <AmountCard
        label="Rewards available to withdraw"
        value="Testing"
        css={`
          margin-top: 40px;
          margin-bottom: 40px;
        `}
      />
      <BrandButton wide mode="strong" size="large">
        Claim rewards
      </BrandButton>
    </>
  )
}

export default Claim
