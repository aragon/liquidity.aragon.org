import React, { useMemo } from 'react'
// @ts-ignore
import TokenAmount from 'token-amount'
import { useClaimRewards } from '../../../hooks/useContract'
import AmountCard from '../../AmountCard/AmountCard'
import BrandButton from '../../BrandButton/BrandButton'
import { usePoolBalance } from '../PoolBalanceProvider'
import { usePoolInfo } from '../PoolInfoProvider'

function Claim(): JSX.Element {
  const { rewardToken, contractGroup } = usePoolInfo()
  const {
    rewardsBalanceInfo: [rewardsBalance, rewardsBalanceStatus],
    tokenDecimals,
  } = usePoolBalance()

  const handleClaim = useClaimRewards(contractGroup)

  const formattedRewardsBalance = useMemo(
    (): string | null =>
      rewardsBalance &&
      new TokenAmount(rewardsBalance, tokenDecimals).format({
        digits: tokenDecimals,
      }),
    [rewardsBalance, tokenDecimals]
  )

  return (
    <>
      <AmountCard
        label="Rewards available to withdraw"
        tokenGraphic={rewardToken.graphic}
        suffix={rewardToken.symbol}
        value={formattedRewardsBalance ? formattedRewardsBalance : '0'}
        loading={rewardsBalanceStatus === 'loading'}
        css={`
          margin-top: 40px;
          margin-bottom: 40px;
        `}
      />
      <BrandButton wide mode="strong" size="large" onClick={handleClaim}>
        Claim rewards
      </BrandButton>
    </>
  )
}

export default Claim
