import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { utils as EthersUtils } from 'ethers'
import styled from 'styled-components'
import TokenAmount from 'token-amount'
import { useViewport } from 'use-viewport'
import * as Sentry from '@sentry/browser'
import ButtonGroup from 'components/ButtonGroup/ButtonGroup'
import Logo from 'components/Logo/Logo'
import Input from 'components/Input/Input'
import StatsRow from './StatsRow'
import Info from 'components/Info/Info'
import { bigNum } from 'lib/utils'
import env from 'lib/environment'
import { useWalletAugmented } from 'lib/wallet'
import {
  useClaim,
  useRewardsPaid,
  useStake,
  useBalanceOf,
  useTokenDecimals,
  useTokenUniswapInfo,
  useTotalUniStaked,
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
      setInputValue(parsedValue.inputValue)
      setAmountUni(parsedValue.amount)
    }
  }, [])

  const resetInputs = useCallback(() => {
    setInputValue('')
    setAmountUni(bigNum(0))
  }, [])

  const inputValues = useMemo(
    () => ({
      amountUni,
      handleSetInputValue,
      inputValue,
      resetInputs,
      setAmountUni,
      setInputValue,
    }),
    [
      amountUni,
      handleSetInputValue,
      inputValue,
      resetInputs,
      setAmountUni,
      setInputValue,
    ]
  )

  return inputValues
}

export default function StakeModule() {
  const [activeKey, setActiveKey] = useState(1)
  const [disabled, setDisabled] = useState(false)

  const {
    inputValue,
    handleSetInputValue,
    amountUni: amount,
    resetInputs,
    setAmountUni,
    setInputValue,
  } = useConvertInputs()
  const { account, connected } = useWalletAugmented()
  const selectedTokenBalance = useBalanceOf('TOKEN_UNI')
  const { loading: loadingStaked, staked } = useUniStaked(account)
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

  const handleMax = useCallback(() => {
    const newInputValue = EthersUtils.formatEther(
      selectedTokenBalance.toString()
    )
    setAmountUni(selectedTokenBalance)
    setInputValue(newInputValue)
  }, [selectedTokenBalance, setAmountUni, setInputValue])

  const handleSubmit = useCallback(async () => {
    try {
      setDisabled(true)
      if (SECTIONS[activeKey].id === 'stake') {
        await stake(amount)
      }

      if (SECTIONS[activeKey].id === 'withdraw') {
        await withdraw()
      }

      if (SECTIONS[activeKey].id === 'claim') {
        await claim()
      }
    } catch (err) {
      if (env('NODE_ENV') !== 'production') {
        Sentry.captureException(err)
      }
    } finally {
      setDisabled(false)
      resetInputs()
    }
  }, [activeKey, amount, claim, resetInputs, stake, withdraw])

  const inputError = useMemo(
    () =>
      amount.gt(selectedTokenBalance) ||
      (amount.eq(bigNum(0)) && SECTIONS[activeKey].id === 'stake') ||
      disabled,
    [activeKey, amount, disabled, selectedTokenBalance]
  )

  return (
    <div
      css={`
        margin-top: 144px;
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
          disabled
          elements={SECTIONS}
          isCompact={isCompact}
          onSetActiveKey={setActiveKey}
        />

        {SECTIONS[activeKey].id === 'stake' && (
          <Info mode="info" height="40" padding="16" Compact={isCompact}>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://aragon.org/blog/liquidity-rewards"
            >
              {' '}
              Learn how to obtain UNI to participate in the rewards program
            </a>
            .
          </Info>
        )}
        {SECTIONS[activeKey].id === 'withdraw' && (
          <Info mode="info" padding="16" Compact={isCompact}>
            Withdraw all of your staked UNI.
          </Info>
        )}
        {SECTIONS[activeKey].id === 'claim' && (
          <Info mode="info" padding="16" Compact={isCompact}>
            Claim all of your rewards from your staked UNI.
          </Info>
        )}
        {SECTIONS[activeKey].id !== 'claim' && (
          <StatsRow
            balanceUni={selectedTokenBalance}
            decimalsUni={decimalsUni}
            isCompact={isCompact}
          />
        )}
        {SECTIONS[activeKey].id === 'stake' && (
          <Input
            disabled={!connected || disabled}
            inputValue={inputValue}
            onChange={handleSetInputValue}
            onMax={handleMax}
          />
        )}
        {SECTIONS[activeKey].id === 'stake' && (
          <StakeSection
            loading={loadingStaked}
            isCompact={isCompact}
            staked={staked}
          />
        )}
        {SECTIONS[activeKey].id === 'withdraw' && (
          <WithdrawSection
            loading={loadingStaked}
            isCompact={isCompact}
            staked={staked}
          />
        )}
        {SECTIONS[activeKey].id === 'claim' && (
          <ClaimSection isCompact={isCompact} />
        )}
        {!connected && (
          <Info padding="16" isCompact={isCompact}>
            Please, connect your wallet to get started.
          </Info>
        )}
        {connected && (
          <ActionButton
            type="button"
            disabled={disabled || inputError}
            onClick={disabled ? undefined : handleSubmit}
            css={`
              margin-top: 60px;
              ${disabled ||
                (inputError &&
                  `
                background: #F6F9FC;
                color: #8398AC;
                cursor: default;
                &:active {
                  top: 0px;
                }
              `)}
            `}
          >
            {SECTIONS[activeKey].copy}
          </ActionButton>
        )}
      </main>
    </div>
  )
}

function StakeSection({ loading, staked }) {
  const { connected } = useWalletAugmented()

  return (
    <Card
      css={`
        display: flex;
        align-items: center;
        margin-top: 20px;
      `}
    >
      <Logo mode={'uni'} />
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
          {!connected
            ? '0'
            : loading
            ? 'loading...'
            : TokenAmount.format(staked, 18, {
                symbol: 'UNI',
                digits: 9,
              })}
        </span>
      </div>
    </Card>
  )
}

function WithdrawSection({ loading, isCompact, staked }) {
  const { connected } = useWalletAugmented()

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
          Amount available to withdraw
        </span>
        <span
          css={`
            display: block;
            font-size: 24px;
          `}
        >
          {!connected
            ? '0'
            : loading
            ? 'Loading...'
            : TokenAmount.format(staked, 18, { symbol: 'UNI', digits: 9 })}
        </span>
      </Card>
    </div>
  )
}

function ClaimSection() {
  const { account } = useWalletAugmented()
  const { loading, paid } = useRewardsPaid(account)
  const [loadingUniswapInfo, uniswapInfo] = useTokenUniswapInfo('ANT')

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
            Total ANT in the Uniswap liquidity pool
          </span>
          <span
            css={`
              display: block;
              font-size: 22px;
            `}
          >
            {loadingUniswapInfo || !uniswapInfo
              ? 'loading...'
              : Number(uniswapInfo?.token0?.totalLiquidity)?.toLocaleString(
                  'en-US'
                ) ?? '0'}{' '}
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
            Rewards available to withdraw
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
