import React, { ReactNode } from 'react'
// @ts-ignore
import { useTheme, GU } from '@aragon/ui'
import { radius } from '../../style/radius'
import { fontWeight } from '../../style/font'
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton'

type StatCardProps = {
  title: string
  value: string | null
  graphic: string
  desc: ReactNode
}

function StatCard({ graphic, title, value, desc }: StatCardProps): JSX.Element {
  const theme = useTheme()

  return (
    <div
      css={`
        background-color: ${theme.surface};
        border-radius: ${radius.high};
        padding: ${5 * GU}px;
        width: 100%;
        max-width: ${65 * GU}px;
      `}
    >
      <img
        alt=""
        src={graphic}
        css={`
          width: ${10 * GU}px;
          width: ${10 * GU}px;
          margin-bottom: ${2 * GU}px;
        `}
      />
      <h3
        css={`
          font-size: 18px;
          font-weight: ${fontWeight.medium};
          color: ${theme.contentSecondary};
        `}
      >
        {title}
      </h3>
      <h4
        css={`
          font-size: 34px;
          font-weight: ${fontWeight.medium};
          margin-top: ${1 * GU}px;
          margin-bottom: ${1.75 * GU}px;
          line-height: 1;
        `}
      >
        {value ? (
          <SplitValuePresentation value={value} />
        ) : (
          <LoadingSkeleton
            css={`
              max-width: ${32 * GU}px;
            `}
          />
        )}
      </h4>
      <p
        css={`
          font-size: 18px;
          color: ${theme.contentSecondary};
          line-height: 1.4;
        `}
      >
        {desc}
      </p>
    </div>
  )
}

function SplitValuePresentation({ value }: { value: string }): JSX.Element {
  const [body, valueDecimal] = value.split('.')
  const valueBody = valueDecimal ? `${body}.` : body

  return (
    <>
      {valueBody}
      <span
        css={`
          font-size: 0.75em;
        `}
      >
        {valueDecimal}
      </span>
    </>
  )
}

export default StatCard
