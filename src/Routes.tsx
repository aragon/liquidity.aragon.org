import React, { useMemo } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from './components/Home/Home'
import Pool from './components/Pool/Pool'
import { KNOWN_LIQUIDITY_POOLS } from './known-liquidity-pools'

export default function Routes(): JSX.Element {
  const knownPools = useMemo(
    () =>
      Array.from(KNOWN_LIQUIDITY_POOLS, ([key, value]) => ({
        name: key,
        ...value,
      })),
    []
  )

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      {knownPools.map(({ path, name }) => (
        <Route exact path={path} render={() => <Pool name={name} />} />
      ))}
      <Redirect to="/" />
    </Switch>
  )
}
