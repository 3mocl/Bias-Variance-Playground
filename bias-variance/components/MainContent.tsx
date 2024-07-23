// MainContent.tsx
"use client";

import React, { useState } from "react";
import Input, { InputValues } from "./Input";
import Playground from "./Playground";
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

  const generatedData = useGeneratedData(inputValues);

  const handleInputChange = (newInputs: InputValues) => {
    setInputValues(newInputs);
  };

  return (
    <div className="container mx-auto p-4 max-container padding-container flex">
      <div className="w-1/4">
        <Input onInputChange={handleInputChange} />
      </div>
      <div className="w-3/4 flexCenter">
        <Playground inputs={inputValues} data={generatedData} />
      </div>
    </div>
  );
};

export default MainContent;