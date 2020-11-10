import React, { useMemo } from 'react'
// @ts-ignore
import TokenAmount from 'token-amount'
import AmountCard from '../../AmountCard/AmountCard'
import { usePoolBalance } from '../PoolBalanceProvider'
import { usePoolInfo } from '../PoolInfoProvider'

function TotalRewardsCard(): JSX.Element {
  const { rewardToken } = usePoolInfo()
  const { rewardsBalanceInfo, formattedDigits } = usePoolBalance()

  const [rewardsBalance, rewardsBalanceStatus] = rewardsBalanceInfo

  const formattedRewardsBalance = useMemo(
    (): string =>
      rewardsBalance
        ? new TokenAmount(rewardsBalance, rewardToken.decimals).format({
            digits: formattedDigits,
          })
        : '0',
    [rewardsBalance, rewardToken.decimals, formattedDigits]
  )

  return (
    <AmountCard
      label="Total rewards generated"
      tokenGraphic={rewardToken.graphic}
      suffix={rewardToken.symbol}
      value={formattedRewardsBalance}
      loading={rewardsBalanceStatus === 'loading'}
      css={`
        margin-top: 10px;
      `}
    />
  )
}

export default TotalRewardsCard
