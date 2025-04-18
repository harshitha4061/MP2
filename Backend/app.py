from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

from utils.whatif_handler import load_data_from_txt, apply_what_if_conditions

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
    with open("data.csv", "w") as file:
        file.write(matched_record_str)

    return jsonify({"message": "Matching record saved to file!"}), 200
    
@app.route('/api/whatif', methods=['GET'])
def run_what_if():
    try:
        sample = load_data_from_txt()
        result = apply_what_if_conditions(sample)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)

