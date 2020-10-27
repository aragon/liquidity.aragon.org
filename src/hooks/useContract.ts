import { useMemo } from 'react'
import {
  Contract as EthersContract,
  providers as Providers,
  Signer,
} from 'ethers'
import { Provider } from '@ethersproject/providers'
import { useWallet } from '../providers/Wallet'
import { networkEnvironment } from '../environment'
import tokenAntV1Abi from '../abi/token-ant-v1.json'
import tokenAntV2Abi from '../abi/token-ant-v1.json'
import migratorAbi from '../abi/migrator.json'
import uniswapPoolAbi from '../abi/uniswap-pool.json'
import incentivePoolAbi from '../abi/incentive-pool.json'
import balancerPoolAbi from '../abi/balancer-pool.json'
import { TokenAntV1 } from '../abi/types/TokenAntV1'
import { TokenAntV2 } from '../abi/types/TokenAntV2'
import { Migrator } from '../abi/types/Migrator'
import { UniswapPool } from '../abi/types/UniswapPool'
import { IncentivePool } from '../abi/types/IncentivePool'
import { BalancerPool } from '../abi/types/BalancerPool'

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

export function useMigratorContract(readOnly?: boolean): Migrator | null {
  const { migrator } = contracts

  return useContract<Migrator>({
    address: migrator,
    abi: migratorAbi,
    readOnly,
  })
}

export function useAntTokenV1Contract(readOnly?: boolean): TokenAntV1 | null {
  const { tokenAntV1 } = contracts

  return useContract<TokenAntV1>({
    address: tokenAntV1,
    abi: tokenAntV1Abi,
    readOnly,
  })
}

export function useAntTokenV2Contract(readOnly?: boolean): TokenAntV2 | null {
  const { tokenAntV2 } = contracts

  return useContract<TokenAntV2>({
    address: tokenAntV2,
    abi: tokenAntV2Abi,
    readOnly,
  })
}

export function useUniswapPoolContract(readOnly?: boolean): UniswapPool | null {
  const { antEthUniswapPool } = contracts

  return useContract<UniswapPool>({
    address: antEthUniswapPool,
    abi: uniswapPoolAbi,
    readOnly,
  })
}

export function useIncentivePoolContract(
  readOnly?: boolean
): IncentivePool | null {
  const { antUniIncentivePool } = contracts

  return useContract<IncentivePool>({
    address: antUniIncentivePool,
    abi: incentivePoolAbi,
    readOnly,
  })
}

export function useBalancerPoolContract(
  readOnly?: boolean
): BalancerPool | null {
  const { antEthBalancerPool } = contracts

  return useContract<BalancerPool>({
    address: antEthBalancerPool,
    abi: balancerPoolAbi,
    readOnly,
  })
}
