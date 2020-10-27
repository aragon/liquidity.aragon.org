import { EnvNetworkName, EnvVariables } from './types'

const DEFAULT_NETWORK_ENVIRONMENT: EnvNetworkName = 'rinkeby'

export const ENV_VARS: EnvVariables = {
  NETWORK_ENVIRONMENT() {
    return (
      process.env.REACT_APP_NETWORK_ENVIRONMENT || DEFAULT_NETWORK_ENVIRONMENT
    )
  },
  IPFS_GATEWAY() {
    return process.env.REACT_APP_IPFS_GATEWAY || ''
  },
  FORTMATIC_API_KEY() {
    return process.env.REACT_APP_FORTMATIC_API_KEY || ''
  },
  PORTIS_DAPP_ID() {
    return process.env.REACT_APP_PORTIS_DAPP_ID || ''
  },
  SENTRY_DSN() {
    const dsn = process.env.REACT_APP_SENTRY_DSN || ''
    return dsn.trim()
  },
  ANALYTICS_ENABLED() {
    return process.env.REACT_APP_ANALYTICS_ENABLED || ''
  },
}
