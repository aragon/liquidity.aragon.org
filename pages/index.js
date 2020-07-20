import React from 'react'
import NavBar from 'components/NavBar/NavBar'
import StakeModule from 'components/StakeModule/StakeModule'

export default () => {
return (
  <div
    css={`
      position: relative;
      min-height: 100vh;
      background: #f6f9fc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `}
  >
    <NavBar logoMode={'ant'} />
    <div>
      <StakeModule />
    </div>
  </div>
)
}
