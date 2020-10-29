import React from 'react'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import PoolButton from './PoolButton'
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
              title="Liquidity rewards programs"
              description="Select a program to stake, withdraw, or claim your rewards"
              css={`
                margin-bottom: 60px;
              `}
            />
            <PoolButton to={PATH_UNISWAP_ANTV2_ETH} name="unipoolAntV2Eth" />
            <PoolButton
              to={PATH_BALANCER_ANTV2_USDC}
              name="balancerAntV2Usdc"
            />
            <PoolButton
              to={PATH_UNISWAP_ANT_ETH}
              name="unipoolAntV1Eth"
              finished
            />
          </div>
        </div>
      </LayoutLimiter>
    </LayoutGutter>
  )
}

export default Home
