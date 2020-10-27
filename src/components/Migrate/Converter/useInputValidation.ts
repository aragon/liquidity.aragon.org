import { useMemo } from 'react'
// @ts-ignore
import TokenAmount from 'token-amount'
import { ValidationStatus } from '../types'
import { useAccountBalances } from '../../../providers/AccountBalances'
import { parseUnits } from '../../../utils/math-utils'
import { BigNumber } from 'ethers'

type InputValidationReturn = {
  parsedAmountBn: BigNumber
  formattedAmount: string
  maxAmount: string
  validationStatus: ValidationStatus
}

function useInputValidation(amount: string): InputValidationReturn {
  const { antV1 } = useAccountBalances()
  const { balance, decimals } = antV1

  const parsedAmountBn = useMemo(() => parseInputValue(amount, decimals), [
    amount,
    decimals,
  ])

  const maxAmount = useMemo((): string => {
    return new TokenAmount(balance?.toString() || '', decimals).format({
      digits: decimals,
    })
  }, [balance, decimals])

  const formattedAmount = useMemo((): string => {
    const formatted = new TokenAmount(parsedAmountBn, decimals).format({
      digits: decimals,
    })

    const [, inputDecimalString] = amount.split('.')

    const formatWhenEmpty =
      (inputDecimalString && inputDecimalString.length > decimals) ||
      formatted === '0'

    return formatWhenEmpty ? '0.0' : formatted
  }, [parsedAmountBn, decimals, amount])

  const validationStatus = useMemo((): ValidationStatus => {
    if (!balance) {
      return 'notConnected'
    }

    if (parsedAmountBn.gt(balance)) {
      return 'insufficientBalance'
    }

    if (parsedAmountBn.lte(0)) {
      return 'noAmount'
    }

    return 'valid'
  }, [parsedAmountBn, balance])

  return {
    parsedAmountBn,
    formattedAmount,
    validationStatus,
    maxAmount,
  }
}

function parseInputValue(inputValue: string, decimals: number): BigNumber {
  const trimmedValue = inputValue.trim()

  return parseUnits(trimmedValue || '0', decimals)
}

export default useInputValidation
