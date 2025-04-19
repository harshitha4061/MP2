import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-20 text-center space-y-6">
      <h2 className="text-2xl font-bold">Welcome!</h2>
      <p>Your form has been submitted successfully.</p>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/recommendations")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Recommendations
        </button>
        <button
          onClick={() => navigate("/analysis")}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Get Analysis
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
