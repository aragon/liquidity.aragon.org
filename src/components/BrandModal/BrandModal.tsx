import React, {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
} from 'react'
import { Transition, animated } from 'react-spring/renderprops'

import {
  RootPortal,
  useTheme,
  useViewport,
  noop,
  ButtonIcon,
  IconCross,
  KEY_ESC,
  GU,
  // @ts-ignore
} from '@aragon/ui'
import { shadowDepth } from '../../style/shadow'
import { radius } from '../../style/radius'
import { rgba } from 'polished'
import { springs } from '../../style/springs'

const SPACE_AROUND = 4 * GU

const AnimatedDiv = animated.div

type BrandModalProps = {
  children: ReactNode
  onClose: () => void
  onClosed?: () => void
  visible: boolean
  width?: number
  padding?: number
}

function BrandModal({
  children,
  onClose,
  onClosed = noop,
  visible,
  width = 575,
  padding = 4 * GU,
  ...props
}: BrandModalProps): JSX.Element {
  const theme = useTheme()
  const { width: viewportWidth } = useViewport()
  const innerModalContainer = React.useRef() as MutableRefObject<HTMLDivElement>

  const modalWidth = Math.min(viewportWidth - SPACE_AROUND * 2, width)
  const scrimColor = rgba(`#${theme.disabledContent.hexColor}`, 0.3)

  const handleClickOutside = useCallback(
    (e) => {
      if (e.target && !innerModalContainer.current.contains(e.target)) {
        onClose()
      }
    },
    [innerModalContainer, onClose]
  )

  const handleEscape = useCallback(
    (e) => {
      if (e.keyCode === KEY_ESC) {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscape, true)

    return () => {
      document.removeEventListener('keydown', handleEscape, true)
    }
  }, [handleEscape])

  return (
    <RootPortal>
      <Transition
        native
        items={visible}
        from={{ opacity: 0, scale: 1.05 }}
        enter={{ opacity: 1, scale: 1 }}
        leave={{ opacity: 0, scale: 0.95 }}
        config={springs.tight}
        onDestroyed={(destroyed: boolean) => {
          destroyed && onClosed()
        }}
      >
        {(show) =>
          show &&
          (({ opacity, scale }) => (
            <AnimatedDiv
              css={`
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: auto;
                background-color: ${scrimColor};
              `}
              style={{ opacity }}
              onClick={handleClickOutside}
              {...props}
            >
              <div
                css={`
                  position: relative;
                  display: flex;
                  flex-direction: column;

                  height: 100%;
                `}
                style={{
                  pointerEvents: visible ? 'auto' : 'none',
                }}
              >
                <div
                  css={`
                    padding: ${SPACE_AROUND}px 0;
                    margin: auto;
                  `}
                >
                  <AnimatedDiv
                    role="alertdialog"
                    ref={innerModalContainer}
                    css={`
                      position: relative;
                      overflow: hidden;
                      min-width: ${360 - SPACE_AROUND * 2}px;
                      background-color: ${theme.surface};
                      box-shadow: ${shadowDepth.overlay};
                      border-radius: ${radius.high};
                    `}
                    style={{
                      padding: padding,
                      width: modalWidth,
                      // Current spring version has misaligned typings on 'interpolate'
                      // @ts-ignore
                      transform: scale.interpolate(
                        (v: number) => `scale3d(${v}, ${v}, 1)`
                      ),
                    }}
                  >
                    <div
                      css={`
                        position: relative;
                      `}
                    >
                      <ButtonIcon
                        label=""
                        css={`
                          position: absolute;
                          top: -${1 * GU}px;
                          right: -${1 * GU}px;
                          z-index: 2;
                        `}
                        onClick={onClose}
                      >
                        <IconCross
                          css={`
                            color: ${theme.surfaceContent};
                          `}
                        />
                      </ButtonIcon>
                      {children}
                    </div>
                  </AnimatedDiv>
                </div>
              </div>
            </AnimatedDiv>
          ))
        }
      </Transition>
    </RootPortal>
  )
}

export default BrandModal
