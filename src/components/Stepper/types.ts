export type StepStatus =
  | 'waiting'
  | 'prompting'
  | 'working'
  | 'success'
  | 'error'
  | 'waiting'

export type StepperStatus = 'working' | 'error' | 'success'

export type StepDescriptions = Record<StepStatus, string>

export type StepHandleSignProps = {
  setPrompting: () => void
  setWorking: () => void
  setError: () => void
  setSuccess: () => void
  setHash: (hash: string) => void
}

export interface StepItem {
  title: string
  handleSign: (renderProps: StepHandleSignProps) => void
  descriptions?: StepDescriptions
}

export type StepItems = StepItem[]
