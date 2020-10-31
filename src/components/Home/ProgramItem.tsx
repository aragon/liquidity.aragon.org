import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
// @ts-ignore
import { ButtonBase, GU, IconRight, useLayout, useTheme } from '@aragon/ui'
import { shadowDepth } from '../../style/shadow'
import { radius } from '../../style/radius'
import { fontWeight } from '../../style/font'
import PoolTitle from '../PoolTitle/PoolTitle'
import { PoolName } from '../../known-liquidity-pools'

type ProgramItemProps = {
  to: string
  completed?: boolean
  name: PoolName
  title: string
  endDate?: string
}

function ProgramItem({
  to,
  completed = false,
  name,
  title,
  endDate,
}: ProgramItemProps): JSX.Element {
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
      `}
    >
      <ButtonBase
        onClick={handleNavigate}
        css={`
          width: 100%;
          font-size: inherit;
          z-index: 2;
          padding: ${3.25 * GU}px ${4.25 * GU}px;
          padding-right: ${compactMode ? 4 * GU : 12 * GU}px;
          background: ${theme.surface};
          box-shadow: ${shadowDepth.medium};
          border-radius: ${radius.high};
          text-align: left;
          white-space: initial;
          transition: color 250ms ease-in-out;
        `}
      >
        {!compactMode && <ArrowRight />}
        <PoolTitle title={title} endDate={endDate} name={name} />
        {completed && <ProgramCompleted />}
      </ButtonBase>
    </div>
  )
}

function ProgramCompleted() {
  const { layoutName } = useLayout()
  const theme = useTheme()

  const compactMode = layoutName === 'small'

  return (
    <div
      css={`
        font-size: 13px;
        position: ${compactMode ? 'initial' : 'absolute'};
        top: ${compactMode ? 'inherit' : '50%'};
        margin: auto;
        margin-top: ${compactMode ? `${1 * GU}px` : '-1em'};
        right: 110px;
        width: 182px;
        text-align: center;
      `}
    >
      <div
        css={`
          background: linear-gradient(
            282.07deg,
            ${theme.accentStart} -5.08%,
            ${theme.accentEnd} 81.4%
          );
          mix-blend-mode: normal;
          box-shadow: ${shadowDepth.low};
          border-radius: ${radius.pill};
          color: ${theme.surface};
          padding: 4px 12px;
          text-transform: uppercase;
          font-weight: ${fontWeight.semiBold};
          margin-top: ${compactMode ? `${2 * GU}px` : '0'};
        `}
      >
        Program Completed
      </div>
    </div>
  )
}

function ArrowRight() {
  const { layoutName } = useLayout()
  const theme = useTheme()

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
        color: ${theme.surfaceContentSecondary};
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

export default ProgramItem
