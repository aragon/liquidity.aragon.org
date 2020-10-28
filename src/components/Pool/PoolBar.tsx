import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
// @ts-ignore
import { IconArrowLeft, useLayout } from '@aragon/ui'
import BrandButton from '../BrandButton/BrandButton'
import PoolTitle from '../Home/PoolName'
import { PoolName, usePoolInfo } from './PoolInfoProvider'

function PoolBar({ name }: { name: PoolName }): JSX.Element {
  const history = useHistory()
  const { liquidityUrl } = usePoolInfo()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const handleNavigateHome = useCallback(() => {
    history.push('/')
  }, [history])

  return (
    <div
      css={`
        display: flex;
        margin-bottom: 20px;
        flex-direction: ${compactMode ? 'column' : 'row'};
        align-items: center;
      `}
    >
      <div
        css={`
          flex: 1;
          display: flex;
          justify-content: flex-start;
        `}
      >
        <BrandButton
          icon={<IconArrowLeft />}
          label="Back"
          onClick={handleNavigateHome}
        />
      </div>
      <div
        css={`
          flex: 2;
          display: flex;
          justify-content: center;
        `}
      >
        <PoolTitle name={name} size={41} />
      </div>
      <div
        css={`
          flex: 1;
          display: flex;
          justify-content: flex-end;
        `}
      >
        {liquidityUrl && (
          <BrandButton label="Add liquidity" href={liquidityUrl} />
        )}
      </div>
    </div>
  )
}

export default PoolBar
