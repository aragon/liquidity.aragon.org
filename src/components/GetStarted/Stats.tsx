import React, { useMemo } from 'react'
// @ts-ignore
import { Link, GU, useLayout } from '@aragon/ui'
// @ts-ignore
import TokenAmount from 'token-amount'
import LayoutLimiter from '../Layout/LayoutLimiter'
import StatCard from '../StatCard/StatCard'
import totalSupplySvg from '../../assets/stat-total-supply.svg'
import antTokenSvg from '../../assets/stat-ant-token.svg'
import marketCapSvg from '../../assets/stat-market-cap.svg'
import { useAccountBalances } from '../../providers/AccountBalances'
import { formatAmountToUsd, parseUnits } from '../../utils/math-utils'

const API_REFERENCE_URL = 'https://0x.org/api'

function Stats({ ...props }: React.HTMLAttributes<HTMLElement>): JSX.Element {
  const { layoutName } = useLayout()
  const {
    antV2TotalSupply,
    antV2MigratedAmount,
    antV1,
    antTokenPriceUsd,
  } = useAccountBalances()

  const { decimals } = antV1

  const stackColumns = layoutName === 'small' || layoutName === 'medium'

  // TODO: Look at a dynamic solution?
  const staticCirculatingSupply = useMemo(
    () => parseUnits('34611262.420382165605096', decimals),
    [decimals]
  )

  const formattedTotalSupply = useMemo(
    (): string | null =>
      antV2MigratedAmount &&
      new TokenAmount(antV2MigratedAmount, decimals).format({
        digits: 2,
      }),
    [antV2MigratedAmount, decimals]
  )

  const formattedMarketCap = useMemo(() => {
    return antTokenPriceUsd && antV2TotalSupply
      ? `$${formatAmountToUsd(
          staticCirculatingSupply,
          decimals,
          antTokenPriceUsd
        )}`
      : null
  }, [antTokenPriceUsd, antV2TotalSupply, decimals, staticCirculatingSupply])

  const formattedPrice = useMemo(
    () => antTokenPriceUsd && `$${Number(antTokenPriceUsd).toFixed(2)}`,
    [antTokenPriceUsd]
  )

  const cardPresentation = useMemo(
    () => [
      {
        title: 'Upgraded ANT',
        graphic: totalSupplySvg,
        value: formattedTotalSupply,
        desc: 'Total amount of ANT that has been upgraded to ANTv2.',
      },
      {
        title: 'ANT Price',
        graphic: antTokenSvg,
        value: formattedPrice,
        desc: (
          <>
            Current aggregate price of ANT v1 - courtesy of{' '}
            <Link
              href={API_REFERENCE_URL}
              css={`
                text-decoration: none;
              `}
            >
              0x API
            </Link>
            .
          </>
        ),
      },
      {
        title: 'Market Cap',
        graphic: marketCapSvg,
        value: formattedMarketCap,
        desc: 'Value of all ANT in circulation.',
      },
    ],
    [formattedTotalSupply, formattedPrice, formattedMarketCap]
  )

  return (
    <LayoutLimiter size="medium" {...props}>
      <div
        css={`
          display: grid;
          grid-template-columns: ${stackColumns ? '1fr' : '1fr 1fr 1fr'};
          justify-items: center;
          grid-gap: ${3 * GU}px;
        `}
      >
        {cardPresentation.map((card, i) => {
          const { graphic, title, value, desc } = card

          return (
            <StatCard
              key={i}
              title={title}
              value={value}
              graphic={graphic}
              desc={desc}
            />
          )
        })}
      </div>
    </LayoutLimiter>
  )
}

export default Stats
