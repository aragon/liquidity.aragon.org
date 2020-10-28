import { useCallback, useMemo } from 'react'
import {
  BigNumber,
  Contract as EthersContract,
  ContractTransaction,
  providers as Providers,
  Signer,
} from 'ethers'
import { Provider } from '@ethersproject/providers'
import { useWallet } from '../providers/Wallet'
import { networkEnvironment } from '../environment'
import liquidityPoolAbi from '../abi/liquidity-pool.json'
import liquidityPoolTokenAbi from '../abi/liquidity-pool-token.json'
import { LiquidityPool } from '../abi/types/LiquidityPool'
import { LiquidityPoolToken } from '../abi/types/LiquidityPoolToken'
import { ContractGroup } from '../environment/types'

const { endpoints, contracts } = networkEnvironment

const DEFAULT_PROVIDER = new Providers.JsonRpcProvider(endpoints.ethereum)

type UseContractProps = {
  address?: string
  abi: any
  signer?: boolean
  readOnly?: boolean
}

type ExtendedContract<T> = T & EthersContract

function getContract<T>(
  address: string,
  abi: string,
  provider: Signer | Provider = DEFAULT_PROVIDER
): T {
  return new EthersContract(address, abi, provider) as ExtendedContract<T>
}

function useContract<T>({
  address,
  abi,
  signer = true,
  readOnly = false,
}: UseContractProps): ExtendedContract<T> | null {
  const { account, ethers } = useWallet()

  return useMemo(() => {
    if (!address) {
      return null
    }

    if (readOnly) {
      return getContract(address, abi)
    }

    // Apparently .getSigner() returns a new object every time, so we use the
    // connected account as memo dependency.
    if (!ethers || !account) {
      return null
    }

    return getContract(address, abi, signer ? ethers.getSigner() : ethers)
  }, [abi, account, address, ethers, signer, readOnly])
}

export function useLiquidityPoolContract(
  contractGroup: ContractGroup,
  readOnly?: boolean
): LiquidityPool | null {
  const { poolContract } = contracts[contractGroup]

  return useContract<LiquidityPool>({
    address: poolContract,
    abi: liquidityPoolAbi,
    readOnly,
  })
}

export function useLiquidityPoolTokenContract(
  contractGroup: ContractGroup,
  readOnly?: boolean
): LiquidityPoolToken | null {
  const { lpToken } = contracts[contractGroup]

  return useContract<LiquidityPoolToken>({
    address: lpToken,
    abi: liquidityPoolTokenAbi,
    readOnly,
  })
}

export function useAllowance(
  contractGroup: ContractGroup
): () => Promise<BigNumber | null> {
  const { account } = useWallet()
  const poolTokenContract = useLiquidityPoolTokenContract(contractGroup)
  const { poolContract: poolContractAddress } = contracts[contractGroup]

  return useCallback(async () => {
    try {
      if (!account || !poolTokenContract) {
        throw new Error('[useAllowance] Account is not connected!')
      }

      return await poolTokenContract.allowance(account, poolContractAddress)
    } catch (err) {
      console.error(err)

      return null
    }
  }, [account, poolTokenContract, poolContractAddress])
}

export function useApprove(
  contractGroup: ContractGroup
): (amount: BigNumber) => Promise<ContractTransaction | null> {
  const poolTokenContract = useLiquidityPoolTokenContract(contractGroup)
  const { poolContract: poolContractAddress } = contracts[contractGroup]
  const getAllowance = useAllowance(contractGroup)

  return useCallback(
    async (amount: BigNumber) => {
      try {
        const allowance = await getAllowance()

        if (!poolTokenContract || !allowance) {
          throw new Error('[useApprove] Account not connected!')
        }

        // If the current allowance is less than the requested allowance,
        // just raise it
        if (allowance.lt(amount)) {
          return await poolTokenContract.approve(poolContractAddress, amount)
        }

        return await poolTokenContract.approve(poolContractAddress, amount)
      } catch (err) {
        console.error(err)

        return null
      }
    },
    [getAllowance, poolContractAddress, poolTokenContract]
  )
}

export function useStake(
  contractGroup: ContractGroup
): (amount: BigNumber) => Promise<ContractTransaction | null> {
  const poolContract = useLiquidityPoolContract(contractGroup)
  const getApproval = useApprove(contractGroup)

  return useCallback(
    async (amount: BigNumber) => {
      try {
        if (!poolContract) {
          throw new Error(`[useStake] Account not connected!`)
        }
        // Get approval for the amount to stake
        await getApproval(amount)
        // Then, stake it!
        return await poolContract.stake(amount, {
          gasLimit: 150000,
        })
      } catch (err) {
        console.error(err)

        return null
      }
    },
    [getApproval, poolContract]
  )
}

export function useWithdrawAllIncludingRewards(
  contractGroup: ContractGroup
): () => Promise<ContractTransaction | null> {
  const poolContract = useLiquidityPoolContract(contractGroup)

  return useCallback(async () => {
    try {
      if (!poolContract) {
        throw new Error(
          `[useWithdrawAllIncludingRewards] Account not connected!`
        )
      }

      return await poolContract.exit()
    } catch (err) {
      console.error(err)

      return null
    }
  }, [poolContract])
}

export function useWithdraw(
  contractGroup: ContractGroup
): (amount: BigNumber) => Promise<ContractTransaction | null> {
  const poolContract = useLiquidityPoolContract(contractGroup)

  return useCallback(
    async (amount: BigNumber) => {
      try {
        if (!poolContract) {
          throw new Error(`[useWithdraw] Account not connected!`)
        }

        return await poolContract.withdraw(amount)
      } catch (err) {
        console.error(err)

        return null
      }
    },
    [poolContract]
  )
}

export function useClaimRewards(
  contractGroup: ContractGroup
): () => Promise<ContractTransaction | null> {
  const poolContract = useLiquidityPoolContract(contractGroup)

  return useCallback(async () => {
    try {
      if (!poolContract) {
        throw new Error(`[useClaim] Account not connected!`)
      }

      return await poolContract.getReward()
    } catch (err) {
      console.error(err)

      return null
    }
  }, [poolContract])
}
