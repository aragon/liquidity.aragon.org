import { BigNumber } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { networkEnvironment } from '../environment'
import {
  MOCK_BALANCER_POOL_ACCOUNT,
  MOCK_INCENTIVE_POOL_ACCOUNT,
  MOCK_UNISWAP_POOL_ACCOUNT,
} from '../mock'
import { useWallet } from '../providers/Wallet'
import { captureErrorWithSentry } from '../sentry'
import {
  useAntTokenV1Contract,
  useAntTokenV2Contract,
  useBalancerPoolContract,
  useIncentivePoolContract,
  useUniswapPoolContract,
} from './useContract'
import { useInterval } from './useInterval'
import { useMounted } from './useMounted'

const POLL_INTERVAL = 5000

export function useIncentiveStakedBalance(
  mockedAccount?: boolean
): BigNumber | null {
  const wallet = useWallet()
  const mounted = useMounted()
  const [lastStakedBalance, setLastStakedBalance] = useState<BigNumber | null>(
    null
  )

  const account = mockedAccount ? MOCK_INCENTIVE_POOL_ACCOUNT : wallet.account
  const incentivePoolContract = useIncentivePoolContract()
  const uniswapPoolContract = useUniswapPoolContract()

  const getStakedBalance = useCallback(
    async (clear) => {
      if (!incentivePoolContract || !uniswapPoolContract || !account) {
        // Clear any residual value
        if (mounted()) {
          setLastStakedBalance(null)
        }
        return
      }

      try {
        const { balanceOf } = incentivePoolContract.functions

        const {
          totalSupply: getTotalSupply,
          getReserves,
        } = uniswapPoolContract.functions

        const [
          { 0: userBalance },
          { 0: totalSupply },
          { 0: antReserve },
        ] = await Promise.all([
          balanceOf(account),
          getTotalSupply(),
          getReserves(),
        ])

        const stakedBalance = userBalance.mul(antReserve).div(totalSupply)

        // Avoid unnessesary re-renders by only updating value when it has actually changed
        if (
          mounted() &&
          (!lastStakedBalance || !stakedBalance.eq(lastStakedBalance))
        ) {
          setLastStakedBalance(stakedBalance)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        clear()
      }
    },
    [
      account,
      mounted,
      incentivePoolContract,
      lastStakedBalance,
      uniswapPoolContract,
    ]
  )

  useInterval(getStakedBalance, POLL_INTERVAL)

  return lastStakedBalance
}

export function useUniswapStakedBalance(
  mockedAccount?: boolean
): BigNumber | null {
  const wallet = useWallet()
  const mounted = useMounted()
  const [lastStakedBalance, setLastStakedBalance] = useState<BigNumber | null>(
    null
  )

  const account = mockedAccount ? MOCK_UNISWAP_POOL_ACCOUNT : wallet.account
  const uniswapPoolContract = useUniswapPoolContract()

  const getStakedBalance = useCallback(
    async (clear) => {
      if (!uniswapPoolContract || !account) {
        // Clear any residual value
        if (mounted()) {
          setLastStakedBalance(null)
        }
        return
      }

      try {
        const {
          balanceOf,
          totalSupply: getTotalSupply,
          getReserves,
        } = uniswapPoolContract.functions

        const [
          { 0: userBalance },
          { 0: totalSupply },
          { 0: antReserve },
        ] = await Promise.all([
          balanceOf(account),
          getTotalSupply(),
          getReserves(),
        ])

        const stakedBalance = userBalance.mul(antReserve).div(totalSupply)

        // Avoid unnessesary re-renders by only updating value when it has actually changed
        if (
          mounted() &&
          (!lastStakedBalance || !stakedBalance.eq(lastStakedBalance))
        ) {
          setLastStakedBalance(stakedBalance)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        clear()
      }
    },
    [account, mounted, lastStakedBalance, uniswapPoolContract]
  )

  useInterval(getStakedBalance, POLL_INTERVAL)

  return lastStakedBalance
}

export function useBalancerStakedBalance(
  mockedAccount?: boolean
): BigNumber | null {
  const wallet = useWallet()
  const mounted = useMounted()
  const [lastStakedBalance, setLastStakedBalance] = useState<BigNumber | null>(
    null
  )

  const account = mockedAccount ? MOCK_BALANCER_POOL_ACCOUNT : wallet.account
  const balancerPoolContract = useBalancerPoolContract()

  const getStakedBalance = useCallback(
    async (clear) => {
      if (!balancerPoolContract || !account) {
        // Clear any residual value
        if (mounted()) {
          setLastStakedBalance(null)
        }
        return
      }

      try {
        const {
          balanceOf,
          totalSupply: getTotalSupply,
          getBalance,
        } = balancerPoolContract.functions

        const [
          { 0: userBalance },
          { 0: totalSupply },
          { 0: poolAntBalance },
        ] = await Promise.all([
          balanceOf(account),
          getTotalSupply(),
          getBalance(networkEnvironment.contracts.tokenAntV1),
        ])

        const stakedBalance = userBalance.mul(poolAntBalance).div(totalSupply)

        // Avoid unnessesary re-renders by only updating value when it has actually changed
        if (
          mounted() &&
          (!lastStakedBalance || !stakedBalance.eq(lastStakedBalance))
        ) {
          setLastStakedBalance(stakedBalance)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        clear()
      }
    },
    [account, mounted, lastStakedBalance, balancerPoolContract]
  )

  useInterval(getStakedBalance, POLL_INTERVAL)

  return lastStakedBalance
}

export function useAntTokenBalance(
  tokenVersion: 'v1' | 'v2',
  account: string | null,
  readOnly?: boolean
): BigNumber | null {
  const antTokenV1Contract = useAntTokenV1Contract(readOnly)
  const antTokenV2Contract = useAntTokenV2Contract(readOnly)
  const mounted = useMounted()
  const [tokenBalance, setTokenBalance] = useState<BigNumber | null>(null)

  const tokenContract = useMemo(() => {
    const contracts = {
      v1: antTokenV1Contract,
      v2: antTokenV2Contract,
    }

    return contracts[tokenVersion]
  }, [antTokenV1Contract, antTokenV2Contract, tokenVersion])

  const getBalance = useCallback(
    async (clear) => {
      if (!tokenContract || !account) {
        // Clear any existing balance
        if (mounted()) {
          setTokenBalance(null)
        }
        return
      }

      try {
        const { balance } = await tokenContract.functions.balanceOf(account)

        // Avoid unnessesary re-renders by only updating value when it has actually changed
        if (mounted() && (!tokenBalance || !balance.eq(tokenBalance))) {
          setTokenBalance(balance)
        }
      } catch (err) {
        captureErrorWithSentry(err)
        clear()
      }
    },
    [account, mounted, tokenContract, tokenBalance]
  )

  useInterval(getBalance, POLL_INTERVAL)

  return tokenBalance
}

export function useAntTotalSupply(tokenVersion: 'v1' | 'v2'): BigNumber | null {
  const antTokenV1Contract = useAntTokenV1Contract(true)
  const antTokenV2Contract = useAntTokenV2Contract(true)
  const mounted = useMounted()
  const [totalSupply, setTotalSupply] = useState<BigNumber | null>(null)

  const tokenContract = useMemo(() => {
    const contracts = {
      v1: antTokenV1Contract,
      v2: antTokenV2Contract,
    }

    return contracts[tokenVersion]
  }, [antTokenV1Contract, antTokenV2Contract, tokenVersion])

  useEffect(() => {
    const getTotalSupply = async () => {
      if (!tokenContract) {
        return
      }

      try {
        const {
          0: fetchedTotalsupply,
        } = await tokenContract.functions.totalSupply()

        if (mounted()) {
          setTotalSupply(fetchedTotalsupply)
        }
      } catch (err) {
        captureErrorWithSentry(err)
      }
    }

    getTotalSupply()
  }, [mounted, tokenContract])

  return totalSupply
}
