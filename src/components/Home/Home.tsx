import React from 'react'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import PoolButton from './PoolButton'
import PoolName from './PoolName'
import {
  PATH_BALANCER_ANTV2_USDC,
  PATH_UNISWAP_ANTV2_ETH,
  PATH_UNISWAP_ANT_ETH,
} from '../../Routes'

function Home(): JSX.Element {
  return (
    <LayoutGutter>
      <LayoutLimiter size="small">
        <div
          css={`
            display: flex;
            flex-direction: column;
            justify-content: center;
          `}
        >
          <PoolButton to={PATH_UNISWAP_ANTV2_ETH}>
            <PoolName name="unipoolAntV2Eth" />
          </PoolButton>
          <PoolButton to={PATH_BALANCER_ANTV2_USDC}>
            <PoolName name="balancerAntV2Usdc" />
          </PoolButton>
          <PoolButton to={PATH_UNISWAP_ANT_ETH}>
            <PoolName name="unipoolAntV1Eth" />
          </PoolButton>
        </div>
      </LayoutLimiter>
    </LayoutGutter>
  )
}

export default Home
