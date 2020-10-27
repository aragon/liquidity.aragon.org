import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
// @ts-ignore
import { Link } from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import PoolControls from './PoolControls/PoolControls'
import { PoolContractName } from '../../environment/types'

type PoolAttributes = {
  tokenGraphic: string
  tokenSymbol: string
  contracts: PoolContractName
  liquidityUrl?: string
}

const poolAttributes: Record<PoolContractName, PoolAttributes> = {
  unipoolAntV1: {
    tokenGraphic: '',
    tokenSymbol: '',
    contracts: 'unipoolAntV1',
  },
  unipoolAntV2: {
    tokenGraphic: '',
    tokenSymbol: '',
    contracts: 'unipoolAntV2',
    liquidityUrl:
      'https://info.uniswap.org/pair/0x9def9511fec79f83afcbffe4776b1d817dc775ae',
  },
  balancer: {
    tokenGraphic: '',
    tokenSymbol: '',
    contracts: 'balancer',
    liquidityUrl:
      'https://pools.balancer.exchange/#/pool/0xde0999ee4e4bea6fecb03bf4ebef2626942ec6f5/',
  },
}

type PoolProps = {
  name: PoolContractName
}

function Pool({ name }: PoolProps): JSX.Element {
  const history = useHistory()

  const { liquidityUrl } = poolAttributes[name]

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
          {liquidityUrl && <Link href={liquidityUrl}>Add liquidity</Link>}
        </div>
        <PoolControls />
      </LayoutLimiter>
    </LayoutGutter>
  )
}

export default Pool
