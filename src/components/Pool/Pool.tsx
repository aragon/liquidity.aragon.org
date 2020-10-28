import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
// @ts-ignore
import { Link } from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import PoolControls from './PoolControls/PoolControls'
import { PoolInfoProvider, PoolName, usePoolInfo } from './PoolInfoProvider'
import { PoolBalanceProvider } from './PoolBalanceProvider'

type PoolProps = {
  name: PoolName
}

function Pool({ name }: PoolProps): JSX.Element {
  return (
    <PoolInfoProvider poolName={name}>
      <LayoutGutter>
        <LayoutLimiter size="extraSmall">
          <PoolContent />
        </LayoutLimiter>
      </LayoutGutter>
    </PoolInfoProvider>
  )
}

function PoolContent(): JSX.Element {
  const history = useHistory()
  const { liquidityUrl, contractGroup } = usePoolInfo()

  const handleNavigateHome = useCallback(() => {
    history.push('/')
  }, [history])

  return (
    <PoolBalanceProvider contractGroup={contractGroup}>
      <>
        <div
          css={`
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          `}
        >
          <Link onClick={handleNavigateHome}>Go back home</Link>
          {liquidityUrl && <Link href={liquidityUrl}>Add liquidity</Link>}
        </div>
        <PoolControls />
      </>
    </PoolBalanceProvider>
  )
}

export default Pool
