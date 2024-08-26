// Playground.tsx
"use client";

import React, { useMemo } from "react";
import { InputValues } from "./Input";
import { GeneratedData, DataPoint } from "./DataGeneration";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { createModel } from 'polynomial-regression';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface PlaygroundProps {
  inputs: InputValues;
  data: GeneratedData;
}

const Playground: React.FC<PlaygroundProps> = ({ inputs, data }) => {
  const polynomialRegression = useMemo(() => {
    if (inputs.typeOfMethod === 'regression') {
      const model = createModel();
      const points: [number, number][] = data.trainingData.map(point => [point.x, point.y]);
      model.fit(points, [inputs.degreeCount]);
      return model;
    }
    return null;
  }, [data.trainingData, inputs.typeOfMethod, inputs.degreeCount]);

  const regressionPoints = useMemo(() => {
    if (polynomialRegression) {
      const xValues = data.trainingData.map(point => point.x);
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const step = (maxX - minX) / 100;
      return Array.from({ length: 101 }, (_, i) => {
        const x = minX + i * step;
        return { x, y: polynomialRegression.estimate(inputs.degreeCount, x) };
      });
    }
    return [];
  }, [polynomialRegression, data.trainingData, inputs.degreeCount]);

  const chartData: ChartData<'line'> = {
    datasets: [
      {
        type: 'line' as const,
        label: 'Training Data',
        data: data.trainingData.map(point => ({ x: point.x, y: point.y })),
        backgroundColor: 'rgba(251,159,159, 0.3)',
        borderColor: 'rgba(251,159,159, 0.4)',
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false,
      },
      ...(polynomialRegression ? [{
        type: 'line' as const,
        label: `Polynomial Regression (Degree ${inputs.degreeCount})`,
        data: regressionPoints,
        backgroundColor: 'rgba(213,54,0, 1)',
        borderColor: 'rgba(213,54,0, 1)',
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
      }] : []),
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: 'Independent Variable ( x )',
        },
      },
      y: {
        type: 'linear' as const,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Dependent Variable ( y )',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            if (label) {
              return `${label}: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
            }
            return `(${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-[600px] bg-white rounded-xl shadow-lg p-6 ml-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Data Visualization</h2>
      <div className="w-full h-[500px]">
        <Line data={chartData} options={chartOptions} />
      </div>
      {/* {polynomialRegression && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Regression Equation:</h3>
          <p>{polynomialRegression.expressions()[inputs.degreeCount]}</p>
        </div>
      )} */}
    </div>
  );
};

export default Playground;