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
import PageHeading from '../PageHeading/PageHeading'

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
          <div
            css={`
              padding-bottom: 60px;
            `}
          >
            <PageHeading
              title="Liquidity rewards"
              description="Choose an option to stake, withdraw, or claim your rewards"
              css={`
                margin-bottom: 60px;
              `}
            />
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
        </div>
      </LayoutLimiter>
    </LayoutGutter>
  )
}

export default Home
