import 'styled-components'
import { CSSProp } from 'styled-components'
import { ExternalProvider } from '@ethersproject/providers'

// Declare type of "css" prop on elements
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31245
declare module 'react' {
  interface Attributes {
    css?: CSSProp
  }
}

// Global Metamask attached ethereum provider
declare global {
  interface Window {
    ethereum: ExternalProvider
  }
}
