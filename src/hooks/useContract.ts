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

const { endpoints, contracts } = networkEnvironment

const DEFAULT_PROVIDER = new Providers.JsonRpcProvider(endpoints.ethereum)

type ContractGroup = 'unipoolAntV1' | 'unipoolAntV2' | 'balancer'

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
): () => Promise<BigNumber> {
  const { account } = useWallet()
  const poolTokenContract = useLiquidityPoolTokenContract(contractGroup)
  const { poolContract: poolContractAddress } = contracts[contractGroup]

  return useCallback(async () => {
    try {
      if (!account) {
        throw new Error('[useAllowance] Account is not connected!')
      }

      if (!poolTokenContract) {
        throw new Error('[useAllowance] Pool token contract not loaded!')
      }

      return await poolTokenContract.allowance(account, poolContractAddress)
    } catch (err) {
      throw new Error(err)
    }
  }, [account, poolTokenContract, poolContractAddress])
}

export function useApprove(
  contractGroup: ContractGroup
): (amount: BigNumber) => Promise<ContractTransaction> {
  const poolTokenContract = useLiquidityPoolTokenContract(contractGroup)
  const { poolContract: poolContractAddress } = contracts[contractGroup]
  const getAllowance = useAllowance(contractGroup)

  return useCallback(
    async (amount: BigNumber) => {
      try {
        if (!poolTokenContract) {
          throw new Error('[useApprove] Pool token contract not loaded!')
        }

        const allowance = await getAllowance()
        // If the current allowance is less than the requested allowance,
        // just raise it
        if (allowance.lt(amount)) {
          return await poolTokenContract.approve(poolContractAddress, amount)
        }

        // Is the requested amount higher than the current allowance?
        // If so, we need to set it down to 0 and then raise it
        if (!allowance.isZero()) {
          const tx = await poolTokenContract.approve(poolContractAddress, '0')
          await tx.wait(1)
        }
        return await poolTokenContract.approve(poolContractAddress, amount)
      } catch (err) {
        throw new Error(err)
      }
    },
    [getAllowance, poolContractAddress, poolTokenContract]
  )
}

export function useStake(
  contractGroup: ContractGroup
): (amount: BigNumber) => Promise<ContractTransaction> {
  const poolContract = useLiquidityPoolContract(contractGroup)
  const getApproval = useApprove(contractGroup)

  return useCallback(
    async (amount: BigNumber) => {
      try {
        if (!poolContract) {
          throw new Error(`[useStake] Pool contract not loaded!`)
        }
        // Get approval for the amount to stake
        await getApproval(amount)
        // Then, stake it!
        return await poolContract.stake(amount, {
          gasLimit: 150000,
        })
      } catch (err) {
        throw new Error(err)
      }
    },
    [getApproval, poolContract]
  )
}

export function useWithdraw(
  contractGroup: ContractGroup
): () => Promise<ContractTransaction> {
  const poolContract = useLiquidityPoolContract(contractGroup)

  return useCallback(async () => {
    try {
      if (!poolContract) {
        throw new Error(`[useWithdraw] Pool contract not loaded!`)
      }

      return await poolContract.exit()
    } catch (err) {
      throw new Error(err)
    }
  }, [poolContract])
}

export function useClaim(
  contractGroup: ContractGroup
): () => Promise<ContractTransaction> {
  const poolContract = useLiquidityPoolContract(contractGroup)

  return useCallback(async () => {
    try {
      if (!poolContract) {
        throw new Error(`[useClaim] Pool contract not loaded!`)
      }

      return await poolContract.getReward()
    } catch (err) {
      throw new Error(err)
    }
  }, [poolContract])
}
