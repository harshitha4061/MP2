import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FormComponent() {
  const [formData, setFormData] = useState({ name: "", email: "", age: "" });
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Form submitted successfully!");
        setTimeout(() => {
            navigate("/dashboard"); // ✅ redirect after submit
          }, 1000);
      } else {
        setMessage("Error submitting form. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage("Network error. Make sure the backend is running.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-5">Submit Your Details</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Enter Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="email" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="age" placeholder="Enter Age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Submit</button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}

      {submitted && (
        <div className="mt-6 flex justify-between">
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
      )}
    </div>
  );
}

export default FormComponent;
