import React, { ReactNode, useState, useCallback } from 'react'
// @ts-ignore
import { ButtonBase, IconRight, GU, useLayout, useTheme } from '@aragon/ui'
import { Transition, animated } from 'react-spring/renderprops'
import { fontWeight } from '../../style/font'
import { shadowDepth } from '../../style/shadow'
import { radius } from '../../style/radius'
import { springs } from '../../style/springs'

const AnimatedDiv = animated.div

type FaqProps = {
  items: [string, ReactNode][]
}

type ItemProps = {
  title: string
  description: ReactNode
}

type ToggleButtonProps = {
  opened: boolean
}

function Faq({ items }: FaqProps): JSX.Element {
  return (
    <>
      {items.map(([title, description], index) => (
        <Item key={index} title={title} description={description} />
      ))}
    </>
  )
}

function Item({ title, description }: ItemProps): JSX.Element {
  const [opened, setOpened] = useState(false)
  const theme = useTheme()
  const { layoutName } = useLayout()

  const compactMode = layoutName === 'small'

  const toggleButton = useCallback(() => {
    setOpened((opened) => !opened)
  }, [])

  return (
    <div
      css={`
        position: relative;
        margin-bottom: ${GU}px;
      `}
    >
      <ButtonBase
        onClick={toggleButton}
        css={`
          width: 100%;
          z-index: 2;
          padding: ${compactMode ? 3.5 * GU : 4 * GU}px;
          padding-right: ${12 * GU}px;
          background: ${theme.surface};
          box-shadow: ${shadowDepth.medium};
          border-radius: ${radius.high};
          color: ${opened ? theme.content : theme.surfaceContentSecondary};
          text-align: left;
          white-space: initial;
          transition: color 250ms ease-in-out;
        `}
      >
        <ToggleButton opened={opened} />
        <h4
          css={`
            font-weight: ${fontWeight.medium};
            font-size: ${compactMode ? `18` : `22`}px;
            line-height: 1.2;
          `}
        >
          {title}
        </h4>
      </ButtonBase>

      <Transition
        native
        items={opened}
        config={springs.smooth}
        from={{ height: 0, opacity: 0 }}
        enter={{ height: 'auto', opacity: 1 }}
        leave={{ height: 0, opacity: 0 }}
      >
        {(show) =>
          show &&
          (({ height, opacity }) => (
            <AnimatedDiv
              css={`
                z-index: 1;
                overflow: hidden;
                border-radius: ${radius.high};
              `}
              style={{ height }}
            >
              <div
                css={`
                  padding-top: 10px;
                  margin-bottom: 20px;
                `}
              >
                <div
                  css={`
                    border-radius: ${radius.high};
                    background-color: ${theme.surfaceSelected};
                    padding: ${3.75 * GU}px ${4.5 * GU}px ${3.2 * GU}px;
                  `}
                >
                  <AnimatedDiv
                    style={{ opacity }}
                    css={`
                      color: ${theme.surfaceContentSecondary};
                      font-size: ${compactMode ? 16 : 18}px;
                      p,
                      ul {
                        &:not(:last-child) {
                          margin-bottom: ${2.25 * GU}px;
                        }
                      }
                    `}
                  >
                    {description}
                  </AnimatedDiv>
                </div>
              </div>
            </AnimatedDiv>
          ))
        }
      </Transition>
    </div>
  )
}

function ToggleButton({ opened }: ToggleButtonProps) {
  const { layoutName } = useLayout()

  const compactMode = layoutName === 'small'

  return (
    <div
      css={`
        font-size: ${compactMode ? 5 * GU : 6.25 * GU}px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        margin-top: -0.5em;
        right: ${3.5 * GU}px;
        background-color: #dfebf766;
        border-radius: ${compactMode ? 4 * GU : 6.25 * GU}px;
        width: 1em;
        height: 1em;
        transform: rotate3d(0, 0, ${opened ? 1 : 0}, 90deg);
        transform-origin: 50% 50%;
        transition: transform 250ms ease-in-out;
      `}
    >
      <IconRight
        size={compactMode ? 'small' : 'medium'}
        css={`
          display: block;
          stroke: currentColor;
          stroke-width: 1px;
        `}
      />
    </div>
  )
}

export default Faq
