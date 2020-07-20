import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useViewport } from 'use-viewport'
import ButtonGroup from 'components/ButtonGroup/ButtonGroup'
import Logo from 'components/Logo/Logo'
import Warning from 'components/Warning/Warning'
import StatsRow from './StatsRow'
import { useWalletAugmented } from 'lib/wallet'
import { useTokenBalance, useTokenDecimals } from 'lib/web3-contracts'

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
    <main
      css={`
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: 100%;
        max-width: 762px;
        max-height: 550px;
        background: #ffffff;
        mix-blend-mode: normal;
        box-shadow: 0px 2px 2px rgba(87, 95, 119, 0.15);
        border-radius: 6px;
        padding: 32px;
        ${isCompact &&
          `
            max-width: 362px;
            max-height: auto;
            padding: 10px;
          `}
      `}
    >
      <ButtonGroup
        activeKey={activeKey}
        elements={['Deposit', 'Withdraw', 'Stats']}
        isCompact={isCompact}
        onSetActiveKey={setActiveKey}
      />
      <StatsRow
        balanceUni={balanceUni}
        decimalsUni={decimalsUni}
        isCompact={isCompact}
      />
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
            <b>0.00 ANT</b> / Month
          </span>
        </div>
      </Card>
      {!connected && (
        <Warning>Please, connect your wallet to get started.</Warning>
      )}
      <ActionButton css={`margin-top: 60px;`}> Stake </ActionButton>
    </main>
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
