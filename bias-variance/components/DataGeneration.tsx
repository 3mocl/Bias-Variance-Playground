// DataGeneration.tsx
"use client";

import { useState, useEffect } from 'react';
import { InputValues } from './Input';
import * as math from 'mathjs';

export interface DataPoint {
  x: number;
  y: number;
  fx: number;
}

export interface GeneratedData {
  trainingData: DataPoint[];
  testData: DataPoint[];
}

const generateData = (inputs: InputValues): GeneratedData => {
  const { dataset, pointCount, noiseCount, seed } = inputs;
  const numTrainingPoints = pointCount;
  const numTestPoints = Math.floor(pointCount / 3);
  const numTotalPoints = numTrainingPoints + numTestPoints;
  const noiseSd = noiseCount * 2; // Adjusting noise level

  // Generate x values
  let x: number[];
  if (dataset === 'dataset1') {
    x = Array.from({ length: numTotalPoints }, () => math.random(-5, 5));
  } else {
    x = Array.from({ length: numTotalPoints }, () => math.random(0, 20));
  }

  // Define function based on dataset
  const fx = (x: number): number => {
    switch (dataset) {
      case 'dataset1':
        return 3 + 0.87 * Math.pow(x, 2) + 0.5 * Math.pow(x, 3);
      case 'dataset2':
        return 3 + 0.87 * x + 0.5 * Math.pow(x, 2);
      case 'dataset3':
        return 3 + 0.87 * Math.sqrt(x) + 0.5 * Math.sin(x);
      case 'dataset4':
        return 3 + 0.87 * x;
      default:
        return 3 + 0.87 * Math.pow(x, 2) + 0.5 * Math.pow(x, 3);
    }
  };

  // Generate y values with noise
  const data: DataPoint[] = x.map(xi => {
    const fxi = fx(xi);
    const noise = math.random(-noiseSd, noiseSd);
    return { x: xi, y: fxi + noise, fx: fxi };
  });

  // Separate training and test data
  const trainingData = data.slice(0, numTrainingPoints);
  const testData = data.slice(numTrainingPoints);

  return { trainingData, testData };
};

export const useGeneratedData = (inputs: InputValues): GeneratedData => {
  const [data, setData] = useState<GeneratedData>({ trainingData: [], testData: [] });

  useEffect(() => {
    const newData = generateData(inputs);
    setData(newData);
  }, [inputs]);

  return data;
};