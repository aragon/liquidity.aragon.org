import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTransition, animated } from 'react-spring'

import logo from './logo.svg'
import logoAnt from './logo-ant.svg'
import logoAnj from './logo-anj.svg'
import uniswapSvg from '../Input/assets/uniswap.svg'

function getImage(mode) {
  if (mode === 'ant') {
    return logoAnt
  }
  if (mode === 'anj') {
    return logoAnj
  }
  if (mode === 'uni') {
    return uniswapSvg
  }
  return logo
}

function Logo({
  label = 'Aragon Bonding Curve Converter',
  onClick = () => {},
  mode = 'normal',
  mini = false,
}) {
  // Don’t animate initially
  const animate = useRef(false)
  useEffect(() => {
    animate.current = true
  }, [])

  const modeTransition = useTransition(mode, null, {
    immediate: !animate.current,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      mass: 0.1,
      tension: 120,
      friction: 14,
    },
  })

  return (
    <button
      onClick={onClick}
      css={`
        position: relative;
        display: flex;
        width: 68px;
        height: 68px;
        padding: 0;
        white-space: nowrap;
        border: 0;
        cursor: pointer;
        outline: 0 !important;
        background: transparent;
        &::-moz-focus-inner {
          border: 0;
        }
        &:active {
          transform: translateY(1px);
        }
        ${mini &&
          `
          width: 32px;
          height: 32px;
        `}
      `}
    >
      {modeTransition.map(({ item: mode, key, props: { opacity } }) => (
        <animated.img
          key={key}
          alt={label}
          src={getImage(mode)}
          style={{ opacity }}
          css={`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          `}
        />
      ))}
    </button>
  )
}

Logo.propTypes = {
  label: PropTypes.string,
  mode: PropTypes.oneOf(['ant', 'anj', 'normal', 'uni']),
  onClick: PropTypes.func,
}

export default Logo
