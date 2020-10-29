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

  const formattedStakedBalance = useMemo(
    (): string | null =>
      stakedBalance &&
      new TokenAmount(stakedBalance, stakeToken.decimals).format({
        digits: stakeToken.decimals,
      }),
    [stakedBalance, stakeToken.decimals]
  )

  return (
    <form onSubmit={handleSubmit}>
      <AmountInput
        value={amount}
        onChange={handleAmountChange}
        onMaxClick={handleMaxClick}
        placeholder="Enter amount to stake"
        showMax={validationStatus !== 'notConnected'}
      />
      <AmountCard
        label="Amount staked"
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
        value="Testing"
        tokenGraphic={rewardToken.graphic}
        suffix={`${rewardToken.symbol} / week`}
        css={`
          margin-bottom: 30px;
        `}
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
