import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
// @ts-ignore
import { Link } from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import PoolControls from './PoolControls/PoolControls'

function Pool(): JSX.Element {
  const history = useHistory()

  const handleNavigateHome = useCallback(() => {
    history.push('/')
  }, [history])

  return (
    <LayoutGutter>
      <LayoutLimiter size="extraSmall">
        <div
          css={`
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          `}
        >
          <Link onClick={handleNavigateHome}>Go back home</Link>
          <Link>Add liquidity</Link>
        </div>
        <PoolControls />
      </LayoutLimiter>
    </LayoutGutter>
  )
}

export default Pool
