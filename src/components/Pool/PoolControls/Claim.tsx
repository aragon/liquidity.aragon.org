import React, { ReactNode, useMemo } from 'react'
// @ts-ignore
import TokenAmount from 'token-amount'
import AmountCard from '../../AmountCard/AmountCard'
import BrandButton from '../../BrandButton/BrandButton'
import LoadingSkeleton from '../../LoadingSkeleton/LoadingSkeleton'
import { usePoolBalance } from '../PoolBalanceProvider'
import { usePoolInfo } from '../PoolInfoProvider'

function Claim(): JSX.Element {
  const { rewardToken } = usePoolInfo()
  const {
    rewardsBalanceInfo: [rewardsBalance, rewardsBalanceStatus],
    tokenDecimals,
  } = usePoolBalance()

  const formattedRewardsBalance = useMemo(
    (): string | null =>
      rewardsBalance &&
      new TokenAmount(rewardsBalance, tokenDecimals).format({
        digits: tokenDecimals,
      }),
    [rewardsBalance, tokenDecimals]
  )

  const balanceToDisplay = useMemo((): ReactNode | string => {
    if (rewardsBalanceStatus === 'noAccount') {
      return '0'
    }

    if (formattedRewardsBalance) {
      return formattedRewardsBalance
    }

    return (
      <LoadingSkeleton
        css={`
          width: 100%;
          max-width: 100px;
        `}
      />
    )
  }, [formattedRewardsBalance, rewardsBalanceStatus])

  return (
    <>
      <AmountCard
        label="Rewards available to withdraw"
        tokenGraphic={rewardToken.graphic}
        suffix={rewardToken.symbol}
        value={balanceToDisplay}
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
