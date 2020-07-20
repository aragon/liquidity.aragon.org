import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useViewport } from 'use-viewport'
import ButtonGroup from 'components/ButtonGroup/ButtonGroup'
import Logo from 'components/Logo/Logo'
import Input from 'components/Input/Input'
import StatsRow from './StatsRow'
import Warning from 'components/Warning/Warning'
import { useWalletAugmented } from 'lib/wallet'
import { useTokenBalance, useTokenDecimals } from 'lib/web3-contracts'

const SECTIONS = [
  { id: 'stake', copy: 'Stake', copyCompact: 'Stake' },
  { id: 'withdraw', copy: 'Withdraw', copyCompact: 'Withdraw' },
  { id: 'claim', copy: 'Claim rewards', copyCompact: 'Claim' },
]

export default function StakeModule() {
  const [activeKey, setActiveKey] = useState(0)
  const { below } = useViewport()
  const { account, connected } = useWalletAugmented()
  const balanceUni = useTokenBalance('UNI')
  const decimalsUni = useTokenDecimals('UNI')
  // Super ugly Next.js workaround to let us have differences between SSR & client
  const [isCompact, setIsCompact] = useState(false)
  const smallLayout = below(415)
  useEffect(() => {
    setTimeout(() => {
      setIsCompact(smallLayout)
    }, 0)
  }, [smallLayout])

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
          elements={SECTIONS}
          isCompact={isCompact}
          onSetActiveKey={setActiveKey}
        />
        {SECTIONS[activeKey].id !== 'claim' && (
          <StatsRow
            balanceUni={balanceUni}
            decimalsUni={decimalsUni}
            isCompact={isCompact}
          />
        )}
        {SECTIONS[activeKey].id !== 'claim' && (
          <Input />
          )}
        {SECTIONS[activeKey].id === 'stake' && <StakeSection />}
        {SECTIONS[activeKey].id === 'withdraw' && (
          <WithdrawSection isCompact={isCompact} />
        )}
        {SECTIONS[activeKey].id === 'claim' && (
          <ClaimSection isCompact={isCompact} />
        )}
        {!connected && (
          <Warning isCompact={isCompact}>
            Please, connect your wallet to get started.
          </Warning>
        )}
        {connected && SECTIONS[activeKey] !== 'Stats' && (
          <ActionButton
            type="button"
            css={`
              margin-top: 60px;
            `}
          >
            {' '}
            Stake{' '}
          </ActionButton>
        )}
      </main>
    </div>
  )
}

function StakeSection() {
  return (
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
          Your estimated rewards
        </span>
        <span
          css={`
            display: block;
          `}
        >
          0.00 ANT / Month
        </span>
      </div>
    </Card>
  )
}

function WithdrawSection({ isCompact }) {
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
          0 ANT
        </span>
      </Card>
    </div>
  )
}

function ClaimSection() {
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
            0.00 ANT
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
              0.00 ANT
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
