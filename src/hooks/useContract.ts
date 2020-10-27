import { useMemo } from 'react'
import {
  Contract as EthersContract,
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
