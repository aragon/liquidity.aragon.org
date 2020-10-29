import React, { ReactNode } from 'react'
// @ts-ignore
import { useLayout, useTheme } from '@aragon/ui'
import { radius } from '../../style/radius'
import { shadowDepth } from '../../style/shadow'
import { fontWeight } from '../../style/font'
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton'

type AmountCardProps = {
  label?: ReactNode
  value?: ReactNode
  tokenGraphic?: string
  suffix?: string
  loading?: boolean
}

function AmountCard({
  label,
  value,
  suffix,
  tokenGraphic,
  loading = false,
  ...props
}: AmountCardProps): JSX.Element {
  const theme = useTheme()
  const { layoutName } = useLayout()

  const compactMode = layoutName === 'small'

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        background-color: ${theme.surface};
        padding: ${compactMode ? '25px' : '30px'};
        border-radius: ${radius.high};
        box-shadow: ${shadowDepth.medium};
      `}
      {...props}
    >
      {tokenGraphic && !compactMode && (
        <div
          css={`
            border-radius: 100%;
            overflow: hidden;
            box-shadow: ${shadowDepth.medium};
            flex-shrink: 0;
            margin-right: 20px;
            width: 66px;
            height: 66px;
          `}
        >
          <img
            alt=""
            src={tokenGraphic}
            css={`
              display: block;
              width: 100%;
              height: 100%;
            `}
          />
        </div>
      )}
      <div>
        <h3
          css={`
            color: ${theme.contentSecondary};
            margin-bottom: 8px;
            line-height: 1;
          `}
        >
          {label}
        </h3>
        <div
          css={`
            font-size: 28px;
            line-height: 1;
            font-weight: ${fontWeight.medium};
          `}
        >
          {!loading ? (
            <>
              <span
                css={`
                  word-break: break-all;
                `}
              >
                {value}
              </span>{' '}
              <span
                css={`
                  font-size: 0.75em;
                  font-weight: ${fontWeight.regular};
                `}
              >
                {suffix}
              </span>
            </>
          ) : (
            <LoadingSkeleton
              css={`
                width: 100%;
              `}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AmountCard
