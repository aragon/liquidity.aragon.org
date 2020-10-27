import React, { useEffect, useState } from 'react'
import { animated, Transition } from 'react-spring/renderprops'
import {
  GU,
  // @ts-ignore
} from '@aragon/ui'
import { useMigrateState } from '../MigrateStateProvider'
import ConverterForm from './ConverterForm'
import ConverterSigning from './ConverterSigning'
import { springs } from '../../../style/springs'
import { useDisableAnimation } from '../../../hooks/useDisableAnimation'

const AnimatedDiv = animated.div

function Converter(): JSX.Element {
  const { conversionStage } = useMigrateState()
  const [direction, setDirection] = useState<1 | -1>(-1)
  const [animationDisabled, enableAnimation] = useDisableAnimation()

  useEffect(() => {
    if (conversionStage === 'form') {
      setDirection(-1)
    }

    if (conversionStage === 'signing') {
      setDirection(1)
    }
  }, [conversionStage])

  return (
    <Transition
      items={conversionStage}
      config={springs.tight}
      onStart={enableAnimation}
      immediate={animationDisabled}
      from={{
        opacity: 0,
        transform: `translate3d(${15 * GU * -direction}px, 0, 0)`,
      }}
      enter={{
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
      }}
      leave={{
        opacity: 0,
        position: 'absolute' as const,
        transform: `translate3d(${15 * GU * direction}px, 0, 0)`,
      }}
      native
    >
      {(currentStage) =>
        currentStage === 'form'
          ? (animationProps) => (
              <AnimatedDiv
                style={animationProps}
                css={`
                  width: 100%;
                  max-width: ${120 * GU}px;
                `}
              >
                <ConverterForm />
              </AnimatedDiv>
            )
          : (animationProps) => (
              <AnimatedDiv
                style={animationProps}
                css={`
                  width: 100%;
                `}
              >
                <ConverterSigning />
              </AnimatedDiv>
            )
      }
    </Transition>
  )
}

export default Converter
