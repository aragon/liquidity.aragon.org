import React from 'react'
import AmountCard from '../../AmountCard/AmountCard'
import AmountInput from '../../AmountInput/AmountInput'
import BrandButton from '../../BrandButton/BrandButton'
import { usePoolInfo } from '../PoolInfoProvider'

function Stake(): JSX.Element {
  const { rewardToken } = usePoolInfo()

  return (
    <>
      <AmountInput />
      <AmountCard
        label="Your estimated rewards"
        value="Testing"
        tokenGraphic={rewardToken.graphic}
        suffix={`${rewardToken.symbol} / week`}
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
