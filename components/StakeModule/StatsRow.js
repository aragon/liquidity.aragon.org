import React from 'react'
import TokenAmount from 'token-amount'
import { useWalletAugmented } from 'lib/wallet'

export default function StatsRow({ balanceUni, decimalsUni, isCompact }) {
  const { connected } = useWalletAugmented()

  return (
    <div
      css={`
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        ${isCompact &&
          `
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
          `}
      `}
    >
      <div
        css={`
          margin-top: 48px;
          color: #7893ae;
          ${isCompact &&
            `
              margin-top: 24px;
            `}
        `}
      >
        <span
          css={`
            color: black;
          `}
        >
          {' '}
        </span>
      </div>
      <div
        css={`
          color: #7893ae;
          ${isCompact &&
            `
              margin-top: 8px;
            `}
        `}
      >
        Your account’s balance:{' '}
        <span
          css={`
            color: black;
          `}
        >
          {' '}
          {connected
            ? `${TokenAmount.format(balanceUni.toString(), decimalsUni, {
                symbol: 'ANT',
                digits: 9,
              })}`
            : '0 (Not connected)'}
        </span>
      </div>
    </div>
  )
}
