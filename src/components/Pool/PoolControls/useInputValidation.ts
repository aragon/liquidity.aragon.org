import { useMemo } from 'react'
// @ts-ignore
import TokenAmount from 'token-amount'
import { ValidationStatus } from '../types'
import { parseUnits } from '../../../utils/math-utils'
import { BigNumber } from 'ethers'

const FLOAT_REGEX = /^\d*[.]?\d*$/

type InputValidationReturn = {
  parsedAmountBn: BigNumber
  formattedAmount: string
  maxAmount: string
  validationStatus: ValidationStatus
  floatRegex: RegExp
}

type UseInputValidationProps = {
  amount: string
  balance: BigNumber | null
  decimals: number
}

function useInputValidation({
  amount,
  balance,
  decimals,
}: UseInputValidationProps): InputValidationReturn {
  const parsedAmountBn = useMemo(() => parseInputValue(amount, decimals), [
    amount,
    decimals,
  ])

  const maxAmount = useMemo((): string => {
    return new TokenAmount(balance?.toString() || '', decimals).format({
      commify: false,
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

    return formatWhenEmpty ? '0' : formatted
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
    floatRegex: FLOAT_REGEX,
  }
}

function parseInputValue(inputValue: string, decimals: number): BigNumber {
  const trimmedValue = inputValue.trim()

  return parseUnits(trimmedValue || '0', decimals)
}

export default useInputValidation
