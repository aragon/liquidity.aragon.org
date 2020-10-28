import React, { useCallback, useMemo, useState } from 'react'
// @ts-ignore
import TokenAmount from 'token-amount'
import { useWithdraw } from '../../../hooks/useContract'
import { useAccountModule } from '../../Account/AccountModuleProvider'
import AmountCard from '../../AmountCard/AmountCard'
import AmountInput from '../../AmountInput/AmountInput'
import { usePoolBalance } from '../PoolBalanceProvider'
import { usePoolInfo } from '../PoolInfoProvider'
import ControlButton from './ControlButton'
import useInputValidation from './useInputValidation'

function Withdraw(): JSX.Element {
  const [amount, setAmount] = useState('')
  const { stakeToken, contractGroup } = usePoolInfo()
  const {
    stakedBalanceInfo: [stakedBalance, stakedBalanceStatus],
    tokenDecimals,
  } = usePoolBalance()
  const { showAccount } = useAccountModule()
  const withdraw = useWithdraw(contractGroup)

  const {
    maxAmount,
    validationStatus,
    floatRegex,
    parsedAmountBn,
  } = useInputValidation({
    amount: amount,
    balance: stakedBalance,
    decimals: tokenDecimals,
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
        withdraw(parsedAmountBn)
      }
    },
    [parsedAmountBn, showAccount, validationStatus, withdraw]
  )

  const formattedStakedBalance = useMemo(
    (): string | null =>
      stakedBalance &&
      new TokenAmount(stakedBalance, tokenDecimals).format({
        digits: tokenDecimals,
      }),
    [stakedBalance, tokenDecimals]
  )

  return (
    <form onSubmit={handleSubmit}>
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
      <ControlButton status={validationStatus} label="Withdraw" />
    </form>
  )
}

export default Withdraw
