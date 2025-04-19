import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from './components/form';
import Recommendations from './components/Recommendations';
import CreditRiskDisplay from './components/datadisplay';
import Dashboard from './components/DB'; // ✅ Step 1: Import Dashboard

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ Step 2 */}
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/analysis" element={<CreditRiskDisplayWrapper />} />
      </Routes>
    </Router>
  );
};

const CreditRiskDisplayWrapper = () => {
  const [creditData, setCreditData] = React.useState(null);

  React.useEffect(() => {
    fetch('http://127.0.0.1:5000/upload-score', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setCreditData(data))
      .catch((err) => console.error('Error fetching credit data:', err));
  }, []);

  return creditData ? (
    <CreditRiskDisplay data={creditData} />
  ) : (
    <p className="text-center mt-4">Loading analysis...</p>
  );
};

export default App;
