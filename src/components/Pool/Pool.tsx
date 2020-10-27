import React from 'react'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import PoolControls from './PoolControls/PoolControls'

function Pool(): JSX.Element {
  return (
    <LayoutGutter>
      <LayoutLimiter size="small">
        <PoolControls />
      </LayoutLimiter>
    </LayoutGutter>
  )
}

export default Pool
