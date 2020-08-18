import React, { useEffect, useState } from 'react'
import { useViewport } from 'use-viewport'
import NavBar from 'components/NavBar/NavBar'
import logoAnt from 'components/Logo/logo-ant.svg'
import StakeModule from 'components/StakeModule/StakeModule'

const SMALL_BREAKPOINT = 415

export default () => {
  const { below } = useViewport()
  const [isCompact, setIsCompact] = useState(false)
  const smallLayout = below(SMALL_BREAKPOINT)
  useEffect(() => {
    setTimeout(() => {
      setIsCompact(smallLayout)
    }, 0)
  }, [smallLayout])

  return (
    <div
      css={`
        position: relative;
        min-height: 100vh;
        background: #f6f9fc;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `}
    >
      <Banner />
      <NavBar logoMode={'ant'} />
      <StakeModule />
      <div
        css={`
          position: absolute;
          bottom: 8px;
          left: 0;
          margin-top: 24px;
          width: 100%;
          align-self: flex-end;
          color: #8398ac;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px 0 16px;
          ${isCompact &&
            `
          position: relative;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          padding: 0;
          margin-bottom: 8px;

        `}
        `}
      >
        <ul
          css={`
            display: block;
            list-style-type: none;
            margin: 0;
            padding: 0;
            > li {
              display: inline;
              margin-left: 16px;
              > a {
                color: #8398ac;
              }
            }
            > li:first-child {
              margin-left: 0;
            }
          `}
        >
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://aragon.org/"
            >
              About
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://aragon.org/token/ant"
            >
              ANT
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://wiki.aragon.org/"
            >
              Wiki
            </a>
          </li>
        </ul>
        <div
          css={`
            ${isCompact && 'margin-top: 8px;'}
          `}
        >
          Powered By <img src={logoAnt} alt="ANT Logo" width="30" />
        </div>
      </div>
    </div>
  )
}

function Banner() {
  const { below } = useViewport()
  const [isCompact, setIsCompact] = useState(false)
  const smallLayout = below(SMALL_BREAKPOINT)
  useEffect(() => {
    setTimeout(() => {
      setIsCompact(smallLayout)
    }, 0)
  }, [smallLayout])

  return (
    <div
      css={`
        position: absolute;
        width: 100%;
        height: 48px;
        left: 0px;
        top: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
          204.88deg,
          #32fff5 -103.98%,
          #01bfe3 80.13%
        );
        color: white;
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
        font-weight: 600;
        font-size: ${isCompact ? '14px' : 'auto'};
      `}
    >
      <p
        css={`
          text-align: ${isCompact ? 'center' : 'auto'};
          display: inline-block;
          align-self: center;
          margin-top: 0px;
          margin-bottom: 0px;
        `}
      >
        {' '}
        {isCompact
          ? 'The first ANT liquidity program ends this Friday.'
          : 'The first ANT Liquidity Rewards program ends on Friday, August 21.'}
        {isCompact && <br />}&nbsp;
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://aragon.org/blog/liquidity-rewards"
          css={`
            color: white;
            text-decoration: underline;
          `}
        >
          Read more
        </a>
      </p>
    </div>
  )
}
