import React, { ReactNode, useMemo, useState } from 'react'
// @ts-ignore
import { useLayout, useTheme } from '@aragon/ui'
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

  const { stakeToken, ended, endDate } = usePoolInfo()
  const [activeTab, setActiveTab] = useState<TabName>(
    ended ? 'withdraw' : 'stake'
  )

  const {
    accountBalanceInfo: [accountBalance, accountBalanceStatus],
    formattedDigits,
  } = usePoolBalance()

  const formattedAccountBalance = useMemo(
    (): string | null =>
      accountBalance &&
      new TokenAmount(accountBalance, stakeToken.decimals).format({
        digits: formattedDigits,
      }),
    [accountBalance, stakeToken.decimals, formattedDigits]
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
      {ended && (
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
            Program completed!{' '}
            <span role="img" aria-label="party-popper">
              🎉
            </span>
          </h1>
          <p
            css={`
              margin-bottom: 26px;
              max-width: 550px;
              margin-left: auto;
              margin-right: auto;
              color: ${theme.surfaceContentSecondary};
            `}
          >
            This program ended on {endDate}. If you participated, please connect
            your wallet to withdraw your funds and claim your rewards!
          </p>
        </div>
      )}
      {!ended && (
        <Tabs
          activeTab={activeTab}
          onStakeClick={() => setActiveTab('stake')}
          onWithdrawClick={() => setActiveTab('withdraw')}
          onClaimClick={() => setActiveTab('claim')}
        />
      )}

      {!ended && (
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
      {activeTab === 'withdraw' && <Withdraw exitAllBalance={ended} />}
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
  onClaimClick,
}: TabsProps): JSX.Element {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

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
      {
        key: 'claim',
        label: 'Claim rewards',
        onClick: onClaimClick,
      },
    ]
  }, [onStakeClick, onWithdrawClick, onClaimClick])

  return (
    <>
      <div
        css={`
          display: grid;
          grid-template-columns: ${compactMode ? `1fr` : `1fr 1fr 1fr`};
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
