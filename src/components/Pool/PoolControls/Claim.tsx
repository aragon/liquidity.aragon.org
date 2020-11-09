import React, { useCallback, useMemo } from 'react'
// @ts-ignore
import { useClaimRewards } from '../../../hooks/useContract'
import { useAccountModule } from '../../Account/AccountModuleProvider'
import { usePoolBalance } from '../PoolBalanceProvider'
import { usePoolInfo } from '../PoolInfoProvider'
import { ValidationStatus } from '../types'
import ControlButton from './ControlButton'
import TotalRewardsCard from './TotalRewardsCard'

function Claim(): JSX.Element {
  const { contractGroup } = usePoolInfo()
  const { rewardsBalanceInfo } = usePoolBalance()
  const { showAccount } = useAccountModule()
  const handleClaim = useClaimRewards(contractGroup)

  const [rewardsBalance] = rewardsBalanceInfo

  const validationStatus = useMemo((): ValidationStatus => {
    if (!rewardsBalance) {
      return 'notConnected'
    }

    if (rewardsBalance.isZero()) {
      return 'noAmount'
    }

    return 'valid'
  }, [rewardsBalance])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()

      if (validationStatus === 'notConnected') {
        showAccount()
      }

      if (validationStatus === 'valid') {
        handleClaim()
      }
    },
    [showAccount, validationStatus, handleClaim]
  )

  return (
    <form onSubmit={handleSubmit}>
      <TotalRewardsCard />
      <ControlButton
        status={validationStatus}
        labels={{
          notConnected: 'Connect wallet',
          insufficientBalance: '',
          noAmount: 'No rewards to claim',
          valid: 'Claim rewards',
          loading: '',
        }}
      />
    </form>
  )
}

export default Claim
