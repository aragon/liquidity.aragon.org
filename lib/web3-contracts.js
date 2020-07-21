import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Contract as EthersContract } from 'ethers'
import gql from 'graphql-tag'
import {
  TRADE_EXACT,
  getMarketDetails,
  getTokenReserves,
  getTradeDetails,
} from '@uniswap/sdk'
import environment from './environment'
import { getKnownContract } from './known-contracts'
import { useWalletAugmented } from './wallet'
import { bigNum } from './utils'

const contractsCache = new Map()
const tokenDecimals = new Map([
  ['ANT', 18],
  ['UNI', 18],
])

const RETRY_EVERY = 2000

const UNISWAP_SUBGRAPH =
  'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap'

const UNISWAP_QUERY = `
query {
  exchanges(where:{tokenSymbol: "ANT"}) {
    id
    tokenBalance
    tokenLiquidity
    combinedBalanceInUSD
    priceUSD
    totalUniToken
  }
}
`

export function useContract(address, abi, signer = true) {
  const { ethersProvider } = useWalletAugmented()

  if (!address || !ethersProvider) {
    return null
  }
  if (contractsCache.has(address)) {
    return contractsCache.get(address)
  }

  const contract = new EthersContract(
    address,
    abi,
    signer ? ethersProvider.getSigner() : ethersProvider
  )

  contractsCache.set(address, contract)

  return contract
}

export function useKnownContract(name, signer = true) {
  const [address, abi] = getKnownContract(name)
  return useContract(address, abi, signer)
}

export function useTokenDecimals(symbol) {
  return tokenDecimals.get(symbol)
}

export function useTokenBalance(symbol, address = '') {
  const { account } = useWalletAugmented()
  const [balance, setBalance] = useState(bigNum(-1))
  const tokenContract = useKnownContract(`TOKEN_${symbol}`)

  const cancelBalanceUpdate = useRef(null)

  const updateBalance = useCallback(() => {
    let cancelled = false

    if (cancelBalanceUpdate.current) {
      cancelBalanceUpdate.current()
      cancelBalanceUpdate.current = null
    }

    if ((!account && !address) || !tokenContract) {
      setBalance(bigNum(-1))
      return
    }

    cancelBalanceUpdate.current = () => {
      cancelled = true
    }
    const requestedAddress = address || account
    tokenContract.balanceOf(requestedAddress).then(balance => {
      if (!cancelled) {
        setBalance(balance)
      }
    })
  }, [account, address, tokenContract])

  useEffect(() => {
    // Always update the balance if updateBalance() has changed
    updateBalance()

    if ((!account && !address) || !tokenContract) {
      return
    }

    const onTransfer = (from, to, value) => {
      if (
        from === account ||
        to === account ||
        from === address ||
        to === address
      ) {
        updateBalance()
      }
    }
    tokenContract.on('Transfer', onTransfer)

    return () => {
      tokenContract.removeListener('Transfer', onTransfer)
    }
  }, [account, address, tokenContract, updateBalance])

  return balance
}

