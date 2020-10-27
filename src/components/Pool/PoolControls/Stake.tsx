import React from 'react'
import AmountCard from '../../AmountCard/AmountCard'
import AmountInput from '../../AmountInput/AmountInput'

function Stake(): JSX.Element {
  return (
    <>
      <AmountInput />
      <AmountCard label="Your estimated rewards" value="Testing" />
    </>
  )
}

export default Stake
