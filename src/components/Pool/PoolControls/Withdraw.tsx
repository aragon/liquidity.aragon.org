import React from 'react'
import AmountCard from '../../AmountCard/AmountCard'
import AmountInput from '../../AmountInput/AmountInput'

function Withdraw(): JSX.Element {
  return (
    <>
      <AmountInput />
      <AmountCard label="Amount available to withdraw" value="Testing" />
    </>
  )
}

export default Withdraw
