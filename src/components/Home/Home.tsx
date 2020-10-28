import React, { ReactNode, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Link,
  // @ts-ignore
} from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
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
          <TempLink to={PATH_UNISWAP_ANTV2_ETH}>Uniswap (ANTv2 / ETH)</TempLink>
          <TempLink to={PATH_BALANCER_ANTV2_USDC}>
            Balancer (ANTv2 / USDC)
          </TempLink>
          <TempLink to={PATH_UNISWAP_ANT_ETH}>Uniswap (ANT / ETH)</TempLink>
        </div>
      </LayoutLimiter>
    </LayoutGutter>
  )
}

function TempLink({ to, children }: { to: string; children: ReactNode }) {
  const history = useHistory()

  const handleNavigate = useCallback(() => {
    history.push(to)
  }, [history, to])

  return (
    <Link
      onClick={handleNavigate}
      css={`
        display: block;
        padding: 20px;
      `}
    >
      {children}
    </Link>
  )
}

export default Home
