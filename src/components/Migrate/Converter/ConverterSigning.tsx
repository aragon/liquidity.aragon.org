import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
// @ts-ignore
import { useLayout, GU } from '@aragon/ui'
import BrandButton from '../../BrandButton/BrandButton'
import Stepper from '../../Stepper/Stepper'
import { getMockSteps } from '../../../mock'
import SigningInfo from './SigningInfo'
import { StepHandleSignProps } from '../../Stepper/types'
import {
  useAntTokenV1Contract,
  useMigratorContract,
} from '../../../hooks/useContract'
import { networkEnvironment } from '../../../environment'
import { useMigrateState } from '../MigrateStateProvider'
import { useWallet } from '../../../providers/Wallet'
import { ContractTransaction } from 'ethers'
import PageHeading from '../../PageHeading/PageHeading'

const { contracts } = networkEnvironment

type ConverterSigningProps = {
  mockSigningSteps?: 1 | 2 | 3
}

function ConverterSigning({
  mockSigningSteps,
}: ConverterSigningProps): JSX.Element {
  const history = useHistory()
  const { layoutName } = useLayout()
  const { account } = useWallet()
  const { convertAmount, goToForm, signingConfiguration } = useMigrateState()
  const antTokenV1Contract = useAntTokenV1Contract()
  const migratorContract = useMigratorContract()
  const stackedButtons = layoutName === 'small'

  const handleBackToHome = useCallback(() => {
    history.push('/')
  }, [history])

  const migrationContractInteraction = useCallback(():
    | Promise<ContractTransaction>
    | undefined => {
    if (!convertAmount) {
      throw new Error('No amount was provided!')
    }

    // We need to call the "migrate" method directly when there is an existing
    // allowance amount, otherwise we can use "appoveAndCall" on the v1 contract
    if (signingConfiguration === 'withinAnExistingAllowance') {
      return migratorContract?.functions.migrate(convertAmount)
    }

    return antTokenV1Contract?.functions.approveAndCall(
      contracts.migrator,
      convertAmount,
      '0x'
    )
  }, [
    antTokenV1Contract,
    migratorContract,
    convertAmount,
    signingConfiguration,
  ])

  const transactionSteps = useMemo(() => {
    const steps = [
      {
        title: 'Initiate upgrade',
        descriptions: {
          waiting: 'Waiting for signature…',
          prompting: 'Sign transaction…',
          working: 'Sign transaction…',
          success: 'Transaction signed',
          error: 'An error has occured',
        },
        handleSign: async ({
          setSuccess,
          setError,
          setHash,
        }: StepHandleSignProps): Promise<void> => {
          try {
            // convertAmount should have already been validated and exist
            // per the form but we still want to check here because:
            // 1. It keeps typescript happy
            // 2. Detailed errors are a good thing
            if (!convertAmount) {
              throw new Error('No amount was provided!')
            }

            const tx = await migrationContractInteraction()

            setHash(tx ? tx.hash : '')
            setSuccess()
          } catch (err) {
            console.error(err)
            setError()
          }
        },
      },
    ]

    // When the requested migration amount exceeds an existing allowance we need to add a step
    // to reset it to 0 before using "approveAndCall"
    if (signingConfiguration === 'requiresReset') {
      steps.unshift({
        title: 'Approve',
        descriptions: {
          waiting: 'Waiting for signature…',
          prompting: 'Sign transaction…',
          working: 'Transaction mining…',
          success: 'Transaction mined',
          error: 'An error has occured',
        },
        handleSign: async ({
          setSuccess,
          setWorking,
          setError,
          setHash,
        }: StepHandleSignProps): Promise<void> => {
          try {
            const tx = await antTokenV1Contract?.functions.approve(
              contracts.migrator,
              '0'
            )

            setWorking()

            setHash(tx ? tx.hash : '')

            // We must wait for the approval tx to be mined before the next migration
            // step can verify as valid
            await tx?.wait()

            setSuccess()
          } catch (err) {
            console.error(err)
            setError()
          }
        },
      })
    }

    return steps
  }, [
    antTokenV1Contract,
    convertAmount,
    signingConfiguration,
    migrationContractInteraction,
  ])
  return (
    <>
      <PageHeading
        title="Aragon Upgrade"
        description="Upgrading your ANTv1"
        css={`
          margin-bottom: ${7 * GU}px;
        `}
      />
      <Stepper
        steps={
          mockSigningSteps ? getMockSteps(mockSigningSteps) : transactionSteps
        }
        renderInfo={({ stepperStatus, handleSign }) => (
          <div
            css={`
              margin-top: ${4 * GU}px;
              margin-left: auto;
              margin-right: auto;
              max-width: ${70 * GU}px;
            `}
          >
            <div
              css={`
                margin-bottom: ${4 * GU}px;
              `}
            >
              {stepperStatus === 'error' ? (
                <div
                  css={`
                    display: grid;
                    grid-gap: ${1 * GU}px;
                    grid-template-columns: ${stackedButtons
                      ? 'auto'
                      : '1fr 1fr'};
                  `}
                >
                  <BrandButton wide onClick={goToForm}>
                    Abandon process
                  </BrandButton>
                  <BrandButton
                    mode="strong"
                    onClick={handleSign}
                    wide
                    // Cover edge case where a user rejects signing and disconnects the account
                    disabled={!account}
                  >
                    Repeat transaction
                  </BrandButton>
                </div>
              ) : (
                <BrandButton
                  onClick={handleBackToHome}
                  disabled={stepperStatus === 'working'}
                  wide
                  css={`
                    max-width: ${30 * GU}px;
                    margin: auto;
                  `}
                >
                  Back to Migrate
                </BrandButton>
              )}
            </div>
            <SigningInfo
              status={stepperStatus}
              multipleTransactions={signingConfiguration === 'requiresReset'}
            />
          </div>
        )}
        css={`
          width: 100%;
        `}
      />
    </>
  )
}

export default ConverterSigning
