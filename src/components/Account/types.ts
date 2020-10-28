import { ExternalProvider } from '@ethersproject/providers'
import {
  Wallet,
  ChainUnsupportedError,
  ConnectionRejectedError,
  ConnectorConfigError,
  ConnectorUnsupportedError,
} from 'use-wallet'

// Providers
export type KnownProviderId =
  | 'frame'
  | 'metamask'
  | 'walletconnect'
  | 'status'
  | 'cipher'
  | 'fortmatic'
  | 'portis'
  | 'unknown'

export type ProviderConfig = {
  id: KnownProviderId
  name: string
  type: string
  image: string
  strings: Record<string, string>
}

export type Providers = {
  [key in KnownProviderId]: ProviderConfig
}

// Wallet
export type WalletProvider = ExternalProvider
export type WalletWithProvider = Wallet<WalletProvider>
export type WalletConnector = WalletWithProvider['connector']
export type WalletError =
  | ChainUnsupportedError
  | ConnectorUnsupportedError
  | ConnectionRejectedError
  | ConnectorConfigError

export type WalletConfig = {
  id: WalletConnector
  useWalletConf?: { apiKey?: string; dAppId?: string; rpcUrl?: string }
}

// Account module screens
export type ScreenId = 'providers' | 'connecting' | 'connected' | 'error'
export type ScreenConfig = {
  id: ScreenId
  title: string
}
