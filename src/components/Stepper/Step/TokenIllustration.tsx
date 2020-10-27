import React, { useCallback } from 'react'
import { rgba } from 'polished'

type TokenIllustrationMode = 'neutral' | 'active' | 'negative' | 'positive'

type TokenIllustrationProps = {
  mode: TokenIllustrationMode
  index: number
}

type Apperance = {
  tokenGradient: [string, string]
  headGradient: [string, string]
  beakColor: string
  bodyColor: string
  shadowColor: string
}

const appearance: Record<TokenIllustrationMode, Apperance> = {
  neutral: {
    tokenGradient: ['#dcdde3', '#999ca7'],
    headGradient: ['#f1fdfd', '#ffffff'],
    beakColor: '#e2e4eb',
    bodyColor: '#e2e4eb',
    shadowColor: '#6c6e75',
  },
  active: {
    tokenGradient: ['#02f0ff', '#00aadf'],
    headGradient: ['#f1fdfd', '#ffffff'],
    beakColor: '#9ff9ff',
    bodyColor: '#9bfaff',
    shadowColor: '#4b93a7',
  },
  positive: {
    tokenGradient: ['#39d9c1', '#23b19c'],
    headGradient: ['#effaf8', '#feffff'],
    beakColor: '#b2ece3',
    bodyColor: '#75dccd',
    shadowColor: '#70948f',
  },
  negative: {
    tokenGradient: ['#fd7669', '#ec5c4d'],
    headGradient: ['#ffd6d3', '#fff9f9'],
    beakColor: '#ffaca5',
    bodyColor: '#ff9d93',
    shadowColor: '#855b57',
  },
}

function TokenIllustration({
  mode,
  index,
}: TokenIllustrationProps): JSX.Element {
  const {
    tokenGradient,
    headGradient,
    beakColor,
    bodyColor,
    shadowColor,
  } = appearance[mode]
  const [tokenGradientFrom, tokenGradientTo] = tokenGradient
  const [headGradientFrom, headGradientTo] = headGradient

  // Inline SVGs don't scope their defs so we have to provide unique ids
  const defId = useCallback((id) => `${mode}-${index}-${id}`, [mode, index])

  return (
    <div
      css={`
        border-radius: 100%;
        overflow: hidden;
        box-shadow: 0px 30px 30px 0px ${rgba(shadowColor, 0.15)},
          0px 6px 6px 0px ${rgba(shadowColor, 0.25)};
      `}
    >
      <svg
        viewBox="0 0 121 121"
        css={`
          display: block;
        `}
      >
        <defs>
          <filter
            id={defId('shadow_filter')}
            x="0.666903"
            y="8.70105"
            width="133.459"
            height="127.811"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy="5.59896" />
            <feGaussianBlur stdDeviation="7.88945" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
          </filter>
          <linearGradient
            id={defId('gradient_token')}
            x1="29.67"
            y1="20.22"
            x2="95.46"
            y2="106.18"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={tokenGradientFrom} />
            <stop offset="1" stopColor={tokenGradientTo} />
          </linearGradient>
          <linearGradient
            id={defId('gradient_head')}
            x1="28.4"
            y1="-30.83"
            x2="113.41"
            y2="-122.22"
            gradientTransform="matrix(1, 0, 0, -1, 0, -15)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={headGradientFrom} />
            <stop offset="1" stopColor={headGradientTo} />
          </linearGradient>
        </defs>
        <circle
          cx="60.5"
          cy="60.5"
          r="60.5"
          fill={`url(#${defId('gradient_token')})`}
        />
        <g filter={`url(#${defId('shadow_filter')})`}>
          <path
            d="M107.74,54.47c.41-8.72-5.67-14.5-12.53-18.47L90.74,62.24c3.09-.17,4.6,1,5.15,1.55s2.41,2.76.35,6C100.53,69.14,107.23,65,107.74,54.47Z"
            fill={beakColor}
          />
          <path
            d="M49.2,23.92l-5.32-5.35c8-1,29.14.28,49.6,13.12a10.7,10.7,0,0,1,0,3.45L95.2,36a20.16,20.16,0,0,1,2.23,15.36c-1.79,7.18-4.86,10.24-6.18,10.87-2.75,0-7.42,1.59-8.93,8.64s-4.4,8.57-5.66,8.45l-30.21.35L26.55,67.94,23.63,43.6,29.29,36l10.13-8.29,7.21-2.93ZM84.87,34a11,11,0,0,1-2.93,2.23c-7.78-1.65-10.58-5.68-10.58-5.68,7.34,0,14,1.7,18.8,4.66A34.7,34.7,0,0,0,84.87,34Z"
            fillRule="evenodd"
            fill={`url(#${defId('gradient_head')})`}
          />
          <path
            d="M82.27,71a42.33,42.33,0,0,1-18.54,4.14c-19.17,0-34.7-12-34.7-26.76,0-10.91,8.47-20.3,20.63-24.46C26.54,25.23,8,43.71,8,66.51c0,26.31,23.58,48.06,52.66,48.06,21.72,0,39.79-12.53,49.25-29.29C96.86,88.19,81.46,82.66,82.27,71Z"
            fill={bodyColor}
            fillRule="evenodd"
          />
        </g>
      </svg>
    </div>
  )
}

export default TokenIllustration
