import React, { useCallback, useMemo, useState } from 'react'
// @ts-ignore
import TokenAmount from 'token-amount'
import { useStake } from '../../../hooks/useContract'
import { useAccountModule } from '../../Account/AccountModuleProvider'
import AmountCard from '../../AmountCard/AmountCard'
import AmountInput from '../../AmountInput/AmountInput'
import { usePoolBalance } from '../PoolBalanceProvider'
import { usePoolInfo } from '../PoolInfoProvider'
import ControlButton from './ControlButton'
import useInputValidation from './useInputValidation'

function Stake(): JSX.Element {
  const [amount, setAmount] = useState('')
  const { stakeToken, rewardToken, contractGroup } = usePoolInfo()
  const { showAccount } = useAccountModule()
  const {
    accountBalanceInfo: [accountBalance],
    stakedBalanceInfo: [stakedBalance, stakedBalanceStatus],
    totalSupplyInfo: [poolTotalSupply],
    rewardRateInfo: [rewardRate],
    formattedDigits,
  } = usePoolBalance()
  const stake = useStake(contractGroup)

  const {
    maxAmount,
    validationStatus,
    floatRegex,
    parsedAmountBn,
  } = useInputValidation({
    amount: amount,
    balance: accountBalance,
    decimals: stakeToken.decimals,
  })

  const formattedRewards = useMemo(() => {
    if (!rewardRate || !poolTotalSupply || !stakedBalance) {
      return '0'
    }

    const weekSeconds = 604800

    // (reward rate) * (user stake) / (total stake) * 7 days (seconds)
    const rewards = rewardRate
      .mul(weekSeconds)
      .mul(stakedBalance.add(parsedAmountBn)) // Add user input amount to total
      .div(poolTotalSupply.add(parsedAmountBn))

    const formattedValue = new TokenAmount(
      rewards,
      rewardToken.decimals
    ).format({
      digits: formattedDigits,
    })

    return formattedValue
  }, [
    rewardRate,
    poolTotalSupply,
    stakedBalance,
    rewardToken.decimals,
    parsedAmountBn,
    formattedDigits,
  ])

  const formattedStakedBalance = useMemo(
    (): string | null =>
      stakedBalance &&
      new TokenAmount(stakedBalance, stakeToken.decimals).format({
        digits: formattedDigits,
      }),
    [stakedBalance, stakeToken.decimals, formattedDigits]
  )

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

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()

      if (validationStatus === 'notConnected') {
        showAccount()
      }

      if (validationStatus === 'valid') {
        stake(parsedAmountBn)
      }
    },
    [parsedAmountBn, showAccount, validationStatus, stake]
  )

  return (
    <form onSubmit={handleSubmit}>
      <AmountInput
        value={amount}
        onChange={handleAmountChange}
        onMaxClick={handleMaxClick}
        placeholder="Enter amount to stake"
        disableMax={validationStatus === 'notConnected'}
      />
      <AmountCard
        label="Total amount staked"
        value={formattedStakedBalance ? formattedStakedBalance : '0'}
        tokenGraphic={stakeToken.graphic}
        suffix={stakeToken.symbol}
        loading={stakedBalanceStatus === 'loading'}
        css={`
          margin-top: 10px;
          margin-bottom: 10px;
        `}
      />
      <AmountCard
        label="Your estimated rewards"
        value={formattedRewards}
        tokenGraphic={rewardToken.graphic}
        suffix={`${rewardToken.symbol} / week`}
      />
      <ControlButton
        status={validationStatus}
        labels={{
          notConnected: 'Connect wallet',
          insufficientBalance: 'Insufficient wallet balance',
          noAmount: 'Enter an amount',
          valid: 'Stake',
          loading: 'Loading…',
        }}
      />
    </form>
  )
}

export default Stake
