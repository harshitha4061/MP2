from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# Load your dataset once when the server starts
df = pd.read_csv("combined_dataset.csv")

@app.route('/api/submit', methods=['POST'])
def submit():
    data = request.get_json()

    if not data or "name" not in data:
        return jsonify({"error": "Name field is required"}), 400

    name = data["name"]

    # Search for matching record (case-insensitive)
    match = df[df["Name"].str.lower() == name.lower()]

    if match.empty:
        return jsonify({"error": "No match found in dataset"}), 404

    # Convert match row to string
    matched_record_str = match.to_string(index=False)

    # Save matched record to file (overwrite mode)
    with open("data.txt", "w") as file:
        file.write(matched_record_str)

    return jsonify({"message": "Matching record saved to file!"}), 200

if __name__ == '__main__':
    app.run(debug=True)

