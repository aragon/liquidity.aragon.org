import React from 'react'
// @ts-ignore
import { ButtonBase, TextInput, useTheme, GU } from '@aragon/ui'
import { shadowDepth } from '../../style/shadow'
import { fontWeight } from '../../style/font'

type AmountInputProps = {
  value?: string
  showMax?: boolean
  onChange?: (event: any) => void
  onMaxClick?: () => void
  placeholder?: string
}

function AmountInput({
  value,
  onChange,
  onMaxClick,
  placeholder,
  showMax,
}: AmountInputProps): JSX.Element {
  const theme = useTheme()
  return (
    <TextInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      wide
      adornment={
        showMax && (
          <ButtonBase
            onClick={onMaxClick}
            css={`
              padding: ${0.65 * GU}px ${1.25 * GU}px;
              background-color: white;
              box-shadow: ${shadowDepth.low};
              text-transform: uppercase;
              font-weight: ${fontWeight.medium};
              color: ${theme.link};
              font-size: 12px;
              line-height: 1;

              &:active {
                transform: translateY(1px);
              }
            `}
          >
            Max
          </ButtonBase>
        )
      }
      adornmentPosition="end"
      adornmentSettings={{
        padding: 1.5 * GU,
      }}
    />
  )
}

export default AmountInput
