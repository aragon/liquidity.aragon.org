import { ENV_VARS } from './variables'
import { getNetworkConfig } from './networks'
import { EnvNetworkName, EnvVariables } from './types'

export function envVar(name: keyof EnvVariables): string {
  const envVar = ENV_VARS[name]
  return envVar()
}

function getNetworkEnvironment(environment: EnvNetworkName) {
  const preset = getNetworkConfig(environment)

  return {
    ...preset,
    ipfsGateway: envVar('IPFS_GATEWAY') || preset.ipfsGateway,
  }
}

export function getEnvNetworkType(): EnvNetworkName {
  return ENV_VARS.NETWORK_ENVIRONMENT() as EnvNetworkName
}

export const networkEnvironment = getNetworkEnvironment(getEnvNetworkType())
