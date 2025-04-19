import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For route navigation

const Home = () => {
    const [name, setName] = useState(''); // To store the fetched name
    const [creditData, setCreditData] = useState(null); // For storing credit data
    const navigate = useNavigate(); // For route navigation

    // Fetch name and credit data on component mount
    useEffect(() => {
        const fetchNameAndData = async () => {
            try {
                // Fetch the name from the backend
                const nameResponse = await fetch('http://127.0.0.1:5000/get-name', {
                    method: 'GET',
                    credentials: 'include', // Include credentials for the request
                });

                if (!nameResponse.ok) {
                    throw new Error(`Failed to fetch name: ${nameResponse.status}`);
                }
                const nameData = await nameResponse.json();
                setName(nameData.name); // Set the name in the state

                // Fetch the credit risk data
                const dataResponse = await fetch('http://127.0.0.1:5000/upload-score', {
                    method: 'GET',
                    credentials: 'include', // Include credentials for the request
                });

                if (!dataResponse.ok) {
                    throw new Error(`Failed to fetch credit risk data: ${dataResponse.status}`);
                }
                const data = await dataResponse.json();
                setCreditData(data); // Set the credit data in the state
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchNameAndData(); // Call the function to fetch data
    }, []); // Empty array to run the effect only once when the component is mounted

    // Handle navigation for the buttons
    const handleAnalysisClick = () => {
        navigate('/analysis');
    };

    const handleRecommendationClick = () => {
        navigate('/whatif');
    };

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-xl mt-10">
            {/* Greeting with dynamic name */}
            <h2 className="text-3xl font-semibold text-center mb-5 text-blue-600">
                Hello, {name || 'Guest'}
            </h2>
            {/* Welcome message */}
            <p className="text-center text-lg mb-6 text-gray-600">
                Welcome to our page! We help you optimize your financial decisions with advanced analytics and personalized credit insights.
            </p>
            <p className="text-center text-lg mb-6 text-gray-600">
                Our platform goes beyond traditional credit scoring models. We provide you with an accurate evaluation of your credit score by combining rule-based analysis with sophisticated predictive modeling. This approach allows us to assess your creditworthiness in a more dynamic and personalized manner.
            </p>
            <p className="text-center text-lg mb-6 text-gray-600">
                We also offer tailored recommendations to improve it. Whether it's managing your spending, optimizing your savings, or addressing specific debt issues, our tools will guide you through the steps to enhance your credit profile.
            </p>
            <p className="text-center text-lg mb-6 text-gray-600">
                Our goal is to empower you with actionable insights that help you build a healthier financial future. With our platform, improving your credit score becomes a clear, achievable goal.
            </p>


            {/* Button container */}
            <div className="flex justify-center space-x-4">
                {/* Analysis Button */}
                <button
                    onClick={handleAnalysisClick}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Analysis
                </button>
                {/* Recommendation Button */}
                <button
                    onClick={handleRecommendationClick}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    Recommendation
                </button>
            </div>
        </div>
    );
};

export default Home;

