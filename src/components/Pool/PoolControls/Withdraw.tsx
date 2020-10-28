import React, { useCallback, useMemo, useState } from 'react'
// @ts-ignore
import TokenAmount from 'token-amount'
import AmountCard from '../../AmountCard/AmountCard'
import AmountInput from '../../AmountInput/AmountInput'
import BrandButton from '../../BrandButton/BrandButton'
import { usePoolBalance } from '../PoolBalanceProvider'
import { usePoolInfo } from '../PoolInfoProvider'
import useInputValidation from './useInputValidation'

function Withdraw(): JSX.Element {
  const [amount, setAmount] = useState('')
  const { stakeToken } = usePoolInfo()
  const {
    stakedBalanceInfo: [stakedBalance, stakedBalanceStatus],
    tokenDecimals,
  } = usePoolBalance()

  const { maxAmount, validationStatus, floatRegex } = useInputValidation({
    amount: amount,
    balance: stakedBalance,
    decimals: tokenDecimals,
  })

  console.log(validationStatus)

  const handleAmountChange = useCallback(
    (event) => {
      const value = event.target.value

      if (floatRegex.test(value)) {
        setAmount(value)
      }
    },
    [floatRegex]
  )

  const handleMaxClick = useCallback(() => {
    setAmount(maxAmount)
  }, [maxAmount])

  const formattedStakedBalance = useMemo(
    (): string | null =>
      stakedBalance &&
      new TokenAmount(stakedBalance, tokenDecimals).format({
        digits: tokenDecimals,
      }),
    [stakedBalance, tokenDecimals]
  )

  return (
    <>
      <AmountInput
        value={amount}
        onChange={handleAmountChange}
        onMaxClick={handleMaxClick}
        placeholder="Enter amount to withdraw"
        showMax={validationStatus !== 'notConnected'}
      />
      <AmountCard
        label={`Amount available to withdraw`}
        tokenGraphic={stakeToken.graphic}
        suffix={stakeToken.symbol}
        value={formattedStakedBalance ? formattedStakedBalance : '0'}
        loading={stakedBalanceStatus === 'loading'}
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
