import React, { ReactNode } from 'react'
// @ts-ignore
import { GU, useLayout, useTheme } from '@aragon/ui'
import { fontWeight } from '../../style/font'

type HeadingLevel = '1' | '2'

type PageHeadingProps = {
  title: ReactNode
  description?: ReactNode
  level?: HeadingLevel
}

const levelProperties = {
  1: {
    tag: 'h1',
    margin: 1.75 * GU,
    titleSize: 46,
    mobileSize: 38,
  },
  2: {
    tag: 'h2',
    margin: 1.75 * GU,
    titleSize: 34,
    mobileSize: 26,
  },
}

function PageHeading({
  title,
  description,
  level = '1',
  ...props
}: PageHeadingProps): JSX.Element {
  const theme = useTheme()

  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  const { margin, titleSize, mobileSize } = levelProperties[level]

  return (
    <div
      css={`
        text-align: center;
      `}
      {...props}
    >
      <Heading
        level={level}
        css={`
          font-weight: bold;
          line-height: 1.2;
          font-size: ${compactMode ? mobileSize : titleSize}px;
        `}
      >
        {title}
      </Heading>
      {description && (
        <p
          css={`
            font-size: ${compactMode ? `19` : `24`}px;
            line-height: 1.4;
            margin-top: ${margin}px;
            color: ${theme.contentSecondary};
            font-weight: ${fontWeight.medium};
            max-width: ${95 * GU}px;
            margin-left: auto;
            margin-right: auto;
          `}
        >
          {description}
        </p>
      )}
    </div>
  )
}

type HeadingProps = {
  level: HeadingLevel
  children: ReactNode
}

const Heading = ({ level, children, ...props }: HeadingProps) => {
  return React.createElement(levelProperties[level].tag, props, children)
}

export default PageHeading
