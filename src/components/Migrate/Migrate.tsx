import React from 'react'
// @ts-ignore
import { GU } from '@aragon/ui'
import { TokenConversionType } from './types'
import Converter from './Converter/Converter'
import LayoutGutter from '../Layout/LayoutGutter'
import { MigrateStateProvider } from './MigrateStateProvider'
import AnimateEntrance from '../AnimateEntrance/AnimateEntrance'

type MigrateProps = {
  conversionType: TokenConversionType
}

function Migrate({ conversionType }: MigrateProps): JSX.Element {
  return (
    <MigrateStateProvider conversionType={conversionType}>
      <MigrateContent />
    </MigrateStateProvider>
  )
}

function MigrateContent() {
  return (
    <AnimateEntrance
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        flex: 1;
      `}
    >
      <LayoutGutter
        css={`
          padding-top: ${7 * GU}px;
          padding-bottom: ${10 * GU}px;
        `}
      >
        <div
          css={`
            margin-top: -${4 * GU}px;
            width: 100%;
          `}
        >
          <div
            css={`
              display: flex;
              justify-content: center;
              width: 100%;
            `}
          >
            <Converter />
          </div>
        </div>
      </LayoutGutter>
    </AnimateEntrance>
  )
}

export default Migrate
