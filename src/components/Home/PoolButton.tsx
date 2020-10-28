import React, { ReactNode, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
// @ts-ignore
import { ButtonBase, GU, IconRight, useLayout, useTheme } from '@aragon/ui'

function PoolButton({
  to,
  children,
}: {
  to: string
  children: ReactNode
}): JSX.Element {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const history = useHistory()

  const compactMode = layoutName === 'small'

  const handleNavigate = useCallback(() => {
    history.push(to)
  }, [history, to])

  return (
    <div
      css={`
        position: relative;
        margin-bottom: ${GU}px;
      `}
    >
      <ButtonBase
        onClick={handleNavigate}
        css={`
          width: 100%;
          z-index: 2;
          padding: ${compactMode ? 1 * GU : 1.5 * GU}px ${4 * GU}px;
          padding-right: ${compactMode ? 4 * GU : 12 * GU}px;
          background: ${theme.surface};
          box-shadow: 0px 2px 4px rgba(26, 66, 75, 0.03), ,
            0px 10px 20px rgba(26, 66, 75, 0.06);
          border-radius: ${1.5 * GU}px;
          color: ${theme.surfaceContentSecondary};
          text-align: left;
          white-space: initial;
          transition: color 250ms ease-in-out;
        `}
      >
        {!compactMode && <ToggleButton />}
        <div>{children}</div>
      </ButtonBase>
    </div>
  )
}

function ToggleButton() {
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

export default PoolButton
