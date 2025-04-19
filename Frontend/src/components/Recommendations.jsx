import React, { useState } from "react";

function Recommendations() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/whatif", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to fetch recommendations.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 shadow-lg rounded-lg border">
      <h2 className="text-3xl font-bold mb-5 text-center text-gray-800">
        Credit Recommendations
      </h2>

      <div className="text-center">
        <button
          onClick={fetchRecommendations}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition duration-300"
        >
          Get Recommendations
        </button>
      </div>

      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

      {result && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 text-center mb-6">
            Original Score:{" "}
            <span className="text-green-700 font-bold">
              {result.original_score}
            </span>
          </h3>

          <div className="flex overflow-x-auto space-x-6 px-4 py-2">
            {result.recommendations.length === 0 ? (
              <p>No improvement suggestions found.</p>
            ) : (
              result.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="min-w-[250px] bg-white border border-gray-200 rounded-xl shadow-md p-4 transition-transform transform hover:scale-105 hover:shadow-lg flex-shrink-0"
                >
                  <p className="font-medium text-gray-800 mb-2">
                    {rec.condition}
                  </p>
                  <p className="text-sm text-gray-600">
                    Predicted Score:{" "}
                    <span className="text-green-700 font-semibold">
                      {rec.predicted_score}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    ↑ Improvement:{" "}
                    <span className="font-medium text-blue-600">
                      {rec.improvement}
                    </span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommendations;
