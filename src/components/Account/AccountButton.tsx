import React from 'react'
import {
  EthIdenticon,
  GU,
  RADIUS,
  useTheme,
  useLayout,
  // @ts-ignore
} from '@aragon/ui'
import { useWallet } from '../../providers/Wallet'
import { shortenAddress } from '../../lib/web3-utils'
import BrandButton from '../BrandButton/BrandButton'

type AccountButtonProps = {
  onClick: () => void
}

function AccountButton({ onClick }: AccountButtonProps): JSX.Element {
  const theme = useTheme()
  const { account } = useWallet()

  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  return (
    <BrandButton
      onClick={onClick}
      css={`
        padding-right: ${compactMode ? 1 * GU : 1.75 * GU}px;
        padding-left: ${compactMode ? 1 * GU : 1.25 * GU}px;
      `}
    >
      <div
        css={`
          ${!compactMode
            ? `
            margin-right: ${1.4 * GU}px;`
            : ``}
        `}
      >
        <div
          css={`
            position: relative;
          `}
        >
          <EthIdenticon
            address={account || ''}
            radius={RADIUS}
            css={`
              display: block;
            `}
          />
          <div
            css={`
              position: absolute;
              bottom: -3px;
              right: -3px;
              width: 10px;
              height: 10px;
              background: ${theme.positive};
              border: 2px solid ${theme.surface};
              border-radius: 50%;
            `}
          />
        </div>
      </div>
      {!compactMode && shortenAddress(account)}
    </BrandButton>
  )
}

export default AccountButton
