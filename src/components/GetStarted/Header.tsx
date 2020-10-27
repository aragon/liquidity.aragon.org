import React, { ReactNode, useState, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'

import {
  GU,
  IconArrowRight,
  IconConnect,
  useTheme,
  useLayout,
  // @ts-ignore
} from '@aragon/ui'
import { fontWeight } from '../../style/font'
import BrandButton from '../BrandButton/BrandButton'
import LayoutLimiter from '../Layout/LayoutLimiter'
import { CONVERTER_PATH } from '../../Routes'
import { useAccountBalances } from '../../providers/AccountBalances'
import { useAccountModule } from '../Account/AccountModuleProvider'

type BalanceStatus =
  | 'default'
  | 'success'
  | 'noMigrationsAvailable'
  | 'accountEnabled'

const MESSAGES: Record<BalanceStatus, ReactNode> = {
  default: (
    <>
      Use Aragon Upgrade Portal to upgrade your ANT balance to the newest
      version of the token contract. Connect your wallet to view the available
      upgrades on your&nbsp;account.
    </>
  ),
  accountEnabled: (
    <>
      Use Aragon Upgrade Portal to upgrade your ANT balance to the newest
      version of the token&nbsp;contract.
    </>
  ),
  success: (
    <>
      Success!{' '}
      <span role="img" aria-label="raised-hands">
        🙌🏼
      </span>{' '}
      <span role="img" aria-label="party">
        🎊
      </span>{' '}
      You have upgraded all your ANTv1 balance to ANTv2. This account doesn’t
      hold any more ANTv1. You can continue to upgrade ANTv1 held in a
      different&nbsp;account.
    </>
  ),
  noMigrationsAvailable: (
    <>
      There are no upgrades available for this account. Connect a different
      wallet to check if you have any ANTv1 balance to&nbsp;upgrade.
    </>
  ),
}

function Header({ ...props }: React.HTMLAttributes<HTMLElement>): JSX.Element {
  const history = useHistory()
  const theme = useTheme()
  const { showAccount } = useAccountModule()
  const { antV1, antV2 } = useAccountBalances()
  const { layoutName } = useLayout()
  const [balanceStatus, setBalanceStatus] = useState<BalanceStatus>('default')

  const compactMode = layoutName === 'small'

  const primaryButton = useMemo(() => {
    if (balanceStatus === 'accountEnabled') {
      return (
        <BrandButton
          mode="strong"
          size="large"
          onClick={() => history.push(CONVERTER_PATH)}
        >
          <>
            Upgrade ANTv1{' '}
            <IconArrowRight
              css={`
                opacity: 0.75;
                margin-left: ${1 * GU}px;
                margin-right: ${1 * GU}px;
              `}
            />{' '}
            ANTv2
          </>
        </BrandButton>
      )
    }

    if (balanceStatus === 'default') {
      return (
        <BrandButton
          mode="strong"
          size="large"
          onClick={showAccount}
          icon={<IconConnect />}
          label="Connect your wallet"
        />
      )
    }

    return (
      <BrandButton
        mode="strong"
        size="large"
        onClick={showAccount}
        icon={<IconConnect />}
        label="Connect a different wallet"
      />
    )
  }, [balanceStatus, history, showAccount])

  useEffect(() => {
    if (antV1.balance && antV2.balance) {
      if (antV1.balance.isZero() && antV2.balance.gt('0')) {
        setBalanceStatus('success')
        return
      }
      if (antV1.balance.isZero() && antV2.balance.isZero()) {
        setBalanceStatus('noMigrationsAvailable')
        return
      }

      setBalanceStatus('accountEnabled')

      return
    }

    setBalanceStatus('default')
  }, [antV1.balance, antV2.balance])

  return (
    <LayoutLimiter {...props}>
      <div
        css={`
          width: 100%;
          text-align: center;
        `}
      >
        <h3
          css={`
            font-weight: ${fontWeight.medium};
            font-size: 26px;
            background: linear-gradient(
              88.01deg,
              ${theme.accentStart} 0%,
              ${theme.accentEnd} 75%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: ${1 * GU}px;
          `}
        >
          Aragon Upgrade
        </h3>
        <h1
          css={`
            font-weight: ${fontWeight.bold};
            line-height: 1.2;
            margin-bottom: ${2.5 * GU}px;
            font-size: ${compactMode ? `44` : `54`}px;
          `}
        >
          Upgrade to ANTv2
        </h1>
        <p
          css={`
            font-weight: ${fontWeight.medium};
            font-size: ${compactMode ? `22` : `26`}px;
            color: ${theme.contentSecondary};
            margin: auto;
            margin-bottom: ${4 * GU}px;
            max-width: ${110 * GU}px;
          `}
        >
          {MESSAGES[balanceStatus]}
        </p>
        {primaryButton}
      </div>
    </LayoutLimiter>
  )
}

export default Header
