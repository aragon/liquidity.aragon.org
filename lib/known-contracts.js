import env from './environment'

import tokenAbi from './abi/token.json'
import unipoolAbi from './abi/unipool.json'

const KNOWN_CONTRACTS_BY_ENV = new Map([
  [
    '1',
    {
      TOKEN_ANT: '0x960b236A07cf122663c4303350609A66A7B288C0',
      TOKEN_UNI: '0xfa19de406e8f5b9100e4dd5cad8a503a6d686efe',
      UNIPOOL: '0xEA4D68CF86BcE59Bf2bFA039B97794ce2c43dEBC',
    },
  ],
  [
    '4',
    {
      TOKEN_UNI: '0x5991e36ce3Eaa50950AEAA6f28cCf22E3D34986e',
      TOKEN_ANT: '0x8cf8196c14A654dc8Aceb3cbb3dDdfd16C2b652D',
      UNIPOOL: '0x99C0499FBe42A8A1FFc72744b019e0dCb02a758B',
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
