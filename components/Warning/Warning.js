import React from 'react'

export default function Warning({ children }) {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        width: 100%;
        height: 100px;
        border-radius: 6px;
        background: rgba(247, 149, 1, 0.06);
        font-size: 18px;
        margin-top: 24px;
        padding: 32px;
        font-weight: 300;
      `}
    >
      {children}
    </div>
  )
}
