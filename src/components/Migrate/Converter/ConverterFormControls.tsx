import React, { useCallback, useEffect, useState } from 'react'
import {
  ButtonBase,
  TextInput,
  Link,
  useTheme,
  useLayout,
  Info,
  IconExternal,
  GU,
  // @ts-ignore
} from '@aragon/ui'
import BrandButton from '../../BrandButton/BrandButton'
import { fontWeight } from '../../../style/font'
import { useMigrateState } from '../MigrateStateProvider'
import ConverterButton from './ConverterButton'
import useInputValidation from './useInputValidation'
import { networkEnvironment } from '../../../environment'
import { shadowDepth } from '../../../style/shadow'
import { useAccountModule } from '../../Account/AccountModuleProvider'
import { useHistory } from 'react-router-dom'
import { getEtherscanUrl } from '../../../utils/etherscan'
import { useAntTokenV1Contract } from '../../../hooks/useContract'
import { useWallet } from '../../../providers/Wallet'
import { BigNumber } from 'ethers'
import { mockPromiseLatency } from '../../../mock'
import { useMounted } from '../../../hooks/useMounted'

const FLOAT_REGEX = /^\d*[.]?\d*$/

const { contracts } = networkEnvironment

type ConverterFormControlsProps = {
  tokenSymbol: string
}

function ConverterFormControls({
  tokenSymbol,
}: ConverterFormControlsProps): JSX.Element {
  const history = useHistory()
  const [amount, setAmount] = useState('')
  const theme = useTheme()
  const { updateConvertAmount } = useMigrateState()
  const { showAccount } = useAccountModule()
  const { layoutName } = useLayout()
  const {
    formattedAmount,
    maxAmount,
    validationStatus,
    parsedAmountBn,
  } = useInputValidation(amount)
  const {
    handleCheckAllowanceAndProceed,
    allowanceCheckLoading,
  } = useCheckAllowanceAndProceed(parsedAmountBn)

  const handleNavigateHome = useCallback(() => {
    history.push('/')
  }, [history])

  const antV2ContractUrl = getEtherscanUrl(contracts.tokenAntV2)
  const stackedButtons = layoutName === 'small'

  const handleAmountChange = useCallback((event) => {
    const value = event.target.value

    if (FLOAT_REGEX.test(value)) {
      setAmount(value)
    }
  }, [])

  const handleMaxClick = useCallback(() => {
    setAmount(maxAmount)
  }, [maxAmount])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()

      if (validationStatus === 'notConnected') {
        showAccount()
      }

      if (validationStatus === 'valid') {
        handleCheckAllowanceAndProceed()
      }
    },
    [validationStatus, handleCheckAllowanceAndProceed, showAccount]
  )

  // Pass updated amount to context state for use in the signing stepper
  useEffect(() => {
    updateConvertAmount(parsedAmountBn)
  }, [parsedAmountBn, updateConvertAmount])

  return (
    <form onSubmit={handleSubmit}>
      <label
        css={`
          display: block;
        `}
      >
        <h3
          css={`
            font-weight: ${fontWeight.medium};
            margin-bottom: ${1 * GU}px;
          `}
        >
          Enter the amount you would like to upgrade
        </h3>

        <TextInput
          wide
          placeholder={`0.0 ${tokenSymbol}v1`}
          value={amount}
          onChange={handleAmountChange}
          css={`
            font-variant-numeric: tabular-nums;
            display: block;
          `}
          adornment={
            validationStatus !== 'notConnected' && (
              <ButtonBase
                onClick={handleMaxClick}
                css={`
                  padding: ${0.65 * GU}px ${1.25 * GU}px;
                  background-color: white;
                  box-shadow: ${shadowDepth.low};
                  text-transform: uppercase;
                  font-weight: ${fontWeight.medium};
                  color: ${theme.link};
                  font-size: 12px;
                  line-height: 1;

                  &:active {
                    transform: translateY(1px);
                  }
                `}
              >
                Max
              </ButtonBase>
            )
          }
          adornmentPosition="end"
          adornmentSettings={{
            padding: 1.5 * GU,
          }}
        />
      </label>
      <p
        css={`
          margin-top: ${1 * GU}px;
          color: ${theme.surfaceContentSecondary};
        `}
      >
        You will receive:{' '}
        <span
          css={`
            word-break: break-all;
            font-weight: ${fontWeight.medium};
            font-variant-numeric: tabular-nums;
            ${validationStatus === 'valid' ? `color ${theme.accent};` : ''}
          `}
        >
          {formattedAmount}
        </span>{' '}
        {tokenSymbol}v2
      </p>
      <Info
        css={`
          margin-top: ${3 * GU}px;
          margin-bottom: ${2 * GU}px;
        `}
      >
        This conversion is a one way path.{' '}
        <Link
          href={antV2ContractUrl}
          css={`
            display: inline-flex;
            align-items: center;
            text-decoration: none;
            line-height: 1;
          `}
        >
          {' '}
          Review {tokenSymbol}v2 token contract{' '}
          <IconExternal
            size="small"
            css={`
              margin-left: ${0.5 * GU}px;
            `}
          />
        </Link>
      </Info>
      <div
        css={`
          display: grid;
          grid-gap: ${1 * GU}px;

          grid-template-columns: ${stackedButtons ? 'auto' : '1fr 1fr'};
        `}
      >
        <BrandButton wide onClick={handleNavigateHome}>
          Back
        </BrandButton>
        <ConverterButton
          status={allowanceCheckLoading ? 'loading' : validationStatus}
        />
      </div>
    </form>
  )
}

function useCheckAllowanceAndProceed(parsedAmountBn: BigNumber) {
  const mounted = useMounted()
  const { account } = useWallet()
  const [allowanceCheckLoading, setAllowanceCheckLoading] = useState(false)
  const { goToSigning, changeSigningConfiguration } = useMigrateState()
  const antTokenV1Contract = useAntTokenV1Contract()

  const handleCheckAllowanceAndProceed = useCallback(async () => {
    try {
      if (!account) {
        throw new Error('No account is connected!')
      }

      if (!antTokenV1Contract) {
        throw new Error('The ANTv1 token contract is not defined!')
      }

      setAllowanceCheckLoading(true)

      // This is intentional latency to give a consistent / solid feel when the allowance response occurs very very quickly
      // Without it the flicker can feel very subtly jarring
      await mockPromiseLatency(200)

      const {
        remaining: allowanceRemaining,
      } = await antTokenV1Contract.functions.allowance(
        account,
        contracts.migrator
      )

      // Prevent async set state errors if component is unmounted before promise resolves
      if (!mounted()) {
        return
      }

      // Update the signing steps configuration based on the allowance state
      // 1: directApproveAndCall – Allow is zero and we can proceed with the happy path
      // 2: requiresReset – Upgrade amount exceeds approved allowance and must be reset
      // 3: withinAnExistingAllowance – There is an allowance, but the upgrade amount is within it so we must call the migrator contract directly
      if (allowanceRemaining.isZero()) {
        changeSigningConfiguration('directApproveAndCall')
      } else {
        if (parsedAmountBn.gt(allowanceRemaining)) {
          changeSigningConfiguration('requiresReset')
        } else {
          changeSigningConfiguration('withinAnExistingAllowance')
        }
      }

      goToSigning()
    } catch (err) {
      console.error(err)
    }
  }, [
    antTokenV1Contract,
    goToSigning,
    account,
    mounted,
    setAllowanceCheckLoading,
    changeSigningConfiguration,
    parsedAmountBn,
  ])

  return { handleCheckAllowanceAndProceed, allowanceCheckLoading }
}

export default ConverterFormControls
