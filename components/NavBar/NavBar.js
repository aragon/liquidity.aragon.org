import React from 'react'
import PropTypes from 'prop-types'
import AccountModule from 'components/AccountModule/AccountModule'
import Logo from 'components/Logo/Logo'
import { useKnownContract } from 'lib/web3-contracts'
import { getKnownContract } from 'lib/known-contracts'

const ONE_HUNDRED_ANT = '100000000000000000000'

function useApprove() {
  const antContract = useKnownContract('TOKEN_ANT')
  const [unipoolAddress] = getKnownContract('UNIPOOL')
  return amount => {
    if (!antContract || !unipoolAddress) {
      return false
    }

    return antContract.approveAndCall(unipoolAddress, ONE_HUNDRED_ANT, '0x00', {
      gasLimit: 1000000,
    })
  }
}

function NavBar({ logoMode }) {
  const approveTokens = useApprove()

  return (
    <div
      css={`
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
        width: 100vw;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 16px 40px 0 40px;
      `}
    >
      <Logo mode={logoMode} onClick={approveTokens} />
      <AccountModule />
    </div>
  )
}

NavBar.propTypes = {
  logoMode: PropTypes.string,
}

export default NavBar
