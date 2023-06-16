import { useState, useEffect } from 'react'
import '../styles/Dice.css'
import Graph from './Graph'

export interface Dice {
  allSums: { sum: number, freq: number }[],
  allDice: number[],
  largestSum: number
}

export default function Dice() {
  const [diceOdds, setDiceOdds] = useState({
    one: 1 / 6,
    two: 1 / 6,
    three: 1 / 6,
    four: 1 / 6,
    five: 1 / 6,
    six: 1 / 6
  })

  const createInitialData = (length: number) => {
    const allSums = 6 * length
    const sumObject: { sum: number, freq: number }[] = []

    for (let i = length; i <= allSums; i += 1) {
      sumObject.push({ sum: i, freq: 0 })
    }

    return sumObject
  }

  const [diceData, setDiceData] = useState({
    allSums: createInitialData(5),
    allDice: [1, 1, 1, 4, 2],
    largestSum: 10
  })

  useEffect(() => {
    setTimeout(() => {
      rollDice()
    }, 100)
  })

  function rollDice(): void {
    const oneRange = diceOdds.one;
    const twoRange = oneRange + diceOdds.two
    const threeRange = twoRange + diceOdds.three
    const fourRange = threeRange + diceOdds.four
    const fiveRange = fourRange + diceOdds.five

    setDiceData(oldDice => {
      let sum = 0
      const newRolledDice = oldDice.allDice.map(() => {
        const rollNumber = Math.random()

        const finalRoll =
          rollNumber <= oneRange && 1 ||
          rollNumber <= twoRange && 2 ||
          rollNumber <= threeRange && 3 ||
          rollNumber <= fourRange && 4 ||
          rollNumber <= fiveRange && 5 ||
          6

        sum += finalRoll

        return finalRoll
      })

      let newLargestSum = 10

      const newDiceSums = oldDice.allSums.map((sumFreq) => {
        if (sumFreq.sum === sum) {
          const newFreq = Math.max(oldDice.largestSum, sumFreq.freq + 1)
          newLargestSum = newFreq
          return { sum: sum, freq: sumFreq.freq + 1 }
        }
        return sumFreq
      })

      return {
        allSums: newDiceSums,
        allDice: newRolledDice,
        largestSum: newLargestSum
      }
    })
  }

  const diceElements = diceData.allDice.map((die, i) => {
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

      <Graph
        data={diceData}
        xAxis="sum"
        yAxis="freq"
      />

    </div>
  )
}