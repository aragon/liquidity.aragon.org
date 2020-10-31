import React, { ReactNode, useContext, useMemo } from 'react'
import {
  KNOWN_LIQUIDITY_POOLS,
  PoolAttributes,
  PoolName,
} from '../../known-liquidity-pools'

type PoolInfoContext = PoolAttributes

type PoolInfoProviderState = {
  poolName: PoolName
  children: ReactNode
}

const UsePoolInfoContext = React.createContext<PoolInfoContext | null>(null)

function PoolInfoProvider({
  children,
  poolName,
}: PoolInfoProviderState): JSX.Element {
  const liquidityPoolInfo = useMemo((): PoolAttributes => {
    return KNOWN_LIQUIDITY_POOLS.get(poolName)!
  }, [poolName])

  return (
    <UsePoolInfoContext.Provider value={liquidityPoolInfo}>
      {children}
    </UsePoolInfoContext.Provider>
  )
}

function usePoolInfo(): PoolInfoContext {
  return useContext(UsePoolInfoContext)!
}

export { PoolInfoProvider, usePoolInfo }
