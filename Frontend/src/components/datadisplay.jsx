import React from 'react';

const CreditRiskDisplay = ({ data }) => {
  // Assuming `data.results` contains the array of credit risk data, we pick the first entry
  const customerData = data?.results?.[0]; 

  if (!customerData) {
    return <p>No data available</p>; // Fallback for missing data
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: 'auto' }}>
      <h2>Customer Credit Risk Info</h2>
      <p><strong>Customer ID:</strong> {customerData.CUST_ID}</p>
      <p><strong>Name:</strong> {customerData.Name}</p>
      <p><strong>Total Score:</strong> {customerData["Total Score"]}</p>
      <p><strong>Overall Credit Risk:</strong> {customerData["Risk Level"]}</p>
      <h3>Category Scores:</h3>
      <ul>
        {Object.entries(customerData["Category Scores"] || {}).map(([key, value]) => (
          <li key={key}><strong>{key}:</strong> {value}</li>
        ))}
      </ul>
    </div>
  );
};

export default CreditRiskDisplay;
