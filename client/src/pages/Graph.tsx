import { useRef, useEffect } from 'react'
import * as Plot from '@observablehq/plot'
import { Dice } from './Dice';
import { Odds } from './Dice';

export default function Graph(props: { data: Dice | Odds, xAxis: string, yAxis: string, isFullScreen: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  let barData: { [attr: string]: number, freq: number }[]
  let largestDomain: number

  if ("allSums" in props.data) {
    barData = props.data.allSums
    largestDomain = props.data.largestSum
  }
  else {
    barData = props.data.allOdds
    largestDomain = props.data.largestOdds
  }


  const extendedHeight = props.isFullScreen ? 300 : 0
  const extendedWidth = props.isFullScreen ? 500 : 0

  useEffect(() => {
    if (props.data === undefined) return;

    const barChart = Plot.plot({
      style: {
        backgroundColor: 'black'
      },
      color: { scheme: 'Blues' },
      marks: [
        Plot.barY(barData, {
          x: props.xAxis,
          y: props.yAxis,
        }),
        Plot.ruleY([0]),
      ],
      y: {
        grid: true,
        domain: [0, largestDomain]
      },
      marginLeft: 50,
      marginTop: 50,
      marginBottom: 50,
      width: 800 + extendedWidth,
      height: 600 + extendedHeight
    });
    if (containerRef.current) {
      containerRef.current.append(barChart);
    }
    return () => barChart.remove();
  }, [props.data])

  return (
    <>
      <div ref={containerRef} />
    </>
  )
}