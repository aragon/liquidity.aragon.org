import React, { ReactNode, useCallback } from 'react'
// @ts-ignore
import { GU, Link, useTheme, useLayout } from '@aragon/ui'
import FooterLogo from './FooterLogo'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import { useHistory, useLocation } from 'react-router-dom'
import { DISCLAIMER_PATH } from '../../Routes'

const DOCS_URL = 'https://docs.aragon.org/ant/'
const COMMUNITY_URL = 'https://discord.com/invite/aragon'

const ARAGON_WEBSITE_URL = 'https://aragon.org'

function Footer(): JSX.Element {
  const location = useLocation()
  const history = useHistory()
  const theme = useTheme()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const handleDisclaimerClick = useCallback(() => {
    if (location.pathname !== DISCLAIMER_PATH) {
      history.push(DISCLAIMER_PATH)
    }
  }, [location.pathname, history])

  return (
    <footer>
      <LayoutGutter>
        <LayoutLimiter>
          <div
            css={`
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-direction: ${compactMode ? `column` : `row`};
              padding-top: ${4 * GU}px;
              padding-bottom: ${4 * GU}px;
              border-top: 1px solid ${theme.border};
            `}
          >
            <div
              css={`
                display: inline-grid;
                grid-auto-flow: column;
                grid-gap: ${compactMode ? 3 * GU : 5 * GU}px;

                margin-bottom: ${compactMode ? 2 * GU : `0`}px;
              `}
            >
              <FooterLink href={DOCS_URL}>Documentation</FooterLink>
              <FooterLink onClick={handleDisclaimerClick}>
                Disclaimer
              </FooterLink>
              <FooterLink href={COMMUNITY_URL}>Community</FooterLink>
            </div>
            <Link href={ARAGON_WEBSITE_URL}>
              <FooterLogo />
            </Link>
          </div>
        </LayoutLimiter>
      </LayoutGutter>
    </footer>
  )
}

type FooterLinkProps = {
  href?: string
  children?: ReactNode
  onClick?: () => void
}

function FooterLink({ href, children, onClick }: FooterLinkProps): JSX.Element {
  const theme = useTheme()

  return (
    <Link
      css={`
        text-decoration: none;
        color: ${theme.surfaceContentSecondary};

        &:hover {
          color: ${theme.surfaceContent};
        }
      `}
      href={href}
      onClick={onClick && onClick}
    >
      {children}
    </Link>
  )
}

export default Footer
