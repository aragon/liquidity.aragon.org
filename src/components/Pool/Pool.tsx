import React from 'react'
// @ts-ignore
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import PoolBar from './PoolBar'
import PoolControls from './PoolControls/PoolControls'
import { PoolInfoProvider, usePoolInfo } from './PoolInfoProvider'
import { PoolBalanceProvider } from './PoolBalanceProvider'
import { PoolName } from '../../known-liquidity-pools'

type PoolProps = {
  name: PoolName
}

function Pool({ name }: PoolProps): JSX.Element {
  return (
    <PoolInfoProvider poolName={name}>
      <LayoutGutter>
        <LayoutLimiter size="extraSmall">
          <PoolContent name={name} />
        </LayoutLimiter>
      </LayoutGutter>
    </PoolInfoProvider>
  )
}

function PoolContent({ name }: { name: PoolName }): JSX.Element {
  const { contractGroup } = usePoolInfo()

  return (
    <PoolBalanceProvider contractGroup={contractGroup}>
      <>
        <PoolBar name={name} />
        <PoolControls />
      </>
    </PoolBalanceProvider>
  )
}

export default Pool
