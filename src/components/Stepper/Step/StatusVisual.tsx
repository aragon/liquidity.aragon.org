import React, { useMemo } from 'react'
import { Transition, animated } from 'react-spring/renderprops'
import { css, keyframes } from 'styled-components'
// @ts-ignore
import { GU, IconCheck, IconCross, textStyle, useTheme } from '@aragon/ui'
import TokenIllustration from './TokenIllustration'
import { springs } from '../../../style/springs'
import { useDisableAnimation } from '../../../hooks/useDisableAnimation'
import { StepStatus } from '../types'
import { fontWeight } from '../../../style/font'

const STATUS_ICONS: { [key: string]: any } = {
  error: IconCross,
  success: IconCheck,
}

const AnimatedDiv = animated.div

const spinAnimation = css`
  mask-image: linear-gradient(35deg, rgba(0, 0, 0, 0) 15%, rgba(0, 0, 0, 1));
  animation: ${keyframes`
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  `} 1.25s linear infinite;
`

type StatusVisualProps = {
  status: StepStatus
  color: string
  number: number
}

function StatusVisual({
  status,
  color,
  number,
  ...props
}: StatusVisualProps): JSX.Element {
  const theme = useTheme()
  const [animationDisabled, enableAnimation] = useDisableAnimation()

  const [statusIcon, illustration] = useMemo(() => {
    const Icon = STATUS_ICONS[status]

    return [
      Icon && <Icon width="30" height="30" />,
      <StepIllustration number={number} status={status} />,
    ]
  }, [status, number])

  return (
    <div
      css={`
        font-size: ${17 * GU}px;
        display: flex;
        position: relative;
        // Using 'em' units allows us to uniformly scale the graphic via 'font-size' without having to manage individual dimensions.
        width: 1em;
        height: 1em;
      `}
      {...props}
    >
      <div
        css={`
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
        `}
      >
        <div
          css={`
            position: relative;
            z-index: 1;
          `}
        >
          <div
            css={`
              position: absolute;
              bottom: -${0.5 * GU}px;
              right: -${1.25 * GU}px;
            `}
          >
            <Transition
              config={(_, state) =>
                state === 'enter' ? springs.gentle : springs.instant
              }
              items={statusIcon}
              onStart={enableAnimation}
              immediate={animationDisabled}
              from={{
                scale: 1.3,
              }}
              enter={{
                opacity: 1,
                scale: 1,
              }}
              leave={{
                position: 'absolute' as const,
                opacity: 0,
              }}
              native
            >
              {(currentStatusIcon) => (animProps) =>
                currentStatusIcon && (
                  <AnimatedDiv
                    css={`
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      border-radius: 100%;
                      padding: ${0.2 * GU}px;
                      background-color: ${theme.surface};
                      color: ${color};
                      border: 3px solid currentColor;
                      bottom: 0;
                      right: 0;
                    `}
                    style={{
                      ...animProps,
                      // Prevent rasterization artifacts by removing transform once animation has completed
                      // Current spring version has misaligned typings on 'interpolate'
                      // @ts-ignore
                      transform: animProps.scale.interpolate((scale: number) =>
                        scale !== 1 ? `scale3d(${scale}, ${scale}, 1)` : 'none'
                      ),
                    }}
                  >
                    {currentStatusIcon}
                  </AnimatedDiv>
                )}
            </Transition>
          </div>

          {illustration}
        </div>
        <div
          css={`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            border-radius: 100%;
            border: 3px solid ${status === 'waiting' ? 'transparent' : color};

            ${status === 'prompting' || status === 'working'
              ? spinAnimation
              : ''}
          `}
        />
      </div>
    </div>
  )
}

type StepIllustrationProps = {
  number: number
  status: StepStatus
}

function StepIllustration({ number, status }: StepIllustrationProps) {
  const theme = useTheme()

  const illustrationMode = useMemo(() => {
    if (status === 'error') {
      return 'negative'
    }

    if (status === 'success') {
      return 'positive'
    }

    if (status === 'working') {
      return 'active'
    }

    if (status === 'prompting') {
      return 'active'
    }

    return 'neutral'
  }, [status])

  // Keep this flag just in case we decide to use the numbered presentation again
  const renderIllustration = true

  return (
    <div
      css={`
        width: 0.825em;
        height: 0.825em;
      `}
    >
      {renderIllustration ? (
        <TokenIllustration mode={illustrationMode} index={number} />
      ) : (
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${theme.surfaceOpened};
            height: 100%;
            border-radius: 100%;
            color: ${theme.accentContent};

            ${textStyle('title3')}
            font-weight: ${fontWeight.semiBold};
          `}
        >
          {number}
        </div>
      )}
    </div>
  )
}

export default StatusVisual
