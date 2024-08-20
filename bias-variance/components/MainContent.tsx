// MainContent.tsx
"use client";

import React, { useState } from "react";
import Input, { InputValues } from "./Input";
import Playground from "./Playground";
import BiasAndVariance from "./BiasVarianceCalculations";
import { useGeneratedData } from "./DataGeneration";

const MainContent: React.FC = () => {
  const [inputValues, setInputValues] = useState<InputValues>({
    dataset: "dataset1",
    pointCount: 100,
    typeOfMethod: "regression",
    noiseCount: 1,
    degreeCount: 1,
    seed: "default",
    degreesOfFreedom: 10,
  });

  const handleInputChange = (newInputs: InputValues) => {
    setInputValues(newInputs);
  };

  const generatedData = useGeneratedData(inputValues);

  return (
    <div className="container max-container">
      <div className="container mx-auto p-4 max-container padding-container flex">
        <div className="w-1/4">
          <Input onInputChange={handleInputChange} />
        </div>
        <div className="w-3/4 flexCenter">
          <Playground inputs={inputValues} data={generatedData} />
        </div>
      </div>
      <div className="">
        <BiasAndVariance
          inputValues={inputValues}
          generatedData={generatedData}
        />
      </div>
    </div>
  );
};

export default MainContent;
