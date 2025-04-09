import React, { useState } from "react";

function FormComponent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // allows sending cookies/auth
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Form submitted successfully!");
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
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Enter Age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Submit
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

export default FormComponent;
