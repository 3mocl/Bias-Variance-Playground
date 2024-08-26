import React, { useEffect, useState } from "react";
import { createModel } from "polynomial-regression";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Scatter, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface InputValues {
  dataset: string;
  pointCount: number;
  noiseCount: number;
  degreeCount: number;
  seed: string;
}

interface DataPoint {
  x: number;
  y: number;
  fx: number;
}

interface GeneratedData {
  trainingData: DataPoint[];
  testData: DataPoint[];
}

interface BiasAndVarianceProps {
  inputValues: InputValues;
  generatedData: GeneratedData;
}

interface ResultRow {
  degree: number;
  bias_sq: number;
  variance: number;
  test_mse: number;
  training_mse: number;
}

const BiasAndVariance: React.FC<BiasAndVarianceProps> = ({
  inputValues,
  generatedData,
}) => {
  const [results, setResults] = useState<ResultRow[] | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    calculateBiasAndVariance();
  }, [inputValues, generatedData]);

  const calculateBiasAndVariance = () => {
    const num_training_points = inputValues.pointCount;
    const num_rep_sets = 100; // You can adjust this value
    const noise_sd = inputValues.noiseCount;
    // const degrees = inputValues.degreeCount ;
    const degrees =  Array.from(
      { length: inputValues.degreeCount },
      (_, i) => i + 1
    );

    const x_matrix: number[][] = [];
    const fx_matrix: number[][] = [];
    const noise_matrix: number[][] = [];
    const y_matrix: number[][] = [];

    for (let i = 0; i < num_rep_sets; i++) {
      const x = generatedData.trainingData
        .slice(0, num_training_points)
        .map((point) => point.x);
      const fx = generatedData.trainingData
        .slice(0, num_training_points)
        .map((point) => point.fx);
      const noise = Array.from({ length: num_training_points }, () =>
        gaussianRandom(0, noise_sd)
      );
      const y = fx.map((fxi, index) => fxi + noise[index]);

      x_matrix.push(x);
      fx_matrix.push(fx);
      noise_matrix.push(noise);
      y_matrix.push(y);
    }

    const x_test = generatedData.testData.map((point) => point.x);
    const fx_test = generatedData.testData.map((point) => point.fx);

    const bias_sq: number[] = [];
    const variance: number[] = [];
    const training_mse: number[] = [];

    for (const degree of degrees) {
      const model = createModel();
      model.fit(
        generatedData.trainingData.map((point) => [point.x, point.y]),
        [degree]
      );
      const y_hat_orig = generatedData.trainingData.map((point) =>
        model.estimate(degree, point.x)
      );
      const train_mse = mean(
        generatedData.trainingData.map((point, i) =>
          Math.pow(point.y - y_hat_orig[i], 2)
        )
      );

      const df_preds: number[][] = [];

      for (let j = 0; j < num_rep_sets; j++) {
        const model_rep = createModel();
        model_rep.fit(
          x_matrix[j].map((x, i) => [x, y_matrix[j][i]]),
          [degree]
        );
        const y_hat_test = x_test.map((x) => model_rep.estimate(degree, x));
        df_preds.push(y_hat_test);
      }

      const E_y_hat = df_preds[0].map((_, i) =>
        mean(df_preds.map((row) => row[i]))
      );
      const V_y_hat = df_preds[0].map((_, i) =>
        varianceCalc(df_preds.map((row) => row[i]))
      );
      const bias_squared = E_y_hat.map((e, i) => Math.pow(e - fx_test[i], 2));

      training_mse.push(train_mse);
      bias_sq.push(mean(bias_squared));
      variance.push(mean(V_y_hat));
    }

    const results = degrees.map((degree, i) => ({
      degree,
      bias_sq: bias_sq[i],
      variance: variance[i],
      test_mse: bias_sq[i] + variance[i] + Math.pow(noise_sd, 2),
      training_mse: training_mse[i],
    }));

    setResults(results);
  };

  useEffect(() => {
    if (results) {
      prepareChartData();
    }
  }, [results, generatedData]);

  const prepareChartData = () => {
    if (!results) {
      return;
    }

    const trainingData = {
      datasets: [
        {
          label: "Training Data",
          data: generatedData.trainingData.map((point) => ({
            x: point.x,
            y: point.y,
          })),
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
        ...["blue", "red", "cyan"].map((color, index) => ({
          label: `Degree ${index + 1}`,
          data: generatePolynomialFit(index + 1),
          borderColor: color,
          backgroundColor: "rgba(0, 0, 0, 0)",
          type: "line" as const,
        })),
      ],
    };

    const biasData = {
      labels: results.map((row) => row.degree.toString()),
      datasets: [
        {
          label: "Bias",
          data: results.map((row) => row.bias_sq),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };

    const varianceData = {
      labels: results.map((row) => row.degree.toString()),
      datasets: [
        {
          label: "Variance",
          data: results.map((row) => row.variance),
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        },
      ],
    };

    const mseData = {
      labels: results.map((row) => row.degree.toString()),
      datasets: [
        {
          label: "Test MSE",
          data: results.map((row) => row.test_mse),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132)",
        },
        {
          label: "Training MSE",
          data: results.map((row) => row.training_mse),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235)",
        },
      ],
    };

    setChartData({ trainingData, biasData, varianceData, mseData });
  };

  const generatePolynomialFit = (degree: number) => {
    const model = createModel();
    model.fit(
      generatedData.trainingData.map((point) => [point.x, point.y]),
      [degree]
    );
    return generatedData.trainingData.map((point) => ({
      x: point.x,
      y: model.estimate(degree, point.x),
    }));
  };

  const gaussianRandom = (mean: number, std: number): number => {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * std + mean;
  };

  const mean = (arr: number[]): number =>
    arr.reduce((a, b) => a + b, 0) / arr.length;

  const varianceCalc = (arr: number[]): number => {
    const m = mean(arr);
    return mean(arr.map((x) => Math.pow(x - m, 2)));
  };

  if (!results || !chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 ml-2">Bias and Variance Results</h2>
      {/* <div style={{ height: "400px", marginBottom: "20px" }}>
        <Scatter
          data={chartData.trainingData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Training Data with Polynomial Fits",
              },
            },
          }}
        />
      </div> */}
      <div
        style={{ height: "400px", width: "630px" }}
        className="flex ml-20"
      >
        <Bar
          data={chartData.biasData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "",
              },
            },
          }}
        />
        <Bar
          data={chartData.varianceData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "",
              },
            },
          }}
        />
        {/* <Line
          data={chartData.mseData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "",
              },
            },
          }}
        /> */}
      </div>
    </div>
  );
};

export default BiasAndVariance;
