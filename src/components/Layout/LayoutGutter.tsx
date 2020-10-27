import React, { ReactNode } from 'react'
// @ts-ignore
import { useLayout, GU } from '@aragon/ui'

type LayoutGutterProps = {
  children?: ReactNode
  collapseWhenSmall?: boolean
}

function LayoutGutter({
  children,
  collapseWhenSmall = false,
  ...props
}: LayoutGutterProps): JSX.Element {
  const { layoutName } = useLayout()

  const smallPaddingAmount = collapseWhenSmall ? 0 : 3 * GU
  const paddingAmount =
    layoutName === 'small' ? `${smallPaddingAmount}px` : '5%'

  return (
    <div
      css={`
        padding-left: ${paddingAmount};
        padding-right: ${paddingAmount};
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export default LayoutGutter
