import React, { AllHTMLAttributes, ReactNode } from 'react'
// @ts-ignore
import { Button, useTheme, GU } from '@aragon/ui'
import { shadowDepth } from '../../style/shadow'
import { fontWeight } from '../../style/font'
import { radius } from '../../style/radius'
import { css } from 'styled-components'

type NativeButtonProps = AllHTMLAttributes<HTMLButtonElement>

type BrandButtonProps = {
  mode?: 'normal' | 'strong' | 'positive' | 'negative'
  disabled?: boolean
  display?: 'auto' | 'all' | 'icon' | 'label'
  size?: 'large' | 'medium' | 'small' | 'mini'
  type?: NativeButtonProps['type']
  onClick?: NativeButtonProps['onClick']
  wide?: boolean
  label?: ReactNode
  icon?: ReactNode
  children?: ReactNode
}

function BrandButton({
  mode = 'normal',
  disabled = false,
  display = 'auto',
  size = 'medium',
  icon,
  wide,
  children,
  label,
  ...props
}: BrandButtonProps): JSX.Element {
  const theme = useTheme()

  return (
    <Button
      mode={mode}
      disabled={disabled}
      display={display}
      label={label}
      icon={icon}
      // Aragon UI deprecated large, so we shouldn't pass it
      // Instead we apply our own styles directly in this component
      size={size === 'large' ? 'medium' : size}
      wide={wide}
      css={`
        border: 0;
        border-radius: ${radius.medium};

        font-weight: ${fontWeight.medium};
        ${!disabled ? `box-shadow: ${shadowDepth.low};` : ''}
        ${!disabled && mode === 'strong'
          ? `background: linear-gradient(135deg, ${theme.accentEnd} 0%, ${theme.accentStart} 100%);`
          : ''};

        ${size === 'large' ? largeStyles : ''}
      `}
      {...props}
    >
      {children}
    </Button>
  )
}

const largeStyles = css`
  height: ${6 * GU}px;
  font-size: 18px;
  font-weight: ${fontWeight.semiBold};
`

export default BrandButton