export function useUniStaked(account) {
  const [loading, setLoading] = useState(false)
  const [staked, setStaked] = useState(bigNum(-1))
  const unipoolContract = useKnownContract('UNIPOOL')

  useEffect(() => {
    let cancelled = false
    let retryTimer

    if (!unipoolContract || !account) {
      return
    }

    const getUniStaked = async () => {
      try {
        setLoading(true)
        const uniStaked = await unipoolContract.balanceOf(account)
        if (!cancelled) {
          setLoading(false)
          setStaked(uniStaked)
          retryTimer = setTimeout(getUniStaked, 3000)
        }
      } catch (err) {
        if (!cancelled) {
          retryTimer = setTimeout(getUniStaked, RETRY_EVERY)
        }
      }
    }

    getUniStaked()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [account, unipoolContract])

  return useMemo(() => ({ loading, staked }), [loading, staked])
}

export function useRewardsPaid(account) {
  const [loading, setLoading] = useState(false)
  const [staked, setStaked] = useState(bigNum(-1))
  const unipoolContract = useKnownContract('UNIPOOL')

  useEffect(() => {
    let cancelled = false
    let retryTimer

    if (!unipoolContract || !account) {
      return
    }

    const getUniStaked = async () => {
      try {
        setLoading(true)
        const uniStaked = await unipoolContract.earned(account)
        if (!cancelled) {
          setLoading(false)
          setStaked(uniStaked)
        }
      } catch (err) {
        if (!cancelled) {
          retryTimer = setTimeout(getUniStaked, RETRY_EVERY)
        }
      }
    }

    getUniStaked()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [account, unipoolContract])

  return useMemo(() => ({ loading, paid: staked }), [loading, staked])
}

export function useAllowance() {
  const { account } = useWalletAugmented()
  const uniContract = useKnownContract('TOKEN_UNI')
  const [unipoolAddress] = getKnownContract('UNIPOOL')

  return useCallback(async () => {
    try {
      if (!uniContract) {
        throw new Error('UNI contract not loaded')
      }

      return await uniContract.allowance(account, unipoolAddress)
    } catch (err) {
      throw new Error(err.message)
    }
  }, [account, uniContract, unipoolAddress])
}

export function useApprove() {
  const uniContract = useKnownContract('TOKEN_UNI')
  const [unipoolAddress] = getKnownContract('UNIPOOL')
  const getAllowance = useAllowance()

  return useCallback(
    async amount => {
      try {
        if (!uniContract) {
          throw new Error('ANT contract not loaded')
        }

        const allowance = await getAllowance()
        // If the current allowance is less than the requested allowance,
        // just raise it
        if (allowance.lt(amount)) {
          return await uniContract.approve(unipoolAddress, amount)
        }

        // Is the requested amount higher than the current allowance?
        // If so, we need to set it down to 0 and then raise it
        if (!allowance.isZero(amount)) {
          const tx = await uniContract.approve(unipoolAddress, '0')
          await tx.wait(1)
        }
        return await uniContract.approve(unipoolAddress, amount)
      } catch (err) {
        throw new Error(err.messageu)
      }
    },
    [getAllowance, uniContract, unipoolAddress]
  )
}

export function useStake() {
  const unipoolContract = useKnownContract('UNIPOOL')
  const getApproval = useApprove()

  return useCallback(
    async amount => {
      try {
        if (!unipoolContract) {
          throw new Error(
            `Can't stake due to the unipool Address not being loaded`
          )
        }
        // Get approval for the amount of UNI to stake
        await getApproval(amount)
        // Then, stake it!
        return await unipoolContract.stake(amount, {
          gasLimit: 150000,
        })
      } catch (err) {
        throw new Error(err.message)
      }
    },
    [unipoolContract, getApproval]
  )
}

export function useWithdraw() {
  const unipoolContract = useKnownContract('UNIPOOL')

  return useCallback(async () => {
    try {
      if (!unipoolContract) {
        throw new Error(
          `Can't stake due to the unipool Address not being loaded`
        )
      }

      return await unipoolContract.exit()
    } catch (err) {
      throw new Error(err)
    }
  }, [unipoolContract])
}

export function useClaim() {
  const unipoolContract = useKnownContract('UNIPOOL')

  return useCallback(async () => {
    try {
      if (!unipoolContract) {
        throw new Error(
          `Can't stake due to the unipool Address not being loaded`
        )
      }

      return await unipoolContract.getReward()
    } catch (err) {
      throw new Error(err)
    }
  }, [unipoolContract])
}

export function useTokenUniswapInfo(tokenSymbol) {
  const [tokenInfo, setTokenInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    let cancelled = false
    let retryTimer
    async function fetchTokenInfo() {
      try {
        const [tokenAddress] = getKnownContract(`TOKEN_${tokenSymbol}`)
        if (!tokenAddress) {
          throw new Error(`Unsupported token symbol: ${tokenSymbol}`)
        }
        setLoading(true)
        const opts = {
          method: 'POST',
          body: JSON.stringify({ query: UNISWAP_QUERY }),
        }
        const res = await fetch(UNISWAP_SUBGRAPH, opts)
        const results = await res.json()

        if (!results) {
          throw new Error('Could not initialize subgraph')
        }

        if (!cancelled) {
          setTokenInfo(results?.data?.exchanges[0])
          setLoading(false)
        }
      } catch (e) {
        setLoading(false)
        retryTimer = setTimeout(fetchTokenInfo, RETRY_EVERY)
      }

      return () => {
        cancelled = true
        clearTimeout(retryTimer)
      }
    }

    fetchTokenInfo()
  }, [tokenSymbol])

  return useMemo(() => [tokenInfo, loading], [loading, tokenInfo])
}

export function useTokenReserve(tokenSymbol) {
  const [tokenReserves, setTokenReserves] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    let cancelled = false
    let retryTimer
    async function fetchTokenReserve() {
      try {
        const [tokenAddress] = getKnownContract(`TOKEN_${tokenSymbol}`)
        if (!tokenAddress) {
          throw new Error(`Unsupported token symbol: ${tokenSymbol}`)
        }
        setLoading(true)

        const tokenReserves = await getTokenReserves(
          tokenAddress,
          Number(environment('CHAIN_ID'))
        )

        if (!tokenReserves) {
          throw new Error('Could not fetch reserves')
        }

        if (!cancelled) {
          const reserve = bigNum(
            tokenReserves.tokenReserve.amount.toFixed(0, 1).toString()
          )
          setTokenReserves(reserve)
          setLoading(false)
        }
      } catch (e) {
        setLoading(false)
        retryTimer = setTimeout(fetchTokenReserve, RETRY_EVERY)
      }

      return () => {
        cancelled = true
        clearTimeout(retryTimer)
      }
    }

    fetchTokenReserve()
  }, [tokenSymbol])

  return useMemo(() => [tokenReserves, loading], [loading, tokenReserves])
}
