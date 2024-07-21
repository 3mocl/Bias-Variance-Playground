"use client";

import React, { useState } from "react";

type InputSectionProps = {
  onInputChange: (inputs: InputValues) => void;
};

export type InputValues = {
  dataset: string;
  pointCount: number;
  typeOfMethod: string; // Spline or Polynomial Regression
  noiseCount: number; // Ranges from 1-5
  degreeCount: number;
  seed:string; // Ranges from 1-4
  degreesOfFreedom: number;
};

const InputSection: React.FC<InputSectionProps> = ({ onInputChange }) => {
  const [inputs, setInputs] = useState<InputValues>({
    dataset: "dataset1",
    pointCount: 100,
    typeOfMethod: "spline",
    noiseCount: 1,
    degreeCount: 1,
    seed: "default",
    degreesOfFreedom: 10,
  });

  const handleInputChange = (
    field: keyof InputValues,
    value: string | number
  ) => {
    const newInputs = { ...inputs, [field]: value };
    setInputs(newInputs);
    onInputChange(newInputs);
  };

  return (
    <div className="p-4 rounded-xl bg-amber-100 bg-opacity-35 max-container padding-container mr-5">
      <div className="ml-5">
        <h2 className="text-xl font-bold mb-0 font-montserrat">
          Playground Controls
        </h2>

        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text font-montserrat">
              Choose a Dataset:
            </span>
          </label>
          <select
            className="select select-bordered"
            value={inputs.dataset}
            onChange={(e) => handleInputChange("dataset", e.target.value)}
          >
            <option value="dataset1">Dataset #1</option>
            <option value="dataset2">Dataset #2</option>
            <option value="dataset3">Dataset #3</option>
            <option value="dataset4">Dataset #4</option>
          </select>
        </div>

        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text">
              Number of Points: {inputs.pointCount}
            </span>
          </label>
          <input
            type="range"
            min="10"
            max="500"
            value={inputs.pointCount}
            className="range range-primary"
            step="10"
            onChange={(e) =>
              handleInputChange("pointCount", parseInt(e.target.value))
            }
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>10</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>400</span>
            <span>500</span>
          </div>
        </div>

        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text font-montserrat">
              Type of Method:
            </span>
          </label>
          <select
            className="select select-bordered"
            value={inputs.typeOfMethod}
            onChange={(e) => handleInputChange("typeOfMethod", e.target.value)}
          >
            <option value="spline">Spline</option>
            <option value="regression">Polynomial Regression</option>
          </select>
        </div>

        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text font-montserrat">
              Seed:
            </span>
          </label>
          <select
            className="select select-bordered"
            value={inputs.seed}
            onChange={(e) => handleInputChange("seed", e.target.value)}
          >
            <option value="default">Default</option>
            <option value="random">Random</option>
          </select>
        </div>

        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text">
              Noise Level: {inputs.noiseCount}
            </span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={inputs.noiseCount}
            className="range range-primary"
            step="1"
            onChange={(e) =>
              handleInputChange("noiseCount", parseInt(e.target.value))
            }
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>

        {inputs.typeOfMethod === "spline" && (
        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text">
              Degrees of Freedom: {inputs.degreesOfFreedom}
            </span>
          </label>
          <input
            type="range"
            min="2"
            max="40"
            value={inputs.degreesOfFreedom}
            className="range range-primary"
            step="1"
            onChange={(e) =>
              handleInputChange("degreesOfFreedom", parseInt(e.target.value))
            }
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>2</span>
            <span>10</span>
            <span>20</span>
            <span>30</span>
            <span>40</span>
          </div>
        </div>
      )}

        {inputs.typeOfMethod === "regression" && (
          <div className="form-control w-full max-w-xs mb-4">
            <label className="label">
              <span className="label-text">
                Degree: {inputs.degreeCount}
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="4"
              value={inputs.degreeCount}
              className="range range-primary"
              step="1"
              onChange={(e) =>
                handleInputChange("degreeCount", parseInt(e.target.value))
              }
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSection;