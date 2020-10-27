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
      <LayoutLimiter size="small">
        <Link
          onClick={handleNavigateHome}
          css={`
            margin-bottom: 20px;
          `}
        >
          Go back home
        </Link>
        <PoolControls />
      </LayoutLimiter>
    </LayoutGutter>
  )
}

export default Pool
