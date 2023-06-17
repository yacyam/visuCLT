import { useState, useEffect } from 'react'
import '../styles/Dice.css'
import Graph from './Graph'

export interface Dice {
  allSums: { sum: number, freq: number }[],
  allDice: number[],
  largestSum: number
}

export interface Odds {
  allOdds: { face: number, freq: number }[],
  largestOdds: number
}

interface Form {
  one: string,
  two: string,
  three: string,
  four: string,
  five: string,
  six: string
}

export default function Dice() {
  const [diceOdds, setDiceOdds] = useState([
    { face: 1, freq: 1 / 6 },
    { face: 2, freq: 1 / 6 },
    { face: 3, freq: 1 / 6 },
    { face: 4, freq: 1 / 6 },
    { face: 5, freq: 1 / 6 },
    { face: 6, freq: 1 / 6 }
  ])

  const [formData, setFormData] = useState({
    one: "1/6",
    two: "1/6",
    three: "1/6",
    four: "1/6",
    five: "1/6",
    six: "1/6"
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
    allSums: createInitialData(2),
    allDice: [1, 1],
    largestSum: 10
  })

  const [simulationSpeed, setSimulationSpeed] = useState(0)

  const [isFullscreen, setIsFullscreen] = useState(false)

  const allGlobalTimeouts: number[] = []

  const clearAllTimeouts = () => {
    while (allGlobalTimeouts.length > 0) {
      const oldTimeout = allGlobalTimeouts.pop()
      window.clearTimeout(oldTimeout)
    }
  }

  useEffect(() => {
    const diceSimulation = setTimeout(rollDice, simulationSpeed)
    allGlobalTimeouts.push(diceSimulation)
    if (simulationSpeed === 0) {
      clearAllTimeouts()
    }
  })

  function rollDice(): void {
    const oneRange = diceOdds[0].freq;
    const twoRange = oneRange + diceOdds[1].freq
    const threeRange = twoRange + diceOdds[2].freq
    const fourRange = threeRange + diceOdds[3].freq
    const fiveRange = fourRange + diceOdds[4].freq

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

  function resetGraph() {
    setDiceData(oldDiceData => {
      changeSimulationSpeed(0)
      return {
        ...oldDiceData,
        allSums: createInitialData(oldDiceData.allDice.length),
        largestSum: 10
      }
    }
    )
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

  function formChange(e: React.SyntheticEvent): void {
    const { name, value } = e.target as HTMLInputElement

    setFormData(oldFormData => {
      return {
        ...oldFormData,
        [name]: value
      }
    })
  }

  function formSubmit(e: React.SyntheticEvent) {
    e.preventDefault()

    setDiceOdds(oldOdds => {
      const newOdds: { face: number, freq: number }[] = []

      let currFace = 1
      let totalSum = 0

      for (const face in formData) {
        const checkInput = formData[face as keyof Form]

        const newNum = checkInput.split('/').reduce((p, c, i) => {
          if (i === 0) return parseFloat(c)

          const firstNum: number = p
          const secondNum = parseFloat(c)

          return firstNum / secondNum
        }, 1)

        if (newNum === Infinity) {
          alert('CANNOT DIVIDE BY ZERO')
          return oldOdds
        }
        if (isNaN(newNum)) {
          alert('ALL INPUTS MUST BE NUMBERS')
          return oldOdds
        }

        newOdds.push({ face: currFace, freq: newNum })
        totalSum += newNum
        currFace += 1
      }

      if (totalSum > 1.01 || totalSum < 0.99) {
        alert('For better results, please make odds add up to 1')

      }

      return newOdds
    })
  }

  function updateDie(isAdd: boolean): void {

    setDiceData((oldDiceData) => {
      const updatedDie = [...oldDiceData.allDice]

      if (isAdd) {
        updatedDie.push(1)
      }
      else {
        updatedDie.splice(updatedDie.length - 1, 1)
      }

      return {
        ...oldDiceData,
        allSums: createInitialData(updatedDie.length),
        allDice: updatedDie
      }
    })
  }

  function resetOdds(): void {
    setDiceOdds(() => {
      return [
        { face: 1, freq: 1 / 6 },
        { face: 2, freq: 1 / 6 },
        { face: 3, freq: 1 / 6 },
        { face: 4, freq: 1 / 6 },
        { face: 5, freq: 1 / 6 },
        { face: 6, freq: 1 / 6 }
      ]
    })
  }

  function changeSimulationSpeed(speed: number): void {
    setSimulationSpeed(() => {
      clearAllTimeouts()
      return speed
    })
  }



  return (
    <div className='dice--container'>
      <div className={`dice--graph ${isFullscreen ? 'fullscreen' : ''}`}>
        <Graph
          data={diceData}
          xAxis="sum"
          yAxis="freq"
          isFullScreen={isFullscreen}
        />

        <button onClick={() => setIsFullscreen(prevFullscreen => !prevFullscreen)}>
          FULLSCREEN
        </button>
      </div>

      {!isFullscreen && <div className='dice--logic-container'>
        <div className='dice--main'>
          {diceElements}

          <div className='dice--add-sub'>
            {diceData.allDice.length < 20 &&
              <button onClick={() => updateDie(true)}>ADD</button>}
            {diceData.allDice.length > 2 &&
              <button onClick={() => updateDie(false)}>REMOVE</button>}
          </div>
        </div>

        <div className='dice--simulation'>
          <h3>Simulation Speed</h3>
          <button onClick={() => changeSimulationSpeed(1000)}>SLOW</button>
          <button onClick={() => changeSimulationSpeed(80)}>NORMAL</button>
          <button onClick={() => changeSimulationSpeed(0.001)}>FAST</button>
          <button onClick={() => changeSimulationSpeed(0)}>STOP</button>
          <button onClick={resetGraph}>RESET</button>
        </div>

        <Graph
          data={{ allOdds: diceOdds, largestOdds: Math.max(...diceOdds.map((die) => die.freq)) + 0.25 }}
          xAxis="face"
          yAxis="freq"
          isFullScreen={false}
        />

        <form className='dice--form'>
          <input type="text" value={formData.one} name="one"
            onChange={formChange}
          />
          <input type="text" value={formData.two} name="two"
            onChange={formChange}
          />
          <input type="text" value={formData.three} name="three"
            onChange={formChange}
          />
          <input type="text" value={formData.four} name="four"
            onChange={formChange}
          />
          <input type="text" value={formData.five} name="five"
            onChange={formChange}
          />
          <input type="text" value={formData.six} name="six"
            onChange={formChange}
          />
        </form>

        <div className='dice--odds-logic'>
          <button onClick={formSubmit}>CHANGE ODDS</button>
          <button onClick={resetOdds}>RESET ODDS</button>
        </div>
      </div>}

    </div>
  )
}