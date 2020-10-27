import React from 'react'
// @ts-ignore
import { GU } from '@aragon/ui'

type DividerProps = {
  color: string
}

function Divider({ color, ...props }: DividerProps): JSX.Element {
  return (
    <svg
      css={`
        width: ${13 * GU}px;
      `}
      viewBox="0 0 75.75 9.53"
      {...props}
    >
      <path d="M3.75,4.76,0,9.53V0Z" fill={color} opacity="0.3" />
      <path d="M11.75,4.76,8,9.53V0Z" fill={color} opacity="0.4" />
      <path d="M19.75,4.76,16,9.53V0Z" fill={color} opacity="0.5" />
      <path d="M27.75,4.76,24,9.53V0Z" fill={color} opacity="0.6" />
      <path d="M35.75,4.76,32,9.53V0Z" fill={color} opacity="0.7" />
      <path d="M43.75,4.76,40,9.53V0Z" fill={color} opacity="0.8" />
      <path d="M51.75,4.76,48,9.53V0Z" fill={color} />
      <path d="M59.75,4.76,56,9.53V0Z" fill={color} />
      <path d="M67.75,4.76,64,9.53V0Z" fill={color} />
      <path d="M75.75,4.76,72,9.53V0Z" fill={color} />
    </svg>
  )
}

export default Divider
