import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
// @ts-ignore
import { IconArrowLeft, IconExternal, useLayout } from '@aragon/ui'
import BrandButton from '../BrandButton/BrandButton'
import PoolTitle from '../PoolTitle/PoolTitle'
import { usePoolInfo } from './PoolInfoProvider'
import { PoolName } from '../../known-liquidity-pools'

function PoolBar({ name }: { name: PoolName }): JSX.Element {
  const history = useHistory()
  const { liquidityUrl, title, endDate, ended } = usePoolInfo()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const handleNavigateHome = useCallback(() => {
    history.push('/')
  }, [history])

  return (
    <div
      css={`
        display: flex;
        margin-bottom: ${compactMode ? '20px' : '30px'};
        flex-direction: ${compactMode ? 'column' : 'row'};
        align-items: center;
      `}
    >
      <BrandButton
        icon={<IconArrowLeft />}
        label="Back"
        onClick={handleNavigateHome}
        css={`
          width: ${compactMode ? '100%' : 'auto'};
          order: ${compactMode ? '2' : '1'};
          margin-bottom: ${compactMode ? '10px' : '0'};
        `}
      />

      <div
        css={`
          flex: 1;
          width: 100%;
          justify-content: center;
          order: ${compactMode ? '1' : '2'};
          margin-bottom: ${compactMode ? '25px' : '0'};
        `}
      >
        <PoolTitle
          title={title}
          endDate={!ended ? endDate : ''}
          name={name}
          tokenSize={48}
        />
      </div>

      <BrandButton
        label="Add liquidity"
        icon={<IconExternal />}
        href={liquidityUrl ? liquidityUrl : ''}
        disabled={!liquidityUrl}
        css={`
          width: ${compactMode ? '100%' : 'auto'};
          order: 3;

          // To keep the layout flow we visibil
          ${!liquidityUrl ? 'opacity: 0; visibility: hidden;' : ''}
        `}
      />
    </div>
  )
}

export default PoolBar
