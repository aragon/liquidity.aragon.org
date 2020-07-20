import React from 'react'
import PropTypes from 'prop-types'
import NavBar from 'components/NavBar/NavBar'
import Balance from 'components/SplitScreen/Balance'
import SplitScreen from 'components/SplitScreen/SplitScreen'
import { useWalletAugmented } from 'lib/wallet'
import { useTokenBalance } from 'lib/web3-contracts'
import { formatUnits } from 'lib/web3-utils'
import StakeModule from 'components/StakeModule/StakeModule'

export default function Unipool() {
  return (
    <div
      css={`
        position: relative;
        min-height: 100vh;
        background: #f6f9fc;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `}
    >
      <NavBar logoMode={'ant'} />
      <div>
        <StakeModule />
      </div>
    </div>
  )
}
