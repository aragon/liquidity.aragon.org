import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import TokenAmount from 'token-amount'
import { useViewport } from 'use-viewport'
import ButtonGroup from 'components/ButtonGroup/ButtonGroup'
import Logo from 'components/Logo/Logo'
import Input from 'components/Input/Input'
import StatsRow from './StatsRow'
import Info from 'components/Info/Info'
import { bigNum } from 'lib/utils'
import { useWalletAugmented } from 'lib/wallet'
import {
  useClaim,
  useRewardsPaid,
  useStake,
  useTokenBalance,
  useTokenDecimals,
  useTokenReserve,
  useUniStaked,
  useWithdraw,
} from 'lib/web3-contracts'
import { parseUnits } from 'lib/web3-utils'

const SECTIONS = [
  { id: 'stake', copy: 'Stake', copyCompact: 'Stake' },
  { id: 'withdraw', copy: 'Withdraw', copyCompact: 'Withdraw' },
  { id: 'claim', copy: 'Claim rewards', copyCompact: 'Claim' },
]

// Filters and parse the input value of a token amount.
// Returns a BN.js instance and the filtered value.
function parseInputValue(inputValue, decimals) {
  if (decimals === -1) {
    return null
  }

  inputValue = inputValue.trim()

  // amount is the parsed value (BN.js instance)
  const amount = parseUnits(inputValue, { digits: decimals })

  if (amount.lt(0)) {
    return null
  }

  return { amount, inputValue }
}

function useConvertInputs() {
  const [inputValue, setInputValue] = useState('')
  const [amountUni, setAmountUni] = useState(bigNum(0))

  const handleSetInputValue = useCallback(e => {
    const parsedValue = parseInputValue(e.target.value, 18)
    if (parsedValue !== null) {
      console.log(parsedValue.amount.toString())
      setInputValue(parsedValue.inputValue)
      setAmountUni(parsedValue.amount)
    }
  }, [])

  const resetInputs = useCallback(() => {
    setInputValue('')
    setAmountUni(bigNum(0))
  }, [])

  const inputValues = useMemo(
    () => ({ amountUni, handleSetInputValue, inputValue, resetInputs }),
    [amountUni, handleSetInputValue, inputValue, resetInputs]
  )

  return inputValues
}

export default function StakeModule() {
  const [activeKey, setActiveKey] = useState(0)
  const [disabled, setDisabled] = useState(false)

  const {
    inputValue,
    handleSetInputValue,
    amountUni,
    resetInputs,
  } = useConvertInputs()
  const { connected } = useWalletAugmented()
  const balanceUni = useTokenBalance('UNI')
  const decimalsUni = useTokenDecimals('UNI')
  const claim = useClaim()
  const stake = useStake()
  const withdraw = useWithdraw()
  const { below } = useViewport()
  // Super ugly Next.js workaround to let us have differences between SSR & client
  const [isCompact, setIsCompact] = useState(false)
  const smallLayout = below(415)
  useEffect(() => {
    setTimeout(() => {
      setIsCompact(smallLayout)
    }, 0)
  }, [smallLayout])

  // Reset all values on connection change
  useEffect(() => {
    resetInputs()
  }, [activeKey, connected, resetInputs])

  const handleSubmit = useCallback(async () => {
    try {
      setDisabled(true)
      console.log('is disabled')
      if (SECTIONS[activeKey].id === 'stake') {
        console.log(amountUni.toString(), 'stake')
        await stake(amountUni)
      }

      if (SECTIONS[activeKey].id === 'withdraw') {
        await withdraw(amountUni)
      }

      if (SECTIONS[activeKey].id === 'claim') {
        await claim()
      }
    } catch (err) {
      console.log(JSON.stringify(err))
    } finally {
      setDisabled(false)
    }
  }, [activeKey, amountUni, claim, stake, withdraw])

  return (
    <div
      css={`
        margin-top: 84px;
      `}
    >
      <main
        css={`
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          height: 100%;
          max-width: 762px;
          background: #ffffff;
          mix-blend-mode: normal;
          box-shadow: 0px 2px 2px rgba(87, 95, 119, 0.15);
          border-radius: 6px;
          padding: 32px;
          ${isCompact &&
            `
            max-width: 362px;
            max-height: 100%;
            padding: 10px;
            justify-content: flex-start;
          `}
        `}
      >
        <ButtonGroup
          activeKey={activeKey}
          disabled={disabled}
          elements={SECTIONS}
          isCompact={isCompact}
          onSetActiveKey={setActiveKey}
        />

        {SECTIONS[activeKey].id === 'withdraw' && (
          <Info mode="info" height="40" padding="16" Compact={isCompact}>
            Withdraw all of your staked UNI.
          </Info>
        )}
        {SECTIONS[activeKey].id !== 'claim' && (
          <StatsRow
            balanceUni={balanceUni}
            decimalsUni={decimalsUni}
            isCompact={isCompact}
          />
        )}
        {SECTIONS[activeKey].id === 'stake' && (
          <Input
            disabled={!connected || disabled}
            inputValue={inputValue}
            onChange={handleSetInputValue}
          />
        )}
        {SECTIONS[activeKey].id === 'stake' && <StakeSection />}
        {SECTIONS[activeKey].id === 'withdraw' && (
          <WithdrawSection isCompact={isCompact} />
        )}
        {SECTIONS[activeKey].id === 'claim' && (
          <ClaimSection isCompact={isCompact} />
        )}
        {!connected && (
          <Info isCompact={isCompact}>
            Please, connect your wallet to get started.
          </Info>
        )}
        {connected && (
          <ActionButton
            type="button"
            disabled={disabled}
            onClick={disabled ? undefined : handleSubmit}
            css={`
              margin-top: 60px;
              ${disabled &&
                `
                background: #F6F9FC;
                color: #8398AC;
                cursor: default;
                &:active {
                  top: 0px;
                }
              `}
            `}
          >
            {SECTIONS[activeKey].copy}
          </ActionButton>
        )}
      </main>
    </div>
  )
}

