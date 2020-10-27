import React, { useMemo, useState } from 'react'
// @ts-ignore
import { useTheme } from '@aragon/ui'
import BrandButton from '../../BrandButton/BrandButton'
import Claim from './Claim'
import Stake from './Stake'
import Withdraw from './Withdraw'
import { radius } from '../../../style/radius'
import { shadowDepth } from '../../../style/shadow'

type TabName = 'stake' | 'withdraw' | 'claim'

function PoolControls(): JSX.Element {
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState<TabName>('withdraw')

  return (
    <div
      css={`
        padding: 50px;
        background-color: ${theme.surface};
        border-radius: ${radius.high};
        box-shadow: ${shadowDepth.high};
      `}
    >
      <Tabs
        activeTab={activeTab}
        onStakeClick={() => setActiveTab('stake')}
        onWithdrawClick={() => setActiveTab('withdraw')}
        onClaimClick={() => setActiveTab('claim')}
      />
      <div
        css={`
          display: flex;
          justify-content: flex-end;
        `}
      >
        Account balance: 243234234 UNI
      </div>

      {activeTab === 'stake' && <Stake />}
      {activeTab === 'withdraw' && <Withdraw />}
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
}

function Tabs({
  activeTab,
  onStakeClick,
  onWithdrawClick,
  onClaimClick,
}: TabsProps): JSX.Element {
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
    <div
      css={`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 10px;
      `}
    >
      {items.map(({ key, label, onClick }) => {
        const isActiveTab = key === activeTab
        return (
          <BrandButton
            key={key}
            wide
            size="large"
            onClick={onClick}
            css={`
              opacity: ${isActiveTab ? 1 : 0.5};
            `}
          >
            {label}
          </BrandButton>
        )
      })}
    </div>
  )
}

export default PoolControls
