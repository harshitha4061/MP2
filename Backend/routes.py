from flask import Blueprint, request, jsonify
import pandas as pd

search_bp = Blueprint("search", __name__)

# Load dataset
dataset_path = "combined_dataset.csv"
df = pd.read_csv(dataset_path)

@search_bp.route('/api/search', methods=['POST'])
def search_record():
    query = request.form.get("name")  

    if not query:
        return jsonify({"error": "Missing search parameter"}), 400

    matched_records = df[df["name"].str.lower() == query.lower()]

    if not matched_records.empty:
        return jsonify(matched_records.to_dict(orient="records"))  
    else:
        return jsonify({"error": "No record found"}), 404
