import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Disclaimer from './components/Disclaimer/Disclaimer'
import GetStarted from './components/GetStarted/GetStarted'
import Migrate from './components/Migrate/Migrate'

export const CONVERTER_PATH = '/converter'
export const DISCLAIMER_PATH = '/disclaimer'

export default function Routes(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/" component={GetStarted} />
      <Route exact path={DISCLAIMER_PATH} component={Disclaimer} />
      <Route
        exact
        path={CONVERTER_PATH}
        render={() => <Migrate conversionType="ANT" />}
      />
      <Redirect to="/" />
    </Switch>
  )
}
