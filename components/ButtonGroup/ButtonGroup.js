import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

export default function ButtonGroup({
  activeKey,
  elements,
  isCompact,
  onSetActiveKey,
}) {
  return (
    <div
      css={`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        ${isCompact &&
          `
          button {
            width: 112px;
          }
          `}
      `}
    >
      {elements.map((el, idx) => (
        <Button
          activeKey={activeKey}
          key={idx}
          lastChild={elements.length - 1 === idx}
          index={idx}
          onSetActiveKey={onSetActiveKey}
        >
          {el}
        </Button>
      ))}
    </div>
  )
}

function Button({ activeKey, children, lastChild, index, onSetActiveKey }) {
  const selected = useMemo(() => activeKey === index, [activeKey, index])
  const setSelected = useCallback(() => onSetActiveKey(index), [
    index,
    onSetActiveKey,
  ])

  return (
    <ButtonBase
      onClick={setSelected}
      css={`
        ${selected ? 'border: 2px solid #00c2ff;' : 'border: 0;'}
        ${lastChild ? 'margin-right: 0px;' : ''}
      `}
    >
      {children}
    </ButtonBase>
  )
}

const ButtonBase = styled.button`
  position: relative;
  background: #ffffff;
  box-shadow: 0px 3px 6px rgba(139, 166, 194, 0.35);
  border: 0;
  border-radius: 8px;
  padding: 0;
  margin-right: 8px;
  width: 227px;
  height: 59px;
  cursor: pointer;
  transition: all 0.1s ease-out;
  &:active {
    top: 1px;
    border: 2px solid #00c2ff;
  }
`
