import pandas as pd
import joblib

model = joblib.load("model/credit_model.pkl")
scaler = joblib.load("model/scaler.pkl")

def load_data_from_txt():
    with open("data.txt", "r") as file:
        lines = file.readlines()
        header = lines[0].strip().split()
        values = lines[1].strip().split()
        data_dict = dict(zip(header, values))
        df = pd.DataFrame([data_dict]) 
       

        # Convert numeric columns
        for col in df.columns:
            try:
                df[col] = pd.to_numeric(df[col])
            except:
                pass
        return df


# List of expected columns
# List of expected columns
MODEL_FEATURES = [
    'R_DEBT_INCOME', 'R_ENTERTAINMENT', 'R_FINES_INCOME', 'T_GAMBLING_12',
       'R_GAMBLING_INCOME', 'R_GROCERIES', 'T_HEALTH_12', 'T_HOUSING_12',
       'R_TAX_DEBT', 'T_TRAVEL_12', 'R_EXPENDITURE', 'R_EXPENDITURE_INCOME',
       'DEFAULT'
]


def predict_score(df):
    # Ensure all required features are present, fill missing ones with 0
    for col in MODEL_FEATURES:
        if col not in df.columns:
            df[col] = 0

    input_data = df[MODEL_FEATURES].copy()

    # Make sure all data is numeric (convert bools as 1/0 if needed)
    input_data = input_data.apply(pd.to_numeric, errors='coerce')

    if input_data.isnull().values.any():
        raise ValueError("Input contains NaNs. Please check preprocessing.")

    # Convert numpy float32 to regular float
    return float(model.predict(input_data)[0])  # Convert to Python float


def apply_what_if_conditions(original_df):
    recommendations = []
    # # Use the original score from the file (if present)
    # if "CREDIT_SCORE" in original_df.columns:
    #     original_score = float(original_df["CREDIT_SCORE"].values[0]) 
    # else:
    # # fallback if CREDIT_SCORE is missing
    #     original_score = predict_score(original_df)

    original_score = predict_score(original_df)



    conditions = [
    # 1. Increase R_DEBT_INCOME to reduce debt-to-income ratio
    ("Increase R_DEBT_INCOME by 20%", lambda df: df.assign(R_DEBT_INCOME=df["R_DEBT_INCOME"] * 1.2)),
    
    # 2. Increase R_ENTERTAINMENT to simulate increased spending 
    ("Increase R_ENTERTAINMENT by 20%", lambda df: df.assign(R_ENTERTAINMENT=df["R_ENTERTAINMENT"] * 1.2)),
    
    # 3. Reduce R_FINES_INCOME to simulate clearing fines
    ("Reduce R_FINES_INCOME by 50%", lambda df: df.assign(R_FINES_INCOME=df["R_FINES_INCOME"] * 0.5)),
    
    # 4. Reduce T_GAMBLING_12 to reduce gambling expenditure
    ("Reduce T_GAMBLING_12 by 30%", lambda df: df.assign(T_GAMBLING_12=df["T_GAMBLING_12"] * 0.7)),
    
    # 5. Reduce R_GAMBLING_INCOME to minimize gambling-related income
    ("Reduce R_GAMBLING_INCOME by 30%", lambda df: df.assign(R_GAMBLING_INCOME=df["R_GAMBLING_INCOME"] * 0.7)),
    
    # 6. Increase R_GROCERIES to simulate higher grocery expenses
    ("Increase R_GROCERIES by 20%", lambda df: df.assign(R_GROCERIES=df["R_GROCERIES"] * 1.2)),
    
    # 7. Increase T_HEALTH_12 to simulate increased health expenses
    ("Increase T_HEALTH_12 by 20%", lambda df: df.assign(T_HEALTH_12=df["T_HEALTH_12"] * 1.2)),
    
    # 8. Reduce T_HOUSING_12 to simulate lower housing costs
    ("Reduce T_HOUSING_12 by 15%", lambda df: df.assign(T_HOUSING_12=df["T_HOUSING_12"] * 0.85)),
    
    # 9. Reduce R_TAX_DEBT to clear tax debts
    ("Reduce R_TAX_DEBT by 25%", lambda df: df.assign(R_TAX_DEBT=df["R_TAX_DEBT"] * 0.75)),
    
    # 10. Increase T_TRAVEL_12 to simulate increased travel expenses
    ("Increase T_TRAVEL_12 by 10%", lambda df: df.assign(T_TRAVEL_12=df["T_TRAVEL_12"] * 1.1)),
    
    # 11. Reduce R_EXPENDITURE_INCOME to show improved financial health
    ("Increase R_EXPENDITURE_INCOME by 10%", lambda df: df.assign(R_EXPENDITURE_INCOME=df["R_EXPENDITURE_INCOME"] * 1.1)),
    
    # 12. Set DEFAULT to 0 to remove default status
    ("Set DEFAULT to 0", lambda df: df.assign(DEFAULT=0)),
    
    # 13. Reduce R_ENTERTAINMENT to simulate lower entertainment spending
    ("Reduce R_ENTERTAINMENT by 20%", lambda df: df.assign(R_ENTERTAINMENT=df["R_ENTERTAINMENT"] * 0.8)),
]

    for description, modify_func in conditions:
        try:
            modified_df = modify_func(original_df.copy())
            new_score = predict_score(modified_df)
            print(modified_df) 

            if new_score > original_score:
                recommendations.append({
                    "condition": description,
                    "predicted_score": round(new_score, 2),
                    "improvement": round(new_score - original_score, 2)
                })
        except Exception as e:
            print(f"Skipping condition '{description}' due to error: {e}")
            continue

    response = {
    "original_score": round(float(original_score), 2),  # Make sure it's a Python float
    "recommendations": recommendations
    }
    return response  # Add the return statement here 
