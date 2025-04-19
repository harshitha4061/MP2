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
    return <p className="text-center text-xl text-red-500">No data available</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-5 text-blue-600">Customer Credit Risk Info</h2>
      
      <div className="space-y-4">
        {/* <p><strong className="text-lg">Customer ID:</strong> <span className="text-gray-700">{customerData.CUST_ID}</span></p> */}
        <p><strong className="text-lg">Name:</strong> <span className="text-gray-700">{customerData.Name}</span></p>
        <p><strong className="text-lg">Total Score:</strong> <span className="text-gray-700">{customerData["Total Score"]}</span></p>
        <p><strong className="text-lg">Overall Credit Risk:</strong> 
          <span className={`font-bold ${
            customerData["Risk Level"] === "High" ? 'text-red-600' : customerData["Risk Level"] === "Low" ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {customerData["Risk Level"]}
          </span>
        </p>
      </div>

      <h3 className="text-2xl font-semibold mt-6 text-gray-800">Category Scores:</h3>
      <ul className="space-y-2 mt-2">
        {Object.entries(customerData["Category Scores"] || {}).map(([key, value]) => (
          <li key={key} className="flex justify-between">
            <span className="font-medium text-gray-600">{key}:</span>
            <span className="text-gray-800">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreditRiskDisplay;
