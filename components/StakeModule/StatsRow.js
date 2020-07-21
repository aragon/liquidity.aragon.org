import React from 'react'
import TokenAmount from 'token-amount'
import styled from 'styled-components'
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
        APY:{' '}
        <span
          css={`
            color: black;
          `}
        >
          {' '}
          0.00%
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
                symbol: 'UNI',
                digits: 4,
              })}`
            : '0.00 (Not connected)'}
        </span>
      </div>
    </div>
  )
}
