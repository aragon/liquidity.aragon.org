import React, { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
// @ts-ignore
import { Link, GU } from '@aragon/ui'
import AccountModule from '../Account/AccountModule'
import HeaderLogo from './HeaderLogo'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'

function Header(): JSX.Element {
  const location = useLocation()
  const history = useHistory()

  const handleLogoClick = useCallback(() => {
    if (location.pathname !== '/') {
      history.push('/')
    }
  }, [location.pathname, history])

  return (
    <header
      css={`
        padding-top: ${4 * GU}px;
      `}
    >
      <LayoutGutter>
        <LayoutLimiter>
          <div
            css={`
              height: ${8 * GU}px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            `}
          >
            <Link onClick={handleLogoClick}>
              <HeaderLogo />
            </Link>

            <AccountModule />
          </div>
        </LayoutLimiter>
      </LayoutGutter>
    </header>
  )
}

export default Header
