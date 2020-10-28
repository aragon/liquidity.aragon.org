import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { theme } from './style/theme'
// @ts-ignore
import { Main } from '@aragon/ui'
import { initializeSentry } from './sentry'
import { initializeAnalytics } from './analytics'

initializeSentry()
initializeAnalytics()

ReactDOM.render(
  // Due to an issue with styled-components v5, global styles must be applied outside of <React.StrictMode/> to avoid duplicate styles inside the head.
  // As <Main/> provides us with some globals we need to ensure it sits outside.
  // See – https://github.com/styled-components/styled-components/issues/3008
  <Main
    assetsUrl="./aragon-ui/"
    layout={false}
    scrollView={false}
    theme={theme}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Main>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
