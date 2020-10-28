import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from './components/Home/Home'
import Pool from './components/Pool/Pool'

export const PATH_UNISWAP_ANTV2_ETH = '/uniswap-antv2-eth'
export const PATH_BALANCER_ANTV2_USDC = '/balancer-antv2-usdc'
export const PATH_UNISWAP_ANT_ETH = '/uniswap-ant-eth'

export default function Routes(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route
        exact
        path={PATH_UNISWAP_ANTV2_ETH}
        render={() => <Pool name="unipoolAntV2Eth" />}
      />
      <Route
        exact
        path={PATH_BALANCER_ANTV2_USDC}
        render={() => <Pool name="balancerAntV2Usdc" />}
      />
      <Route
        exact
        path={PATH_UNISWAP_ANT_ETH}
        render={() => <Pool name="unipoolAntV1Eth" />}
      />
      <Redirect to="/" />
    </Switch>
  )
}
