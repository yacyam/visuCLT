import { useState } from 'react'
import '../styles/Dice.css'
import Graph from './Graph'

export default function Dice() {
  const [numDice, setNumDice] = useState(2)
  const [diceOdds, setDiceOdds] = useState({
    one: 1 / 6,
    two: 1 / 6,
    three: 1 / 6,
    four: 1 / 6,
    five: 1 / 6,
    six: 1 / 6
  })
  const [diceArray, setDiceArray] = useState([3, 2, 1])

  function rollDice(): void {
    const oneRange = diceOdds.one;
    const twoRange = oneRange + diceOdds.two
    const threeRange = twoRange + diceOdds.three
    const fourRange = threeRange + diceOdds.four
    const fiveRange = fourRange + diceOdds.five
    setDiceArray(oldDice => {

      return oldDice.map(() => {
        const rollNumber = Math.random()

        return (
          rollNumber <= oneRange && 1 ||
          rollNumber <= twoRange && 2 ||
          rollNumber <= threeRange && 3 ||
          rollNumber <= fourRange && 4 ||
          rollNumber <= fiveRange && 5 ||
          6
        )
      })

    })
  }

  const diceElements = diceArray.map((die, i) => {
    const allDiePieces = []

    for (let i = 0; i < die; i += 1) {
      allDiePieces.push(<div key={i} className={`die--piece`}></div>)
    }

    return (
      <div key={i} className={`dice--element dice--element${die}`}>
        {allDiePieces}
      </div>
    )
  })

  return (
    <div className='dice--container'>
      <div className='dice--logic-container'>
        <div className='dice--main'>
          {diceElements}
        </div>
        <button className='dice--change-btn' onClick={rollDice}>Roll Die</button>
      </div>

      <Graph />

    </div>
  )
}