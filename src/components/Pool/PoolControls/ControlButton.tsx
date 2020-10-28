import React, { useMemo } from 'react'
import {
  IconConnect,
  // @ts-ignore
} from '@aragon/ui'
import BrandButton from '../../BrandButton/BrandButton'
import { ValidationStatus } from '../types'
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner'

type ButtonStatus = ValidationStatus | 'loading'
type ConverterButtonProps = {
  status: ButtonStatus
  label: string
}

function ControlButton({ status, label }: ConverterButtonProps): JSX.Element {
  const buttonMessages = useMemo((): Record<ButtonStatus, string> => {
    return {
      notConnected: 'Connect wallet',
      insufficientBalance: 'Insufficient balance',
      noAmount: 'Enter an amount',
      valid: label,
      loading: 'Loading…',
    }
  }, [label])

  const disableButton =
    status === 'insufficientBalance' ||
    status === 'noAmount' ||
    status === 'loading'

  const icon = useMemo(() => {
    if (status === 'notConnected') {
      return <IconConnect />
    }

    if (status === 'loading') {
      return <LoadingSpinner />
    }
  }, [status])

  return (
    <BrandButton
      mode="strong"
      type="submit"
      wide
      disabled={disableButton}
      size="large"
      icon={icon}
      label={buttonMessages[status]}
    />
  )
}

export default ControlButton
