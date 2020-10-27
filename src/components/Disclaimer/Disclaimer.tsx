import React, { ReactNode, useCallback } from 'react'
// @ts-ignore
import { Link, useLayout, useTheme, IconArrowLeft, GU } from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import { fontWeight } from '../../style/font'
import AnimateEntrance from '../AnimateEntrance/AnimateEntrance'
import { useHistory } from 'react-router-dom'

const BLOG_POST_URL = 'https://aragon.org/blog/antv2'

function Disclaimer(): JSX.Element {
  const { layoutName } = useLayout()
  const history = useHistory()
  const compactMode = layoutName === 'small'

  const handleBackClick = useCallback(() => {
    history.push('/')
  }, [history])

  return (
    <LayoutGutter
      css={`
        display: flex;
        align-items: center;
        flex: 1;
      `}
    >
      <AnimateEntrance
        css={`
          margin-top: -${5 * GU}px;
          width: 100%;
        `}
      >
        <LayoutLimiter
          size="small"
          css={`
            padding-top: ${7 * GU}px;
            padding-bottom: ${10 * GU}px;
          `}
        >
          <Link
            onClick={handleBackClick}
            css={`
              display: flex;
              align-items: center;
              font-size: 18px;
              margin-bottom: ${2 * GU}px;
              font-weight: ${fontWeight.medium};
            `}
          >
            <IconArrowLeft
              css={`
                margin-right: ${0.5 * GU}px;
              `}
            />
            Back home
          </Link>
          <h1
            css={`
              font-weight: ${fontWeight.bold};
              line-height: 1.2;
              margin-bottom: ${2.5 * GU}px;
              font-size: ${compactMode ? `44` : `54`}px;
            `}
          >
            Disclaimer
          </h1>
          <Paragraph compactMode={compactMode}>
            The ANT migration is solely a technical upgrade to adopt the latest
            technical developments of Ethereum tokens.{' '}
            <Link
              href={BLOG_POST_URL}
              css={`
                font-weight: ${fontWeight.medium};
                text-decoration: none;
              `}
            >
              Read more here
            </Link>
            . ANTv2 is not a new token. ANTv2 is the upgraded version of ANT.
            ANTv2 will maintain the same functionality as ANTv1.
          </Paragraph>
        </LayoutLimiter>
      </AnimateEntrance>
    </LayoutGutter>
  )
}

function Paragraph({
  children,
  compactMode,
}: {
  children: ReactNode
  compactMode: boolean
}) {
  const theme = useTheme()

  return (
    <p
      css={`
        &:not(:last-child) {
          margin-bottom: ${3 * GU}px;
        }
        font-weight: ${fontWeight.medium};
        font-size: ${compactMode ? `18` : `26`}px;
        line-height: 1.6;
        color: ${theme.contentSecondary};
      `}
    >
      {children}
    </p>
  )
}

export default Disclaimer
