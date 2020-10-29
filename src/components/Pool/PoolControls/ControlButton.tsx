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
  labels: Record<ButtonStatus, string>
}

function ControlButton({ labels, status }: ConverterButtonProps): JSX.Element {
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
      label={labels[status]}
      css={`
        margin-top: 30px;
      `}
    />
  )
}

export default ControlButton
