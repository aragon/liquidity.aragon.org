import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from './components/Home/Home'
import Staking from './components/Staking/Staking'

export default function Routes(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path={'/staking'} render={() => <Staking />} />
      <Redirect to="/" />
    </Switch>
  )
}
