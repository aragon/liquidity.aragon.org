import React, { useState, useEffect, useCallback, useRef } from 'react'
import antSvg from 'components/Logo/logo-ant.svg'
import swapSvg from 'components/assets/swap.svg'
import uniswapSvg from './assets/uniswap.svg'

const noop = () => {}

function Input({
  disabled,
  mode,
  inputValue,
  onBlur = noop,
  onChange = noop,
  onFocus = noop,
  onMax = noop,
  onSelect = noop,
  placeholder = 'Enter amount',
}) {
  const [opened, setOpened] = useState(false)
  const buttonRef = useRef()
  const menuRef = useRef()
  const inputRef = useRef()

  useEffect(() => {
    if (opened && menuRef.current) {
      menuRef.current.focus()
    }
  }, [opened])

  const handleButtonClick = useCallback(() => {
    setOpened(isOpen => !isOpen)
  }, [])

  return (
    <div
      css={`
        width: 100%;
        display: flex;
        justify-content: flex-end;
      `}
    >
      <div
        css={`
          position: relative;
          z-index: 1;
          width: 100%;
          height: 50px;
          margin: 16px 0 20px 0;
          background: #ffffff;
          display: flex;
          padding: 0;
          opacity: ${disabled ? '0.5' : '1'};
        `}
      >
        <input
          disabled={disabled}
          ref={inputRef}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
          value={!disabled ? inputValue : ''}
          css={`
            position: absolute;
            z-index: 1;
            width: 100%;
            height: 69px;
            padding: 6px 12px 0;
            background: #ffffff;
            border: 1px solid #dde4e9;
            color: #212b36;
            box-sizing: border-box;
            box-shadow: inset 0px 4px 8px rgba(139, 166, 194, 0.35);
            border-radius: 8px;
            appearance: none;
            font-size: 20px;
            font-weight: 400;
            &::-webkit-inner-spin-button,
            &::-webkit-outer-spin-button {
              -webkit-appearance: none;
            }
            -moz-appearance: textfield;
            &:focus {
              outline: none;
              border-color: #08bee5;
            }
            &::placeholder {
              color: #8fa4b5;
              opacity: 1;
            }
            &:invalid {
              box-shadow: none;
            }
          `}
        />
        <DropdownButton
          disabled={disabled}
          ref={buttonRef}
          mode={mode}
          onClick={handleButtonClick}
          onMax={onMax}
          opened={opened}
        />
      </div>
    </div>
  )
}

const DropdownButton = React.forwardRef(function DropdownButton(
  { disabled, onMax, onClick, onModeChange, label, opened },
  ref
) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      type="button"
      css={`
        position: absolute;
        right: 0;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 69px;
        width: 150px;
        padding: 0 0 0 10px;
        color: #212b36;
        background: transparent;
        border-width: 0;
        border-radius: 0 4px 4px 0;
        outline: 0;
        transition: none;
        cursor: pointer;
        &::-moz-focus-inner {
          border: 0;
        }
        &:focus {
          outline: 0;
        }
        &:focus:after {
          content: '';
        }
      `}
    >
      <div
        onClick={disabled ? undefined : onMax}
        css={`
          position: relative;
          &:active {
            top: 1px;
          }
        `}
      >
        <Adornment mode="uni" />
      </div>
    </button>
  )
})

function Adornment({ mode }) {
  return (
    <div>
      <img
        src={mode === 'uni' ? uniswapSvg : antSvg}
        alt="Token Logo"
        width={36}
      />
      <span>MAX</span>
    </div>
  )
}

export default Input
