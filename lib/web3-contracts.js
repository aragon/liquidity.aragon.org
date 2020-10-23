import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  Contract as EthersContract,
  getDefaultProvider as getEthersDefaultProvider,
} from 'ethers'
import env from 'lib/environment'
import { getKnownContract } from './known-contracts'
import { getNetworkName } from 'lib/web3-utils'
import { bigNum } from './utils'
import { useWalletAugmented } from './wallet'

const contractsCache = new Map()
const readOnlyContractsCache = new Map()
const tokenDecimals = new Map([
  ['ANT', 18],
  ['UNI', 18],
])

const RETRY_EVERY = 2000

const UNISWAP_SUBGRAPH =
  'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'

const UNISWAP_QUERY = `
  query {
    pairs(where: { id: "0xfa19de406e8f5b9100e4dd5cad8a503a6d686efe" }) {
      id
      totalSupply
      reserveUSD
      token0Price
      token0 {
        symbol
        totalLiquidity
      }
      reserve0
      reserve1
      token1 {
        symbol
      }
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

export function useReadOnlyContract(name) {
  const [address, abi] = getKnownContract(name)

  if (readOnlyContractsCache.get(address)) {
    return readOnlyContractsCache.get(address)
  }

  const networkName = getNetworkName(env('CHAIN_ID')).toLowerCase()

  const defaultProvider = getEthersDefaultProvider(networkName)

  const contract = new EthersContract(address, abi, defaultProvider)

  readOnlyContractsCache.set(address, contract)

  return contract
}

export function useKnownContract(name, signer = true) {
  const [address, abi] = getKnownContract(name)
  return useContract(address, abi, signer)
}

export function useTokenDecimals(symbol) {
  return tokenDecimals.get(symbol)
}

export function useBalanceOf(contractName, address = '') {
  const { account } = useWalletAugmented()
  const [balance, setBalance] = useState(bigNum(-1))
  const tokenContract = useKnownContract(`${contractName}`)

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
      if (!cancelled && balance) {
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

export function useProvideLiquidity() {
  const antContract = useKnownContract('TOKEN_ANT')
  const [unipoolAddress] = getKnownContract('UNIPOOL')
  return async amount => {
    if (!antContract || !unipoolAddress) {
      return false
    }
    try {
      const antAllowance = await antContract.allowance(unipoolAddress)
      // If the current allowance is less than the requested allowance,
      // just raise it
      if (antAllowance.lt(amount)) {
        return await antContract.approve(unipoolAddress, amount)
      }

      // Is the requested amount higher than the current allowance?
      // If so, we need to set it down to 0 and then raise it
      if (!antAllowance.isZero(amount)) {
        const tx = await antContract.approve(unipoolAddress, '0')
        await tx.wait(1)
      }
      return antContract.approve(unipoolAddress, amount, '0x00', {
        gasLimit: 1000000,
      })
      // TODO: Actually provide liquidity
    } catch (err) {
      console.error(err)
      // TODO: Add Sentry
    }
  }
}

export function useTotalUniStaked() {
  const [loading, setLoading] = useState(false)
  const [totalUniStaked, setTotalUniStaked] = useState(bigNum(-1))
  const uniContract = useReadOnlyContract('UNIPOOL')

  useEffect(() => {
    let cancelled = false
    let retryTimer

    if (!uniContract) {
      return
    }

    const getUniSupply = async () => {
      try {
        setLoading(true)

        const uni = await uniContract.totalSupply()
        if (!cancelled) {
          setLoading(false)
          setTotalUniStaked(uni)
        }
      } catch (err) {
        if (!cancelled) {
          retryTimer = setTimeout(getUniSupply, RETRY_EVERY)
        }
      }
    }

    getUniSupply()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [uniContract])

  return useMemo(() => ({ loading, totalUniStaked }), [loading, totalUniStaked])
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
        console.log(uniStaked.toString())
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
  const uniContract = useKnownContract('TOKEN_ANT')
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
    [getApproval, unipoolContract]
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

export function useAntStaked(account) {
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
          retryTimer = setTimeout(getUniStaked, 9000)
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
          setTokenInfo(results?.data?.pairs[0])
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

  return useMemo(() => [loading, tokenInfo], [loading, tokenInfo])
}