function StakeSection() {
  const { account } = useWalletAugmented()
  const { loading, staked } = useUniStaked()
  return (
    <Card
      css={`
        display: flex;
        align-items: center;
        margin-top: 20px;
      `}
    >
      <Logo mode="uni" />
      <div
        css={`
          display: flex;
          flex-direction: column;
          margin-left: 20px;
        `}
      >
        <span
          css={`
            display: block;
            font-weight: 300;
            color: #7893ae;
            margin-bottom: 12px;
          `}
        >
          Amount of UNI staked
        </span>
        <span
          css={`
            display: block;
          `}
        >
          {loading
            ? 'loading...'
            : TokenAmount.format(staked, 18, { symbol: 'UNI' })}
        </span>
      </div>
    </Card>
  )
}

function WithdrawSection({ isCompact }) {
  const { account } = useWalletAugmented()
  const { loading, paid } = useRewardsPaid(account)
  return (
    <div
      css={`
        display: flex;
        margin-top: 20px;
        ${isCompact &&
          `
          flex-direction: column;
        `}
      `}
    >
      <Card
        css={`
          display: flex;
          flex-direction: column;
          margin: 0 9px 0 0;
          ${isCompact &&
            `
            margin: 0 0 9px 0;
          `}
        `}
      >
        <span
          css={`
            display: block;
            color: #7893ae;
            font-weight: 300;
          `}
        >
          Amount to withdraw
        </span>
        <span
          css={`
            display: block;
            font-size: 24px;
          `}
        >
          $0
        </span>
      </Card>
      <Card>
        <span
          css={`
            display: block;
            color: #7893ae;
            font-weight: 300;
            margin: 0 9px 0 0;
            ${isCompact &&
              `
            margin: 0 0 9px 0;
          `}
          `}
        >
          Rewards claimed
        </span>
        <span
          css={`
            display: block;
            font-size: 24px;
          `}
        >
          {loading
            ? 'loading...'
            : TokenAmount.format(paid, 18, { symbol: 'UNI' })}
        </span>
      </Card>
    </div>
  )
}

function ClaimSection() {
  const { account } = useWalletAugmented()
  const { loading, paid } = useRewardsPaid(account)
  const [tokenReserves, loadingReserves] = useTokenReserve('ANT')
  // useEffect(() => console.log('reserve', data[0]?.toString()), [data])

  return (
    <div>
      <Card
        css={`
          display: flex;
          align-items: center;
          margin-top: 20px;
        `}
      >
        <Logo mode="ant" />
        <div
          css={`
            display: flex;
            flex-direction: column;
            margin-left: 20px;
          `}
        >
          <span
            css={`
              display: block;
              font-weight: 300;
              color: #7893ae;
              margin-bottom: 12px;
            `}
          >
            Total ANT Staked
          </span>
          <span
            css={`
              display: block;
              font-size: 22px;
            `}
          >
            {loadingReserves || !tokenReserves
              ? 'loading...'
              : TokenAmount.format(tokenReserves, 18, { symbol: 'ANT' })}
          </span>
        </div>
      </Card>
      <Card
        css={`
          display: flex;
          align-items: center;
          margin-top: 20px;
        `}
      >
        <Logo mode="ant" />
        <div
          css={`
            display: flex;
            flex-direction: column;
            margin-left: 20px;
          `}
        >
          <span
            css={`
              display: block;
              font-weight: 300;
              color: #7893ae;
              margin-bottom: 12px;
            `}
          >
            Total rewards generated
          </span>
          <span
            css={`
              display: block;
            `}
          >
            <span
              css={`
                color: #3ad8c5;
                font-size: 22px;
              `}
            >
              {loading
                ? 'loading...'
                : TokenAmount.format(paid, 18, { symbol: 'ANT' })}
            </span>
          </span>
        </div>
      </Card>
    </div>
  )
}

const Card = styled.div`
  width: 100%;
  height: 120px;
  background: #ffffff;
  box-shadow: 0px 7px 17px rgba(139, 166, 194, 0.15);
  border-radius: 8px;
  padding: 32px;
`

const ActionButton = styled.button`
  position: relative;
  border: 0;
  border-radius: 8px;
  padding: 0;
  width: 100%;
  height: 48px;
  cursor: pointer;
  &:active {
    top: 1px;
  }
  background: linear-gradient(342.22deg, #01e8f7 -5.08%, #00c2ff 81.4%);
  color: white;
  mix-blend-mode: normal;
  box-shadow: 0px 2px 2px rgba(87, 95, 119, 0.15);
  border-radius: 6px;
`
