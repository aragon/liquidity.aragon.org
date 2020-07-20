import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useViewport } from 'use-viewport'
import ButtonGroup from 'components/ButtonGroup/ButtonGroup'

export default function StakeModule() {
  const [activeKey, setActiveKey] = useState(0)
  const { below } = useViewport()

  // Super ugly Next.js workaround to let us have differences between SSR & client
  const [isCompact, setIsCompact] = useState(false)
  const smallLayout = below(415)
  useEffect(() => {
    setTimeout(() => {
      setIsCompact(smallLayout)
    }, 0)
  }, [smallLayout])

  return (
    <div
      css={`
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        max-width: 762px;
        max-height: 550px;
        background: #ffffff;
        mix-blend-mode: normal;
        box-shadow: 0px 2px 2px rgba(87, 95, 119, 0.15);
        border-radius: 6px;
        padding: 32px;
        ${isCompact &&
          `
            max-width: 362px;
            max-height: auto;
            padding: 10px;
          `}
      `}
    >
      <ButtonGroup
        activeKey={activeKey}
        elements={['Deposit', 'Withdraw', 'Stats']}
        isCompact={isCompact}
        onSetActiveKey={setActiveKey}
      />
    </div>
  )
}

