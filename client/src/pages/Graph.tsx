import { useRef, useEffect } from 'react'
import * as Plot from '@observablehq/plot'
import { Dice } from './Dice';

export default function Graph(props: { data: Dice, xAxis: string, yAxis: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.data === undefined) return;

    const barChart = Plot.plot({
      style: {
        backgroundColor: 'black'
      },
      color: { scheme: 'Blues' },
      marks: [
        Plot.barY(props.data.allSums, {
          x: props.xAxis,
          y: props.yAxis,
        }),
        Plot.ruleY([0])
      ],
      y: {
        grid: true,
        domain: [0, props.data.largestSum]
      },
      marginLeft: 50,
      marginTop: 50,
      marginBottom: 50
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