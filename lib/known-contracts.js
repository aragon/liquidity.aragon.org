import env from './environment'

import tokenAbi from './abi/token.json'
import unipoolAbi from './abi/unipool.json'

const KNOWN_CONTRACTS_BY_ENV = new Map([
  [
    '1',
    {
      TOKEN_ANT: '0x960b236A07cf122663c4303350609A66A7B288C0',
      TOKEN_UNI: '0xfa19de406e8f5b9100e4dd5cad8a503a6d686efe',
    },
  ],
  [
    '4',
    {
      UNIPOOL: '0x18336263856f8A50C5C293450B2321f3687D0DD9',
      TOKEN_UNI: '0x5991e36ce3Eaa50950AEAA6f28cCf22E3D34986e',
      TOKEN_ANT: '0x8cf8196c14A654dc8Aceb3cbb3dDdfd16C2b652D',
    },
  ],
])

const ABIS = new Map([
  ['TOKEN_ANT', tokenAbi],
  ['TOKEN_UNI', tokenAbi],
  ['UNIPOOL', unipoolAbi],
])

export function getKnownAbi(name) {
  return ABIS.get(name)
}

export function getKnownContract(name) {
  const knownContracts = KNOWN_CONTRACTS_BY_ENV.get(env('CHAIN_ID')) || {}
  return [knownContracts[name] || null, getKnownAbi(name) || []]
}

export default KNOWN_CONTRACTS_BY_ENV
