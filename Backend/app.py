from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

from utils.whatif_handler import load_data_from_txt, apply_what_if_conditions, predict_score

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})


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

    matched_record_str = match.to_csv(index=False)  # Save the matched record in CSV format

    # Save matched record to file (overwrite mode)
    with open("data.txt", "w") as file:
        file.write(matched_record_str)


    return jsonify({"message": "Matching record saved to file!"}), 200
    
@app.route('/api/whatif', methods=['GET'])
def run_what_if():
    try:
        sample = pd.read_csv("data.txt") 
        result = apply_what_if_conditions(sample)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)})




feature_thresholds = {
    "R_DEBT_INCOME": [(0.2, 2), (0.4, 1), (float('inf'), 0)],  # 2 for <= 0.2, 1 for <= 0.4, 0 for > 0.4
    "R_HOUSING_DEBT": [(0.1, 2), (0.3, 1), (float('inf'), 0)],   # 2 for <= 0.1, 1 for <= 0.3, 0 for > 0.3
    "R_GROCERIES_DEBT": [(0.1, 2), (0.25, 1), (float('inf'), 0)], # Adjust according to your needs
    "R_GAMBLING_DEBT": [(0.01, 2), (0.03, 1), (float('inf'), 0)],
    "R_TAX_DEBT": [(0.05, 2), (0.1, 1), (float('inf'), 0)],
    "R_EXPENDITURE": [(0.4, 2), (0.6, 1), (float('inf'), 0)],
    "R_EXPENDITURE_INCOME": [(0.3, 2), (0.5, 1), (float('inf'), 0)],
    "R_GAMBLING_INCOME": [(0.02, 2), (0.05, 1), (float('inf'), 0)],
    "T_GAMBLING_12": [(500, 2), (1500, 1), (float('inf'), 0)],
    "T_HEALTH_12": [(2000, 2), (5000, 1), (float('inf'), 0)],
    "R_HEALTH": [(0.05, 2), (0.1, 1), (float('inf'), 0)],
    "T_HOUSING_12": [(2000, 2), (5000, 1), (float('inf'), 0)],
    "T_TRAVEL_12": [(1000, 2), (3000, 1), (float('inf'), 0)],
    "R_TRAVEL": [(0.05, 2), (0.1, 1), (float('inf'), 0)],
    "T_GROCERIES_12": [(3000, 2), (6000, 1), (float('inf'), 0)],
    "R_GROCERIES": [(0.05, 2), (0.1, 1), (float('inf'), 0)],
    "R_FINES_INCOME": [(0.005, 2), (0.01, 1), (float('inf'), 0)],
    "SAVINGS": [(10000, 2), (3000, 1), (float('-inf'), 0)],
    "R_ENTERTAINMENT": [(0.05, 2), (0.1, 1), (float('inf'), 0)],
    "DEFAULT": [(0.5, 2), (1, 1), (float('inf'), 0)],
}


category_definitions = {
    "Debt Burden": {
        "features": {
            "R_DEBT_INCOME": 0.4,
            "R_HOUSING_DEBT": 0.2,
            "R_GROCERIES_DEBT": 0.1,
            "R_GAMBLING_DEBT": 0.1,
            "R_TAX_DEBT": 0.2,
        }
    },
    "Spending Ratio": {
        "features": {
            "R_EXPENDITURE": 0.5,
            "R_EXPENDITURE_INCOME": 0.5,
        }
    },
    "Gambling Risk": {
        "features": {
            "R_GAMBLING_INCOME": 0.6,
            "T_GAMBLING_12": 0.4,
        }
    },
    "Health Spending": {
        "features": {
            "T_HEALTH_12": 0.6,
            "R_HEALTH": 0.4,
        }
    },
    "Housing Commitments": {
        "features": {
            "T_HOUSING_12": 0.6,
            "R_HOUSING_DEBT": 0.4,
        }
    },
    "Travel Habits": {
        "features": {
            "T_TRAVEL_12": 0.5,
            "R_TRAVEL": 0.5,
        }
    },
    "Groceries": {
        "features": {
            "T_GROCERIES_12": 0.5,
            "R_GROCERIES": 0.5,
        }
    },
    "Fines / Penalties": {
        "features": {
            "R_FINES_INCOME": 1.0,
        }
    },
    "Savings": {
        "features": {
            "SAVINGS": 1.0,
        }
    },
    "Entertainment": {
        "features": {
            "R_ENTERTAINMENT": 1.0,
        }
    },
    "DEFAULT History": {
        "features": {
            "DEFAULT": 1.0,
        }
    },
    "Tax Behavior": {
        "features": {
            "R_TAX_DEBT": 1.0,
        }
    },
}

# Ensure scores are 0, 1, or 2
def score_feature(value, feature):
    thresholds = feature_thresholds.get(feature, [])
    for threshold, score in thresholds:
        if value <= threshold:
            return score  # Return the score as integer (0, 1, or 2)
    return 0  # Default to 0 if no thresholds are matched

def load_data_from_txt():
    try:
        df = pd.read_csv("data.txt")  # or whatever logic you have
        return df, None
    except Exception as e:
        return None, str(e)

@app.route("/upload-score", methods=["GET"])  # Use GET since we're not posting data
def upload_score():
    # Read data from the 'data.txt' file
    df, error = load_data_from_txt()
    if error:
        return jsonify({"error": f"Failed to read file: {error}"}), 400

    results = []
    for _, row in df.iterrows():
        score = 0
        category_scores = {}
        for category, meta in category_definitions.items():
            cat_score = 0
            for feature, weight in meta["features"].items():
                val = row.get(feature, 0)
                feature_score = score_feature(val, feature)
                cat_score += feature_score * weight
            category_scores[category] = int(round(cat_score))  # Ensure category score is an integer
            score += cat_score

        # Ensure total score is an integer and classify risk based on integer score
        total_score = int(round(score))

        risk = (
            "Good ✅" if total_score >= 20 else
            "Medium ⚠️" if total_score >= 12 else
            "Bad ❌"
        ) 
        
        results.append({
            "CUST_ID": row.get("CUST_ID", "UNKNOWN"),
            "Name": row.get("Name", ""),
            "Total Score": total_score,
            "Risk Level": risk,
            "Category Scores": category_scores
        })

    return jsonify({"results": results})

if __name__ == '__main__':
    app.run(debug=True)
