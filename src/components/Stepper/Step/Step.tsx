import React, { useMemo } from 'react'
import { Transition, animated } from 'react-spring/renderprops'
// @ts-ignore
import { TransactionBadge, textStyle, useTheme, RADIUS, GU } from '@aragon/ui'
import Divider from './Divider'
import { networkEnvironment } from '../../../environment'
import StatusVisual from './StatusVisual'
import { springs } from '../../../style/springs'
import { useDisableAnimation } from '../../../hooks/useDisableAnimation'
import { StepStatus } from '../types'

const AnimatedSpan = animated.span

type StepProps = {
  title: string
  desc: string
  transactionHash?: string
  number: number
  status: StepStatus
  showDivider: boolean
}

function Step({
  title,
  desc,
  status,
  number,
  transactionHash,
  showDivider,
  ...props
}: StepProps): JSX.Element {
  const theme = useTheme()
  const [animationDisabled, enableAnimation] = useDisableAnimation()

  const { visualColor, descColor } = useMemo(() => {
    const appearance = {
      waiting: {
        visualColor: theme.accent,
        descColor: theme.surfaceContentSecondary,
      },
      prompting: {
        visualColor: theme.accent,
        descColor: theme.surfaceContentSecondary,
      },
      working: {
        visualColor: theme.accent,
        descColor: theme.accent,
      },
      success: {
        visualColor: theme.positive,
        descColor: theme.positive,
      },
      error: {
        visualColor: theme.negative,
        descColor: theme.negative,
      },
    }

    const { descColor, visualColor } = appearance[status]
    return {
      visualColor: `${visualColor}`,
      descColor: `${descColor}`,
    }
  }, [status, theme])

  return (
    <>
      <div
        css={`
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;

          width: ${38 * GU}px;
        `}
        {...props}
      >
        <StatusVisual
          status={status}
          color={visualColor}
          number={number}
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        />
        <h2
          css={`
            font-size: 22px;
            line-height: 1.2;
            text-align: center;
            margin-bottom: ${1.2 * GU}px;
          `}
        >
          {status === 'error' ? 'Transaction failed' : title}
        </h2>

        <p
          css={`
            width: 100%;
            position: relative;
            text-align: center;

            ${textStyle('body1')}
            color: ${theme.surfaceContentSecondary};
            line-height: 1.2;
          `}
        >
          <Transition
            config={springs.gentle}
            items={[{ currentDesc: desc, currentColor: descColor }]}
            keys={desc} // Only animate when the description changes
            onStart={enableAnimation}
            immediate={animationDisabled}
            from={{
              opacity: 0,
              transform: `translate3d(0, ${2 * GU}px, 0)`,
            }}
            enter={{
              opacity: 1,
              transform: 'translate3d(0, 0, 0)',
            }}
            leave={{
              position: 'absolute' as const,
              opacity: 0,
              transform: `translate3d(0, -${2 * GU}px, 0)`,
            }}
            native
          >
            {(item) =>
              item &&
              ((transitionProps) => (
                <AnimatedSpan
                  css={`
                    display: flex;
                    justify-content: center;
                    left: 0;
                    top: 0;
                    width: 100%;
                    color: ${item.currentColor};
                  `}
                  style={transitionProps}
                >
                  {item.currentDesc}
                </AnimatedSpan>
              ))
            }
          </Transition>
        </p>

        <div
          css={`
            margin-top: ${2 * GU}px;
            position: relative;
            width: 100%;
          `}
        >
          <Transition
            config={springs.gentle}
            items={transactionHash}
            immediate={animationDisabled}
            from={{
              opacity: 0,
              transform: `translate3d(0, ${1 * GU}px, 0)`,
            }}
            enter={{
              opacity: 1,
              transform: 'translate3d(0, 0, 0)',
            }}
            leave={{
              position: 'absolute' as const,
              left: 0,
              bottom: 0,
              opacity: 0,
            }}
            native
          >
            {(currentHash) => (transitionProps) =>
              currentHash ? (
                <AnimatedSpan
                  style={transitionProps}
                  css={`
                    display: flex;
                    justify-content: center;
                    width: 100%;
                  `}
                >
                  <TransactionBadge
                    transaction={currentHash}
                    networkType={networkEnvironment.legacyNetworkType}
                  />
                </AnimatedSpan>
              ) : (
                <AnimatedSpan
                  style={transitionProps}
                  css={`
                    display: flex;
                    justify-content: center;
                    width: 100%;
                  `}
                >
                  <div
                    css={`
                      height: ${3 * GU}px;
                      width: ${15 * GU}px;
                      border-radius: ${RADIUS}px;
                      border: 1px dashed ${theme.border};
                    `}
                  />
                </AnimatedSpan>
              )}
          </Transition>
        </div>

        {showDivider && (
          <Divider
            color={visualColor}
            css={`
              position: absolute;
              top: ${7.5 * GU}px;
              right: 0;

              transform: translateX(50%);
            `}
          />
        )}
      </div>
    </>
  )
}

export default Step
