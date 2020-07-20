import React, { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import styled from 'styled-components'
import EthIdenticon from 'components/EthIdenticon/EthIdenticon'
import { trackEvent } from 'lib/analytics'
import { useWalletAugmented } from 'lib/wallet'
import { shortenAddress } from 'lib/web3-utils'

import fortmatic from './provider-icons/fortmatic.svg'
import frame from './provider-icons/frame.svg'
import metamask from './provider-icons/metamask.svg'
import portis from './provider-icons/portis.svg'

function AccountModule() {
  const { account } = useWalletAugmented()
  return account ? <ConnectedMode /> : <DisconnectedMode />
}

AccountModule.propTypes = {
  compact: PropTypes.bool,
}

function DisconnectedMode() {
  const { activate } = useWalletAugmented()

  const activateAndTrack = useCallback(
    async providerId => {
      const ok = await activate(providerId)
      if (ok) {
        trackEvent('web3_connect', {
          segmentation: {
            provider: providerId,
          },
        })
      }
    },
    [activate]
  )

  const containerRef = useRef()

  return (
    <ButtonBase
      ref={containerRef}
      css={`
        position: relative;
        width: 164px;
        height: 48px;
        background: linear-gradient(306.16deg, #01e8f7 -5.08%, #00c2ff 81.4%);
        mix-blend-mode: normal;
        box-shadow: 0px 2px 2px rgba(87, 95, 119, 0.15);
        border-radius: 6px;
        margin-left: 0;
        color: white;
        &:active {
          top: 1px;
        }
      `}
    >
      <OverlayTrigger
        trigger="click"
        rootClose
        placement="bottom-end"
        overlay={
          <StyledPopover
            css={`
              position: absolute;
              left: 0;
            `}
          >
            <div
              css={`
                position: relative;
                width: 100%;
                height: 40px;
                border-bottom: 0.5px solid #dde4e8;
                color: #7893ae;
              `}
            >
              <span
                css={`
                  display: block;
                  width: 100%;
                  padding-top: 8px;
                  padding-left: 16px;
                  font-size: 16px;
                  font-family: 'Manrope', helvetica;
                  font-weight: 300;
                `}
              >
                Use Account From
              </span>
              <div
                css={`
                  display: grid;
                  grid-gap: 10px;
                  grid-auto-flow: row;
                  grid-template-columns: repeat(2, 1fr);
                  padding: 16px;
                `}
              >
                <ProviderButton
                  name="Metamask"
                  onActivate={() => activateAndTrack('injected')}
                  image={metamask}
                />
                <ProviderButton
                  name="Frame"
                  onActivate={() => activateAndTrack('frame')}
                  image={frame}
                />
                <ProviderButton
                  name="Fortmatic"
                  onActivate={() => activateAndTrack('fortmatic')}
                  image={fortmatic}
                />
                <ProviderButton
                  name="Portis"
                  onActivate={() => activateAndTrack('portis')}
                  image={portis}
                />
              </div>
            </div>
          </StyledPopover>
        }
      >
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            font-weight: bold;
            margin: 0;
            width: 100%;
            height: 100%;
            background: transparent;
          `}
        >
          Connect Account
        </div>
      </OverlayTrigger>
    </ButtonBase>
  )
}

function ProviderButton({ name, onActivate, image }) {
  return (
    <ButtonBase
      onClick={onActivate}
      css={`
        position: relative;
        display: flex;
        flex-direction: column;
        color: #1c1c1c;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 90px;
        margin-bottom: 12px;
        box-shadow: 0px 5px 12px rgba(139, 166, 194, 0.35);
        border-radius: 8px;
        text-transform: capitalize;
        &:active {
          top: 1px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}
    >
      <img src={image} alt="" height="42px" />
      <div
        css={`
          font-family: 'Manrope', helvetica !important;
          font-size 16px;
          margin-top: 8px;
        `}
      >
        {name}
      </div>
    </ButtonBase>
  )
}

ProviderButton.propTypes = {
  name: PropTypes.string,
  onActivate: PropTypes.func,
  image: PropTypes.string,
}

function ConnectedMode() {
  const { account, deactivate } = useWalletAugmented()
  const containerRef = useRef()

  return (
    <Container ref={containerRef}>
      <ButtonBase
        onClick={deactivate}
        css={`
          display: flex;
          flex-direction: row;
          position: relative;
          align-items: center;
          justify-content: center;
          font-weight: normal;
          width: 178px;
          &:active {
            top: 1px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          }
        `}
      >
        <div
          css={`
            position: relative;
          `}
        >
          <EthIdenticon address={account} scale={1} radius={4} />
        </div>
        <Address>{shortenAddress(account)}</Address>
      </ButtonBase>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  height: 40px;
`
const StyledPopover = styled(Popover)`
  overflow: hidden;
  background: #fff;
  box-shadow: 0px 7px 17px rgba(139, 166, 194, 0.35);
  border: 0 solid transparent;
  border-radius: 8px;
  width: 410px;
  max-width: 90vw;
  height: 277px;
  right: 100px;

  &.bs-popover-bottom .arrow::after {
    border-bottom-color: #f9fafc;
  }
  &.bs-popover-bottom .arrow::before {
    border-bottom-color: transparent;
  }

  div.header {
    background: #f9fafc;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      line-height: 32px;
      padding: 0;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      text-align: right;
      color: #7fdfa6;
      margin: 0;
    }
    button {
      background: transparent;
      border: 0;
      cursor: pointer;
      color: #637381;
    }
    button:hover {
      color: #212b36;
    }
  }
  span {
    top: 0px;
  }
`

const Address = styled.div`
  font-size: 18px;
  line-height: 31px;
  color: #1c1c1c;
  padding-left: 8px;
  padding-right: 4px;
  font-family: monospace;
`

const ButtonBase = styled.button`
  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  border: 0;
  padding: 0;
  border-radius: 4px;
  cursor: pointer;
`

export default AccountModule
