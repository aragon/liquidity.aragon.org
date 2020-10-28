import React, { ReactNode, useMemo } from 'react'
// @ts-ignore
import TokenAmount from 'token-amount'
import AmountCard from '../../AmountCard/AmountCard'
import AmountInput from '../../AmountInput/AmountInput'
import BrandButton from '../../BrandButton/BrandButton'
import LoadingSkeleton from '../../LoadingSkeleton/LoadingSkeleton'
import { usePoolBalance } from '../PoolBalanceProvider'
import { usePoolInfo } from '../PoolInfoProvider'

function Withdraw(): JSX.Element {
  const { stakeToken } = usePoolInfo()
  const {
    stakedBalanceInfo: [stakedBalance, stakedBalanceStatus],
    tokenDecimals,
  } = usePoolBalance()

  const formattedStakedBalance = useMemo(
    (): string | null =>
      stakedBalance &&
      new TokenAmount(stakedBalance, tokenDecimals).format({
        digits: tokenDecimals,
      }),
    [stakedBalance, tokenDecimals]
  )

  const balanceToDisplay = useMemo((): ReactNode | string => {
    if (stakedBalanceStatus === 'noAccount') {
      return '0'
    }

    if (formattedStakedBalance) {
      return formattedStakedBalance
    }

    return (
      <LoadingSkeleton
        css={`
          width: 100%;
          max-width: 100px;
        `}
      />
    )
  }, [formattedStakedBalance, stakedBalanceStatus])

  return (
    <>
      <AmountInput />
      <AmountCard
        label={`Amount available to withdraw`}
        tokenGraphic={stakeToken.graphic}
        suffix={stakeToken.symbol}
        value={balanceToDisplay}
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
