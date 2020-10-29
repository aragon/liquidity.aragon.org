import { BigNumber } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { ContractGroup } from '../environment/types'
import { captureErrorWithSentry } from '../sentry'
import {
  useLiquidityPoolContract,
  useLiquidityPoolTokenContract,
} from './useContract'
import { useInterval } from './useInterval'
import { useMounted } from './useMounted'

const POLL_INTERVAL = 5000

export type LoadingStatus = 'noAccount' | 'loading' | 'success' | 'error'

export function usePoolTokenBalance(
  contractGroup: ContractGroup,
  account: string | null
): [BigNumber | null, LoadingStatus] {
  const poolTokenContract = useLiquidityPoolTokenContract(contractGroup)
  const mounted = useMounted()
  const [tokenBalance, setTokenBalance] = useState<BigNumber | null>(null)
  const [status, setStatus] = useState<LoadingStatus>('noAccount')

  const getBalance = useCallback(
    async (clear) => {
      if (!poolTokenContract || !account) {
        // Clear any existing balance
        if (mounted()) {
          setStatus('noAccount')
          setTokenBalance(null)
        }
        return
      }

      try {
        if (!tokenBalance && mounted()) {
          setStatus('loading')
        }

        const balance = await poolTokenContract.balanceOf(account)

        // Avoid unnessesary re-renders by only updating value when it has actually changed
        if (mounted() && (!tokenBalance || !balance.eq(tokenBalance))) {
          setStatus('success')
          setTokenBalance(balance)
        }
      } catch (err) {
        if (mounted()) {
          setStatus('error')
        }

        captureErrorWithSentry(err)
        clear()
      }
    },
    [account, mounted, poolTokenContract, tokenBalance]
  )

  useInterval(getBalance, POLL_INTERVAL)

  return [tokenBalance, status]
}

export function usePoolStakedBalance(
  contractGroup: ContractGroup,
  account: string | null
): [BigNumber | null, LoadingStatus] {
  const poolContract = useLiquidityPoolContract(contractGroup)
  const mounted = useMounted()
  const [stakedBalance, setStakedBalance] = useState<BigNumber | null>(null)
  const [status, setStatus] = useState<LoadingStatus>('noAccount')

  const getBalance = useCallback(
    async (clear) => {
      if (!poolContract || !account) {
        // Clear any existing balance
        if (mounted()) {
          setStatus('noAccount')
          setStakedBalance(null)
        }
        return
      }

      try {
        if (!stakedBalance && mounted()) {
          setStatus('loading')
        }

        const balance = await poolContract.balanceOf(account)

        // Avoid unnessesary re-renders by only updating value when it has actually changed
        if (mounted() && (!stakedBalance || !balance.eq(stakedBalance))) {
          setStatus('success')
          setStakedBalance(balance)
        }
      } catch (err) {
        if (mounted()) {
          setStatus('error')
        }

        captureErrorWithSentry(err)
        clear()
      }
    },
    [account, mounted, poolContract, stakedBalance]
  )

  useInterval(getBalance, POLL_INTERVAL)

  return [stakedBalance, status]
}

export function useRewardsBalance(
  contractGroup: ContractGroup,
  account: string | null
): [BigNumber | null, LoadingStatus] {
  const poolContract = useLiquidityPoolContract(contractGroup)
  const mounted = useMounted()
  const [rewardsBalance, setRewardsBalance] = useState<BigNumber | null>(null)
  const [status, setStatus] = useState<LoadingStatus>('noAccount')

  const getBalance = useCallback(
    async (clear) => {
      if (!poolContract || !account) {
        // Clear any existing balance
        if (mounted()) {
          setStatus('noAccount')
          setRewardsBalance(null)
        }
        return
      }

      try {
        if (!rewardsBalance && mounted()) {
          setStatus('loading')
        }

        const balance = await poolContract.earned(account)

        // Avoid unnessesary re-renders by only updating value when it has actually changed
        if (mounted() && (!rewardsBalance || !balance.eq(rewardsBalance))) {
          setStatus('success')
          setRewardsBalance(balance)
        }
      } catch (err) {
        if (mounted()) {
          setStatus('error')
        }

        captureErrorWithSentry(err)
        clear()
      }
    },
    [account, mounted, poolContract, rewardsBalance]
  )

  useInterval(getBalance, POLL_INTERVAL)

  return [rewardsBalance, status]
}

export function usePoolTotalSupply(
  contractGroup: ContractGroup
): [BigNumber | null, LoadingStatus] {
  const poolContract = useLiquidityPoolContract(contractGroup)
  const mounted = useMounted()
  const [totalSupply, setTotalSupply] = useState<BigNumber | null>(null)
  const [status, setStatus] = useState<LoadingStatus>('noAccount')

  const getBalance = useCallback(
    async (clear) => {
      if (!poolContract) {
        // Clear any existing value
        if (mounted()) {
          setStatus('noAccount')
          setTotalSupply(null)
        }
        return
      }

      try {
        if (!totalSupply && mounted()) {
          setStatus('loading')
        }

        const currentTotalSupply = await poolContract.totalSupply()

        // Avoid unnessesary re-renders by only updating value when it has actually changed
        if (
          mounted() &&
          (!totalSupply || !currentTotalSupply.eq(totalSupply))
        ) {
          setStatus('success')
          setTotalSupply(currentTotalSupply)
        }
      } catch (err) {
        if (mounted()) {
          setStatus('error')
        }

        captureErrorWithSentry(err)
        clear()
      }
    },
    [mounted, poolContract, totalSupply]
  )

  useInterval(getBalance, POLL_INTERVAL)

  return [totalSupply, status]
}

export function usePoolRewardRate(
  contractGroup: ContractGroup
): [BigNumber | null, LoadingStatus] {
  const poolContract = useLiquidityPoolContract(contractGroup)
  const mounted = useMounted()
  const [rewardRate, setRewardRate] = useState<BigNumber | null>(null)
  const [status, setStatus] = useState<LoadingStatus>('noAccount')

  const getRewardRate = useCallback(async () => {
    if (!poolContract) {
      // Clear any existing value
      if (mounted()) {
        setStatus('noAccount')
        setRewardRate(null)
      }
      return
    }

    try {
      if (!rewardRate && mounted()) {
        setStatus('loading')
      }

      const currentTotalSupply = await poolContract.rewardRate()

      // Avoid unnessesary re-renders by only updating value when it has actually changed
      if (mounted() && (!rewardRate || !currentTotalSupply.eq(rewardRate))) {
        setStatus('success')
        setRewardRate(currentTotalSupply)
      }
    } catch (err) {
      if (mounted()) {
        setStatus('error')
      }

      captureErrorWithSentry(err)
    }
  }, [mounted, poolContract, rewardRate])

  useEffect(() => {
    if (!rewardRate) {
      getRewardRate()
    }
  }, [getRewardRate, rewardRate])

  return [rewardRate, status]
}
