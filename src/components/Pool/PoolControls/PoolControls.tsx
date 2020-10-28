import React, { ReactNode, useMemo, useState } from 'react'
// @ts-ignore
import { useTheme } from '@aragon/ui'
// @ts-ignore
import TokenAmount from 'token-amount'
import BrandButton from '../../BrandButton/BrandButton'
import Claim from './Claim'
import Stake from './Stake'
import Withdraw from './Withdraw'
import { radius } from '../../../style/radius'
import { shadowDepth } from '../../../style/shadow'
import { usePoolBalance } from '../PoolBalanceProvider'
import { usePoolInfo } from '../PoolInfoProvider'
import LoadingSkeleton from '../../LoadingSkeleton/LoadingSkeleton'
import { fontWeight } from '../../../style/font'
import { theme } from '../../../style/theme'

type TabName = 'stake' | 'withdraw' | 'claim'

function PoolControls(): JSX.Element {
  const theme = useTheme()
  const { stakeToken, expired } = usePoolInfo()
  const [activeTab, setActiveTab] = useState<TabName>(
    expired ? 'withdraw' : 'stake'
  )

  const {
    accountBalanceInfo: [accountBalance, accountBalanceStatus],
    tokenDecimals,
  } = usePoolBalance()

  const formattedAccountBalance = useMemo(
    (): string | null =>
      accountBalance &&
      new TokenAmount(accountBalance, tokenDecimals).format({
        digits: tokenDecimals,
      }),
    [accountBalance, tokenDecimals]
  )

  const balanceToDisplay = useMemo((): ReactNode | string => {
    if (accountBalanceStatus === 'noAccount') {
      return 'Connect your wallet to see your balance'
    }

    if (formattedAccountBalance) {
      return (
        <>
          Your wallet balance:{' '}
          <span
            css={`
              word-break: break-all;
              color: ${theme.surfaceContent};
              font-weight: ${fontWeight.medium};
            `}
          >
            {formattedAccountBalance}
          </span>{' '}
          {stakeToken.symbol}
        </>
      )
    }

    return <LoadingSkeleton />
  }, [
    accountBalanceStatus,
    formattedAccountBalance,
    stakeToken.symbol,
    theme.surfaceContent,
  ])

  return (
    <div
      css={`
        padding: 40px;
        background-color: ${theme.surface};
        border-radius: ${radius.high};
        box-shadow: ${shadowDepth.high};
      `}
    >
      {expired && (
        <div
          css={`
            text-align: center;
          `}
        >
          <h1
            css={`
              font-size: 26px;
              margin-bottom: 10px;
              line-height: 1.1;
              font-weight: ${fontWeight.medium};
            `}
          >
            This program has finished
          </h1>
          <p
            css={`
              margin-bottom: 26px;
              color: ${theme.surfaceContentSecondary};
            `}
          >
            The ANT Liquidity Rewards program has ended. Withdraw your funds and
            claim the rewards!
          </p>
        </div>
      )}
      {!expired && (
        <Tabs
          activeTab={activeTab}
          onStakeClick={() => setActiveTab('stake')}
          onWithdrawClick={() => setActiveTab('withdraw')}
          onClaimClick={() => setActiveTab('claim')}
        />
      )}

      {!expired && (
        <div
          css={`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <p
            css={`
              color: ${theme.contentSecondary};
              margin-bottom: 15px;
              min-width: 200px;
              text-align: right;
            `}
          >
            {balanceToDisplay}
          </p>
        </div>
      )}

      {activeTab === 'stake' && <Stake />}
      {activeTab === 'withdraw' && <Withdraw exitAllBalance={expired} />}
      {activeTab === 'claim' && <Claim />}
    </div>
  )
}

type TabsProps = {
  activeTab: TabName
  onStakeClick: () => void
  onWithdrawClick: () => void
  onClaimClick: () => void
}

type TabItem = {
  key: TabName
  label: string
  onClick: () => void
  disabled?: boolean
}

function Tabs({
  activeTab,
  onStakeClick,
  onWithdrawClick,
}: // onClaimClick,
TabsProps): JSX.Element {
  const items = useMemo((): TabItem[] => {
    return [
      {
        key: 'stake',
        label: 'Stake',
        onClick: onStakeClick,
      },
      {
        key: 'withdraw',
        label: 'Withdraw',
        onClick: onWithdrawClick,
      },
      // {
      //   key: 'claim',
      //   label: 'Claim rewards',
      //   onClick: onClaimClick,
      //   disabled: true,
      // },
    ]
  }, [onStakeClick, onWithdrawClick])

  return (
    <>
      <div
        css={`
          display: grid;
          grid-template-columns: 1fr 1fr;
          /* grid-template-columns: 1fr 1fr 1fr; */
          grid-gap: 10px;
          margin-bottom: 20px;
        `}
      >
        {items.map(({ key, label, onClick, disabled }) => {
          const isActiveTab = key === activeTab
          return (
            <BrandButton
              key={key}
              wide
              size="large"
              onClick={onClick}
              disabled={disabled}
              css={`
                border: 2px solid ${isActiveTab ? theme.accent : 'transparent'};

                font-weight: ${fontWeight.medium};
                ${isActiveTab ? 'box-shadow: none' : ''};
              `}
            >
              {label}
            </BrandButton>
          )
        })}
      </div>
    </>
  )
}

export default PoolControls
