import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

const WITHDRAW_KEY = 1

export default function ButtonGroup({
  activeKey,
  disabled,
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
          disabled={idx !== WITHDRAW_KEY}
          activeKey={activeKey}
          key={el.id}
          lastChild={elements.length - 1 === idx}
          index={idx}
          onSetActiveKey={disabled ? () => {} : onSetActiveKey}
        >
          {!isCompact ? el.copy : el.copyCompact}
        </Button>
      ))}
    </div>
  )
}

function Button({
  activeKey,
  children,
  disabled,
  lastChild,
  index,
  onSetActiveKey,
}) {
  const selected = useMemo(() => activeKey === index, [activeKey, index])
  const setSelected = useCallback(() => onSetActiveKey(index), [
    index,
    onSetActiveKey,
  ])

  return (
    <ButtonBase
      disabled={disabled}
      onClick={setSelected}
      css={`
        ${disabled ? 'background: #F6F9FC;' : ''}
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
  margin-right: 6px;
  width: 227px;
  height: 59px;
  cursor: pointer;
  transition: all 0.1s ease-out;
  &:disabled {
    border: 0px;
    cursor: 'normal';
    pointer-events: none;
  }
  &:focus {
    outline: none;
    border 2px solid #005fcc;
  }
  &:active {
    top: 1px;
    border: 2px solid #00c2ff;
  }
`
