import React from 'react'
// @ts-ignore
import { ButtonBase, TextInput, useTheme, GU } from '@aragon/ui'
import { shadowDepth } from '../../style/shadow'
import { fontWeight } from '../../style/font'
import { radius } from '../../style/radius'

type AmountInputProps = {
  value?: string
  disableMax?: boolean
  onChange?: (event: any) => void
  onMaxClick?: () => void
  placeholder?: string
}

function AmountInput({
  value,
  onChange,
  onMaxClick,
  placeholder,
  disableMax,
}: AmountInputProps): JSX.Element {
  const theme = useTheme()
  return (
    <TextInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      wide
      adornment={
        <ButtonBase
          onClick={onMaxClick}
          disabled={disableMax}
          css={`
            padding: ${0.9 * GU}px ${1.25 * GU}px;
            background-color: white;
            box-shadow: ${shadowDepth.low};
            text-transform: uppercase;
            font-weight: ${fontWeight.medium};
            font-size: 13px;
            line-height: 1;

            opacity: ${disableMax ? '0.5' : '1'};
            color: ${disableMax ? theme.contentSecondary : theme.link};

            &:active {
              transform: translateY(1px);
            }
          `}
        >
          Max
        </ButtonBase>
      }
      adornmentPosition="end"
      adornmentSettings={{
        padding: 2 * GU,
      }}
      css={`
        font-size: 18px;
        height: 56px;
        padding-left: 20px;
        padding-right: 20px;
        border-radius: ${radius.medium};
      `}
    />
  )
}

export default AmountInput
