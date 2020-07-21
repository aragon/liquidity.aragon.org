import { useEffect, useRef, useState, useCallback } from 'react'
import { Contract as EthersContract } from 'ethers'
import { getKnownContract } from './known-contracts'
import { useWalletAugmented } from './wallet'
import { bigNum } from './utils'

const contractsCache = new Map()
const tokenDecimals = new Map([
  ['ANT', 18],
  ['UNI', 18],
])

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
        console.log('threw on approve', err)
        throw new Error(err.messageu)
      }
    },
    [uniContract, unipoolAddress]
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
        console.log('threw on stake', err)
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
