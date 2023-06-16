import { useState, useRef, useEffect } from 'react'
import * as Plot from '@observablehq/plot'
import '../styles/Dice.css'
import Graph from './Graph'

export default function Dice() {
  const containerRef = useRef();
  const [numDice, setNumDice] = useState(2)
  const [diceOdds, setDiceOdds] = useState({
    one: 1 / 6,
    two: 1 / 6,
    three: 1 / 6,
    four: 1 / 6,
    five: 1 / 6,
    six: 1 / 6
  })
  const [diceArray, setDiceArray] = useState([2, 1])
  const [largestElem, setLargestElem] = useState(10)


  const createInitialData = (length: number) => {
    const allSums: number = 6 * length
    const sumObject: { sum: number, freq: number }[] = []

    for (let i = length; i <= allSums; i += 1) {
      sumObject.push({ sum: i, freq: 0 })
    }

    return sumObject
  }

  const [data, setData] = useState(createInitialData(diceArray.length))

  useEffect(() => {
    if (data === undefined) return;

    const barChart = Plot.plot({
      style: {
        backgroundColor: 'black'
      },
      color: { scheme: 'BuRd' },
      marks: [
        Plot.barY(data, {
          x: "sum",
          y: "freq",
        }),
        Plot.ruleY([0])
      ],
      y: {
        grid: true,
        tickSpacing: 50,
        domain: [0, largestElem]
      },
      marginLeft: 50,
      marginTop: 50,
      marginBottom: 50
    });
    containerRef.current.append(barChart);
    return () => barChart.remove();
  }, [data])

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

    let sum = 0
    setDiceArray(oldDice => {

      return oldDice.map(() => {
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
    })

    setData(oldData => {
      return oldData.map((sumFreq) => {
        if (sumFreq.sum === sum) {
          const newFreq = Math.max(largestElem, sumFreq.freq + 1)
          setLargestElem(newFreq)
          return { sum: sum, freq: sumFreq.freq + 1 }
        }
        return sumFreq
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



      <div ref={containerRef} />

      <Graph />

    </div>
  )
}