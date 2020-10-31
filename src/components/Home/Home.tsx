import React, { useMemo } from 'react'
// @ts-ignore
import { GU } from '@aragon/ui'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import PageHeading from '../PageHeading/PageHeading'
import { KNOWN_LIQUIDITY_POOLS } from '../../known-liquidity-pools'
import ProgramItem from './ProgramItem'

function Home(): JSX.Element {
  const knownPools = useMemo(
    () =>
      Array.from(KNOWN_LIQUIDITY_POOLS, ([key, value]) => ({
        name: key,
        ...value,
      })),
    []
  )

  return (
    <LayoutGutter>
      <LayoutLimiter size="small">
        <div
          css={`
            display: flex;
            flex-direction: column;
            justify-content: center;
          `}
        >
          <div
            css={`
              padding-bottom: 60px;
            `}
          >
            <PageHeading
              title={<>Liquidity rewards&nbsp;programs</>}
              description="Select a program to stake, withdraw, or claim your rewards"
              css={`
                margin-bottom: 60px;
              `}
            />
            <ul
              css={`
                list-style: none;
              `}
            >
              {knownPools.map(({ title, endDate, ended, name, path }) => (
                <li
                  key={path}
                  css={`
                    &:not(:last-child) {
                      margin-bottom: ${2 * GU}px;
                    }
                  `}
                >
                  <ProgramItem
                    to={path}
                    title={title}
                    endDate={!ended ? endDate : ''}
                    name={name}
                    completed={ended}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LayoutLimiter>
    </LayoutGutter>
  )
}

export default Home
