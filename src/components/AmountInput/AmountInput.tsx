import React from 'react'
// @ts-ignore
import { TextInput } from '@aragon/ui'

type AmountInputProps = {
  value?: string
  onChange?: () => void
  placeholder?: string
}

function AmountInput({
  value,
  onChange,
  placeholder,
}: AmountInputProps): JSX.Element {
  return (
    <TextInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      wide
    />
  )
}

export default AmountInput
