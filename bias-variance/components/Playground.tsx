// components/Playground.tsx

import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { create, all } from 'mathjs';
import { PlaygroundProps, Results } from './types';
import { randomNormal } from './Utility';

const math = create(all, {});

const Playground: React.FC<PlaygroundProps> = ({ inputs }) => {
  const {
    dataset,
    pointCount,
    typeOfMethod,
    noiseCount,
    degreeCount,
    degreesOfFreedom,
    seed,
  } = inputs;

  const [data, setData] = useState<any[]>([]);
  const [results, setResults] = useState<Results>({ bias: 0, variance: 0, mse: 0 });

  const generateData = () => {
    // Set random seed
    math.config({ randomSeed: seed });

    let fx: (x: number) => number;
    switch (dataset) {
      case 'dataset2':
        fx = (x) => 3 + 0.87 * x + 0.5 * x ** 2;
        break;
      case 'dataset3':
        fx = (x) => 3 + 0.87 * Math.sqrt(x) + 0.5 * Math.sin(x);
        break;
      case 'dataset4':
        fx = (x) => 3 + 0.87 * x;
        break;
      default:
        fx = (x) => 3 + 0.87 * x ** 2 + 0.5 * x ** 3;
    }

    const x = math.random([pointCount], -5, 5);
    const noise = randomNormal(0, noiseCount, pointCount);
    const y = x.map((xi, i) => fx(xi) + noise[i]);

    return { x, y, fx };
  };

  const calculateResults = (x: number[], y: number[], fx: (x: number) => number): Results => {
    // Dummy implementation for calculating bias, variance, and MSE
    // Replace this with the actual implementation based on the R code logic
    const bias = 0; // Placeholder
    const variance = 0; // Placeholder
    const mse = 0; // Placeholder

    return { bias, variance, mse };
  };

  useEffect(() => {
    const { x, y, fx } = generateData();
    setData([{ x, y, type: 'scatter', mode: 'markers' }]);
    setResults(calculateResults(x, y, fx));
  }, [dataset, pointCount, typeOfMethod, noiseCount, degreeCount, degreesOfFreedom, seed]);

  return (
    <div>
      <Plot
        data={data}
        layout={{ title: 'Bias-Variance Playground' }}
      />
      <div>
        <h3>Results:</h3>
        <p>Bias: {results.bias}</p>
        <p>Variance: {results.variance}</p>
        <p>MSE: {results.mse}</p>
      </div>
    </div>
  );
};

export default Playground;
