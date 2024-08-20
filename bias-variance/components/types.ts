// types.ts

export interface PlaygroundProps {
    inputs: InputValues;
    
  }
  
  export interface InputValues {
    dataset: string;
    pointCount: number;
    typeOfMethod: string;
    noiseCount: number;
    degreeCount: number;
    seed: string;
    degreesOfFreedom: number;
  }
  
  export interface InputSectionProps {
    onInputChange: (inputs: InputValues) => void;
  }
  
  export interface Results {
    bias: number;
    variance: number;
    mse: number;
  }
  