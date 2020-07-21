import React from 'react'

const MODES = new Map([
  ['info', 'rgba(0, 194, 255, 0.1)'],
  ['warning', 'rgba(247, 149, 1, 0.06)'],
])

export default function Info({
  children,
  mode = 'warning',
  padding = '8',
  isCompact,
}) {
  const modeColor = MODES.get(mode.toLowerCase())

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        width: 100%;
        border-radius: 6px;
        background: ${modeColor};
        font-size: 16px;
        margin-top: 24px;
        padding: ${padding}px;
        height: 100%;
        font-weight: 300;
        ${isCompact && `font-size: 14px;`}
      `}
    >
      {children}
    </div>
  )
}
