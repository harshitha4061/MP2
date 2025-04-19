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

  // Helper function for risk icons
  const getRiskIcon = (level = "") => {
    const risk = level.trim().toLowerCase();
    if (risk.includes("low")) return "";   // Placeholder: Add icon or emoji
    if (risk.includes("medium")) return ""; 
    if (risk.includes("high")) return "";   
    return "❓"; // Fallback emoji if unknown level
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Customer Credit Risk Info</h2>

      <div className="space-y-3 text-lg text-gray-700">
        {/* Uncomment if needed */}
        {/* <p><strong>Customer ID:</strong> {customerData.CUST_ID}</p> */}
        <p><strong>Name:</strong> {customerData.Name}</p>
        <p><strong>Total Score:</strong> <span className="font-semibold text-blue-700">{customerData["Total Score"]}</span></p>
        <p>
          <strong>Overall Credit Risk:</strong>{' '}
          <span className={`font-semibold ${
            customerData["Risk Level"] === 'High' ? 'text-red-600' :
            customerData["Risk Level"] === 'Medium' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {customerData["Risk Level"]} {getRiskIcon(customerData["Risk Level"])}
          </span>
        </p>
      </div>

      <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Category Scores</h3>

      <div className="flex flex-wrap gap-4">
        {Object.entries(customerData["Category Scores"] || {}).map(([key, value]) => (
          <div
            key={key}
            className="w-[180px] p-4 bg-gray-50 border rounded-xl shadow hover:shadow-md transform hover:scale-105 transition-all duration-200 ease-in-out"
          >
            <p className="font-medium text-gray-700 mb-1">{key}</p>
            <p className="text-lg font-bold text-indigo-700">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditRiskDisplay;

