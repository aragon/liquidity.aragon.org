import React, { ReactNode, useMemo } from 'react'
import {
  useTheme,
  ButtonBase,
  shortenAddress,
  IconExternal,
  IconInfo,
  GU,
  useLayout,
  // @ts-ignore
} from '@aragon/ui'
import TokenAntGraphic from '../TokenAntGraphic/TokenAntGraphic'
import { shadowDepth } from '../../style/shadow'
import { radius } from '../../style/radius'
import { fontWeight } from '../../style/font'
import { getEtherscanUrl } from '../../utils/etherscan'
import AntAmount from '../AntAmount/AntAmount'
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton'

type BalanceCardProps = {
  tokenVersion: 'v1' | 'v2'
  balance: string | null
  accountConnected: boolean
  tokenAddress: string
  lpTotalBalance?: string | null
  showLpBalance?: boolean
  lpInfoAvailable?: boolean
  onLpClick?: (() => void) | null
}

function BalanceCard({
  tokenVersion = 'v1',
  balance,
  accountConnected,
  tokenAddress,
  lpTotalBalance,
  lpInfoAvailable,
  showLpBalance,
  onLpClick,
}: BalanceCardProps): JSX.Element {
  const theme = useTheme()
  const { layoutName } = useLayout()

  const compactMode = layoutName === 'small'
  const etherscanUrl = getEtherscanUrl(tokenAddress)

  const lpModalButton = useMemo(() => {
    const title = 'Liquidity pools distribution'
    return onLpClick ? (
      <div
        css={`
          margin: -${1 * GU}px;
        `}
      >
        <ButtonBase
          onClick={onLpClick}
          css={`
            display: flex;
            align-items: center;
            font-size: 18px;
            line-height: 1;
            padding: ${1 * GU}px;
            color: ${theme.link};
          `}
        >
          <div
            css={`
              margin-left: -${0.5 * GU}px;
              margin-bottom: -${0.25 * GU}px;
              margin-right: ${0.25 * GU}px;
            `}
          >
            <IconInfo />
          </div>

          {title}
        </ButtonBase>
      </div>
    ) : (
      <div
        css={`
          color: ${theme.contentSecondary};
        `}
      >
        {title}
      </div>
    )
  }, [onLpClick, theme])

  return (
    <div
      css={`
        background-color: ${theme.surface};
        box-shadow: ${shadowDepth.high};
        border-radius: ${radius.high};
        padding: ${compactMode ? 4 * GU : 5 * GU}px;

        max-width: ${90 * GU}px;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
      `}
    >
      <div
        css={`
          display: flex;
          justify-content: space-between;
          padding-bottom: ${5 * GU}px;
          margin-bottom: ${4.5 * GU}px;
          border-bottom: 1px solid ${theme.border};
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            flex: 1;
          `}
        >
          <TokenAntGraphic
            shadow
            type={tokenVersion}
            size={compactMode ? 75 : 100}
            css={`
              flex-shrink: 0;
            `}
          />
          <div
            css={`
              flex: 1;
              padding-left: ${3 * GU}px;
            `}
          >
            <h3
              css={`
                font-size: ${compactMode ? 24 : 28}px;
                font-weight: ${fontWeight.medium};
                line-height: 1.3;
                margin-bottom: ${1 * GU}px;
              `}
            >
              ANT{tokenVersion}
            </h3>
            <ButtonBase
              href={etherscanUrl}
              css={`
                display: inline-flex;
                align-items: center;
                text-decoration: none;
                border-radius: ${radius.medium};
                padding: ${1.25 * GU}px ${1.75 * GU}px;
                background-color: ${theme.tagIndicator};
                line-height: 1;
              `}
            >
              {shortenAddress(tokenAddress, compactMode ? 4 : 6)}
              <IconExternal
                size="small"
                css={`
                  margin-top: -2px;
                  margin-left: ${0.5 * GU}px;
                `}
              />
            </ButtonBase>
          </div>
        </div>
      </div>
      <div
        css={`
          font-size: 18px;
          line-height: 1;
        `}
      >
        {accountConnected ? (
          <ul>
            <BalanceItem
              title="Wallet balance"
              amount={balance}
              compactMode={compactMode}
              version={tokenVersion}
            />

            {showLpBalance &&
              (lpInfoAvailable ? (
                <BalanceItem
                  title={lpModalButton}
                  amount={lpTotalBalance}
                  skeletonWidth={18 * GU}
                  compactMode={compactMode}
                  version={tokenVersion}
                />
              ) : (
                <span
                  css={`
                    color: ${theme.contentSecondary};
                  `}
                >
                  {/* TODO: Potentially remove this, though I can't imagine we'd have any external visitors to our staging deploy */}
                  Distribution unavailable on Rinkeby
                </span>
              ))}
          </ul>
        ) : (
          <p
            css={`
              color: ${theme.contentSecondary};
            `}
          >
            Enable account to see your balance
          </p>
        )}
      </div>
    </div>
  )
}

type BalanceItemType = {
  title: ReactNode
  amount?: string | null
  skeletonWidth?: number
  compactMode: boolean
  version: 'v1' | 'v2'
}

function BalanceItem({
  title,
  amount,
  skeletonWidth = 14 * GU,
  compactMode,
  version,
}: BalanceItemType) {
  return (
    <li
      css={`
        display: flex;
        justify-content: space-between;

        flex-direction: ${compactMode ? 'column' : 'row'};

        &:not(:last-child) {
          margin-bottom: ${compactMode ? 3 * GU : 2 * GU}px;
        }
      `}
    >
      <h4
        css={`
          margin-bottom: ${compactMode ? 1.25 * GU : 0}px;
        `}
      >
        {title}
      </h4>
      {amount ? (
        <AntAmount amount={amount} version={version} />
      ) : (
        <span
          css={`
            width: 100%;
            max-width: ${skeletonWidth}px;
          `}
        >
          <LoadingSkeleton />
        </span>
      )}
    </li>
  )
}

export default BalanceCard
