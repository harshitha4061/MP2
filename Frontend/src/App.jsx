import React, { useEffect, useState } from 'react';
import Form from './components/form';
import CreditRiskDisplay from './components/datadisplay';
import axios from 'axios';

const App = () => {
  const [creditData, setCreditData] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/upload-score', {
      method: 'GET',
      credentials: 'include', // 👈 include credentials like cookies
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

  return (
    <div>
      <Form />
      {creditData ? (
        <CreditRiskDisplay data={creditData} />
      ) : (
        <p style={{ textAlign: 'center' }}>Loading credit risk data...</p>
      )}
    </div>
  );
};

export default App;
