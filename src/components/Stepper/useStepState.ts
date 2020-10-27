import { Dispatch, useReducer } from 'react'
import { StepItems, StepStatus } from './types'

const INITIAL_STATUS = 'prompting'

type StepState = {
  status: StepStatus
  hash?: string
}

type Action = [
  'setHash' | 'setStatus',
  {
    status?: StepStatus
    hash?: string
    stepIndex: number
  }
]

type StepStateReturn = {
  stepState: StepState[]
  updateStep: Dispatch<Action>
  initialStepStatus: StepStatus
}

function reduceSteps(
  steps: StepState[],
  [action, { status, stepIndex, hash }]: Action
) {
  if (action === 'setHash') {
    steps[stepIndex].hash = hash
    return [...steps]
  }
  if (action === 'setStatus' && status) {
    steps[stepIndex].status = status
    return [...steps]
  }
  return steps
}

function initialState(steps: StepItems): StepState[] {
  return steps.map((_, i) => {
    return {
      status: i === 0 ? INITIAL_STATUS : 'waiting',
    }
  })
}

function useStepState(steps: StepItems): StepStateReturn {
  const [stepState, updateStep] = useReducer(reduceSteps, initialState(steps))

  return { stepState, updateStep, initialStepStatus: INITIAL_STATUS }
}

export default useStepState
