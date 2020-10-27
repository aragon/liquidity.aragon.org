import {
  blockExplorerUrl,
  // @ts-ignore
} from '@aragon/ui'
import { networkEnvironment } from '../environment'

const { legacyNetworkType } = networkEnvironment

export function getEtherscanUrl(address: string): string {
  return blockExplorerUrl('address', address, {
    networkType: legacyNetworkType,
  })
}
