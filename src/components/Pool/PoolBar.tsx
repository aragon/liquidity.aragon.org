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
          order: ${compactMode ? '2' : '1'};
          width: ${compactMode ? '100%' : 'auto'};
          margin-top: ${compactMode ? '20px' : '0'};
          margin-bottom: ${compactMode ? '10px' : '0'};
        `}
      >
        <BrandButton
          icon={<IconArrowLeft />}
          label="Back"
          onClick={handleNavigateHome}
          css={`
            width: ${compactMode ? '100%' : 'auto'};
          `}
        />
      </div>
      <div
        css={`
          flex: 2;
          display: flex;
          justify-content: center;
          order: ${compactMode ? '1' : '2'};
        `}
      >
        <PoolTitle name={name} size={41} />
      </div>
      <div
        css={`
          flex: 1;
          display: flex;
          justify-content: flex-end;
          order: 3;
          width: ${compactMode ? '100%' : 'auto'};
        `}
      >
        {liquidityUrl && (
          <BrandButton
            label="Add liquidity"
            href={liquidityUrl}
            css={`
              width: ${compactMode ? '100%' : 'auto'};
            `}
          />
        )}
      </div>
    </div>
  )
}

export default PoolBar
