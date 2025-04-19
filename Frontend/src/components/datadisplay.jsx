import React, { useEffect, useState } from 'react';

const CreditRiskDisplay = () => {
  const [creditData, setCreditData] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/upload-score', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCreditData(data);
      })
      .catch((error) => {
        console.error("Error fetching credit risk data:", error);
      });
  }, []);

  const customerData = creditData?.results?.[0];

  if (!customerData) {
    return <p className="text-center mt-6 text-red-600">No data available</p>;
  }

  const getRiskIcon = (level = "") => {
    const risk = level.trim().toLowerCase();
    if (risk.includes("low")) return "🟢";
    if (risk.includes("medium")) return "🟡";
    if (risk.includes("high")) return "🔴";
    return "❓";
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 shadow-lg rounded-lg border bg-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Customer Credit Risk Info
      </h2>

      <div className="text-center text-lg space-y-2 text-gray-700 mb-6">
        <p><strong>Name:</strong> {customerData.Name}</p>
        <p>
          <strong>Total Score:</strong>{" "}
          <span className="font-semibold text-blue-700">
            {customerData["Total Score"]}
          </span>
        </p>
        <p>
          <strong>Overall Credit Risk:</strong>{" "}
          <span
            className={`font-bold ${
              customerData["Risk Level"] === "High"
                ? "text-red-600"
                : customerData["Risk Level"] === "Medium"
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {customerData["Risk Level"]} {getRiskIcon(customerData["Risk Level"])}
          </span>
        </p>
      </div>

      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Category Scores
      </h3>

      <div className="flex overflow-x-auto space-x-6 px-4 py-2">
        {Object.entries(customerData["Category Scores"] || {}).map(([key, value]) => (
          <div
            key={key}
            className="min-w-[250px] bg-gray-50 border border-gray-200 rounded-xl shadow-md p-4 transition-transform transform hover:scale-105 hover:shadow-lg flex-shrink-0"
          >
            <p className="font-medium text-gray-800 mb-2">{key}</p>
            <p className="text-lg text-indigo-700 font-bold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditRiskDisplay;
