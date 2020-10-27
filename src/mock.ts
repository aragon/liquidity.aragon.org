import { BigNumber } from 'ethers'
import {
  StepHandleSignProps,
  StepItem,
  StepItems,
} from './components/Stepper/types'
import { parseUnits } from './utils/math-utils'

export const MOCK_HASH =
  '0xaa1eff68a2d66769c0bf51f28ed4d9c7723805d2c253ecfc898d31977e8c92b7'

export const MOCK_UNISWAP_POOL_ACCOUNT =
  '0x5a168ccbc4754fbaf66a2f1d5d3e28acf45a542b'

export const MOCK_BALANCER_POOL_ACCOUNT =
  '0x307B543b90F0B5D83B90994B6ba83927d8B28A41'

export const MOCK_INCENTIVE_POOL_ACCOUNT =
  '0x2aeb0d72bcda72ea0d71c00e12a64d9467026556'

export const MOCK_PARAGRAPH_CONTENT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ante mi, ultrices sed pretium quis, ultricies sed tellus. Integer a urna sit amet nisi blandit faucibus. Donec sed blandit velit, non dignissim nulla. Integer ornare sem consectetur, lacinia nibh eget, volutpat nunc.'

export const MOCK_SHORT_SUBTEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing.'

export async function mockPromiseLatency(ms: number): Promise<boolean> {
  return new Promise((resolve) => setTimeout(() => resolve(true), ms))
}

export const MOCK_LP_BALANCES: [
  'balancer' | 'uniswap' | 'incentive',
  BigNumber
][] = [
  ['balancer', parseUnits('1', 18)],
  ['uniswap', parseUnits('234.342423', 18)],
  ['incentive', parseUnits('8532', 18)],
]

const mockStepItem: StepItem = {
  title: 'Initiate upgrade',
  handleSign: async ({
    setSuccess,
    setWorking,
    setError,
    setHash,
  }: StepHandleSignProps): Promise<void> => {
    try {
      setWorking()
      await mockPromiseLatency(3000)

      setHash(MOCK_HASH)
      setSuccess()
    } catch (err) {
      console.error(err)
      setError()
    }
  },
}

export function getMockSteps(count = 1): StepItems {
  return Array(count).fill(mockStepItem)
}
