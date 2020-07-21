import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import TokenAmount from 'token-amount'
import { useViewport } from 'use-viewport'
import ButtonGroup from 'components/ButtonGroup/ButtonGroup'
import Logo from 'components/Logo/Logo'
import Input from 'components/Input/Input'
import StatsRow from './StatsRow'
import Info from 'components/Info/Info'
import { getKnownContract } from 'lib/known-contracts'
import { bigNum } from 'lib/utils'
import { useWalletAugmented } from 'lib/wallet'
import {
  useClaim,
  useProvideLiquidity,
  useRewardsPaid,
  useStake,
  useTokenBalance,
  useTokenDecimals,
  useTokenUniswapInfo,
  useUniStaked,
  useUniTotalSupply,
  useWithdraw,
} from 'lib/web3-contracts'
import { parseUnits, useTokenUsdRate } from 'lib/web3-utils'

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
    () => ({ amountUni, handleSetInputValue, inputValue, resetInputs }),
    [amountUni, handleSetInputValue, inputValue, resetInputs]
  )

  return inputValues
}

export default function StakeModule() {
  const [activeKey, setActiveKey] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [mode, setMode] = useState('uni')

  const {
    inputValue,
    handleSetInputValue,
    amountUni: amount,
    resetInputs,
  } = useConvertInputs()
  const { connected } = useWalletAugmented()
  const selectedTokenBalance = useTokenBalance(mode.toUpperCase())
  const decimalsUni = useTokenDecimals('UNI')
  const claim = useClaim()
  const provideLiquidity = useProvideLiquidity()
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
  }, [activeKey, connected, mode, resetInputs])

  const handleChangeMode = useCallback(
    () => setMode(mode === 'uni' ? 'ant' : 'uni'),
    [mode]
  )
  const handleSubmit = useCallback(async () => {
    try {
      setDisabled(true)
      if (SECTIONS[activeKey].id === 'stake') {
        mode === 'uni' ? await stake(amount) : await provideLiquidity(amount)
      }

      if (SECTIONS[activeKey].id === 'withdraw') {
        await withdraw()
      }

      if (SECTIONS[activeKey].id === 'claim') {
        await claim()
      }
    } catch (err) {
      console.log(err)
    } finally {
      setDisabled(false)
    }
  }, [activeKey, amount, claim, mode, provideLiquidity, stake, withdraw])

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

        {SECTIONS[activeKey].id === 'stake' && (
          <Info mode="info" height="40" padding="16" Compact={isCompact}>
            Learn how to participate.
          </Info>
        )}
        {SECTIONS[activeKey].id === 'withdraw' && (
          <Info mode="info" height="40" padding="16" Compact={isCompact}>
            Withdraw all of your staked UNI.
          </Info>
        )}
        {SECTIONS[activeKey].id === 'claim' && (
          <Info mode="info" height="40" padding="16" Compact={isCompact}>
            Claim all of your rewards from your staked UNI.
          </Info>
        )}
        {SECTIONS[activeKey].id !== 'claim' && (
          <StatsRow
            balanceUni={selectedTokenBalance}
            decimalsUni={decimalsUni}
            mode={mode}
            isCompact={isCompact}
          />
        )}
        {SECTIONS[activeKey].id === 'stake' && (
          <Input
            disabled={!connected || disabled}
            mode={mode}
            inputValue={inputValue}
            onChange={handleSetInputValue}
            onModeChange={handleChangeMode}
          />
        )}
        {SECTIONS[activeKey].id === 'stake' && <StakeSection mode={mode} />}
        {SECTIONS[activeKey].id === 'withdraw' && (
          <WithdrawSection isCompact={isCompact} />
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

function StakeSection({ mode }) {
  const { account } = useWalletAugmented()
  const { loading, staked } = useUniStaked(account)
  const [unipoolAddress] = getKnownContract('UNIPOOL')
  const unipoolAntBalance = useTokenBalance('ANT', unipoolAddress)

  return (
    <Card
      css={`
        display: flex;
        align-items: center;
        margin-top: 20px;
      `}
    >
      <Logo mode={mode} />
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
          {mode === 'uni'
            ? 'Amount of UNI staked'
            : 'Total amount of ANT up for rewards'}
        </span>
        <span
          css={`
            display: block;
          `}
        >
          {loading
            ? 'loading...'
            : TokenAmount.format(
                mode === 'uni' ? staked : unipoolAntBalance,
                18,
                { symbol: mode === 'uni' ? 'UNI' : 'ANT' }
              )}
        </span>
      </div>
    </Card>
  )
}

function WithdrawSection({ isCompact }) {
  const [loading, setLoading] = useState(false)
  const [amountToWithdraw, setAmountToWithdraw] = useState(0)
  const { account } = useWalletAugmented()
  const [tokenInfo, loadingInfo] = useTokenUniswapInfo('ANT')
  const { loading: loadingStaked, staked } = useUniStaked(account)
  const { loadingSupply, supply } = useUniTotalSupply()
  const rate = useTokenUsdRate('ANT')

  useEffect(() => {
    if (!tokenInfo || loadingInfo || loadingStaked || loadingSupply || !rate) {
      console.log(
        'meh',
        loadingSupply,
        rate,
        loadingInfo,
        loadingStaked,
        tokenInfo
      )
      return
    }
    setLoading(true)
    console.log('yay')
    console.log(rate)
    const userUni = Number(TokenAmount.format(staked, 18))
    const totalUni = Number(TokenAmount.format(supply, 18))
    const poolSizeAnt = Number(tokenInfo.reserve0)
    const poolSizeUsd = poolSizeAnt * rate.USD
    console.log(poolSizeUsd, totalUni, userUni)
    const totalAmountToWithdraw = (userUni * poolSizeUsd) / totalUni
    setAmountToWithdraw(totalAmountToWithdraw || 0)
    setLoading(false)
  }, [
    loadingInfo,
    loadingStaked,
    loadingSupply,
    rate,
    supply,
    staked,
    tokenInfo,
  ])

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
          $ {loading ? 'Loading...' : amountToWithdraw.toFixed(2)}
        </span>
      </Card>
    </div>
  )
}

function ClaimSection() {
  const { account } = useWalletAugmented()
  const { loading, paid } = useRewardsPaid(account)
  const [tokenInfo, loadingInfo] = useTokenUniswapInfo('ANT')

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
            {loadingInfo || !tokenInfo
              ? 'loading...'
              : Number(tokenInfo?.token0?.totalLiquidity).toLocaleString(
                  'en-US'
                )}
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
