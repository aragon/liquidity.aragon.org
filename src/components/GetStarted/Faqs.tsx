import React, { ReactNode } from 'react'
// @ts-ignore
import { GU, Link } from '@aragon/ui'
import { fontWeight } from '../../style/font'
import LayoutLimiter from '../Layout/LayoutLimiter'
import Faq from './Faq'
import PageHeading from '../PageHeading/PageHeading'
import { networkEnvironment } from '../../environment'
import { getEtherscanUrl } from '../../utils/etherscan'

const { contracts } = networkEnvironment

// TODO: Add url and content when available
const FAQS_URL = 'https://aragon.org/faqs/tokens#ant-faq'
const FAQS_ITEMS: [string, ReactNode][] = [
  [
    'What is ANT v2?',
    <>
      <p>
        ANTv1 was optimized for on-chain voting. Because of that, the ANT smart
        contract needed more complex logic. As we are{' '}
        <Link href="https://aragon.org/blog/snapshot">
          moving voting off-chain
        </Link>
        , that logic is not needed anymore.
      </p>
      <p>
        Switching to a new, simpler token will make ANT transactions 3x cheaper
        — lowering the barrier to entry and making it a better token to use.
        ANTv2 will also support gas-less transactions, enabling service
        operators (and delegated hot wallets) to pay for their users’ gas.
      </p>
      <p>
        Further documentation about ANT token contract is available at{' '}
        <Link href="http://docs.aragon.org/ant">docs.aragon.org/ant</Link>.
      </p>
      <p>
        A gas cost comparison against ANTv1 is available{' '}
        <Link href="https://github.com/aragon/aragon-network-token/pull/21">
          here
        </Link>
        .
      </p>
      <p>
        ANTv1 address: <AddressLink address={contracts.tokenAntV1} />
      </p>
      <p>
        ANTv2 address: <AddressLink address={contracts.tokenAntV2} />
      </p>
    </>,
  ],
  [
    'Why should I upgrade my ANT?',
    <>
      <p>
        ANTv2 is not a different token, but just a new version of ANT. If you
        have ANTv1, you will be able to easily upgrade it to ANTv2.
      </p>
      <p>
        Together with the upgrade, we will also kickstart a new{' '}
        <Link href="https://liquidity.aragon.org/">
          liquidity rewards program
        </Link>{' '}
        on both Uniswap and Balancer, starting October 29th.
      </p>
      <p>ANT holders who upgrade early will be eligible for:</p>
      <ul
        css={`
          li {
            margin-left: 24px;
          }
        `}
      >
        <li>
          The new liquidity rewards program, starting on October 29th and
          lasting two weeks
        </li>
        <li>
          Voting on bootstrapping the a new governance process for the Aragon
          Network
        </li>
      </ul>
      <p>ANT v2 will continue to be used to govern Aragon Network services.</p>
    </>,
  ],
  [
    'For how long will this upgrade last?',
    <p>
      Users will be able to use the Upgrade Portal as many times as they’d like.
      It will be continually supported going forward, ensuring that tokenholders
      are always using an up-to-date version of ANT. Each token upgrade
      currently costs about 200,000 gas (or around $2).
    </p>,
  ],
  [
    'What is the conversion rate?',
    <p>
      The conversion rate is fixed at 1:1, this means that you will get 1 ANTv2
      for every ANTv1 you upgrade.
    </p>,
  ],
  [
    'What happens to the ANT held in CEXs & DEXs?',
    <>
      <p>
        This tool is designed to help users upgrade ANTv1 balances held in their
        own wallets in just a few clicks.
      </p>
      <p>
        If you have ANT in major exchanges supporting the upgrade, including{' '}
        <Link href="https://www.binance.com/">Binance</Link>,{' '}
        <Link href="https://www.huobi.com/">Huobi</Link> and{' '}
        <Link href="https://www.okex.com/">OKEx</Link>, your ANT will be
        upgraded automatically.
      </p>

      <p>
        If you have ANTv1 staked in other contracts, such as liquidity pools and
        DEXes, you must upgrade your liquidity manually. In order to do so,
        first exit the existing pool, upgrade it through this portal and
        re-enter it into the equivalent ANTv2 pool.
      </p>

      <p>
        Please note that most sites, coin trackers and DEXes will map ANTv1 to
        “ANT (old)” and ANTv2 to “ANT”.
      </p>
    </>,
  ],
]

function Faqs(): JSX.Element {
  return (
    <LayoutLimiter size="small">
      <div
        css={`
          a {
            text-decoration: none;
          }
        `}
      >
        <PageHeading
          title="FAQs"
          description="Have questions? We have answers."
          css={`
            width: 100%;
            margin-bottom: ${7 * GU}px;
          `}
        />
        <Faq items={FAQS_ITEMS} />
        <div
          css={`
            text-align: center;
          `}
        >
          <Link
            href={FAQS_URL}
            css={`
              margin-top: ${6 * GU}px;
              font-weight: ${fontWeight.medium};
              font-size: 20px;
            `}
          >
            Go to all FAQs
          </Link>
        </div>
      </div>
    </LayoutLimiter>
  )
}

function AddressLink({ address }: { address: string }): JSX.Element {
  return (
    <Link
      href={getEtherscanUrl(address)}
      css={`
        text-align: left;
        white-space: initial;
        word-break: break-all;
      `}
    >
      {address}
    </Link>
  )
}

export default Faqs
