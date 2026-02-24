import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Paths
DATA_PATH = '../navi_mumbai_real_estate_cleaned_2500_cleaned.csv'
MODEL_DIR = '../backend/model_artifacts'

def load_data(filepath):
    """Load the dataset."""
    df = pd.read_csv(filepath)
    return df

def build_pipeline():
    """Build the ML pipeline for numerical and categorical features."""
    
    # We will use these exact features for prediction
    numerical_features = ['area_sqft', 'bhk', 'bathrooms', 'age_of_property']
    categorical_features = ['location']
    
    # Note: 'parking' and 'lift' are already 0/1 in the dataset, but we will 
    # treat them as passthrough or just add them to numerical if we decide to use them.
    # We will use parking and lift as raw features
    passthrough_features = ['parking', 'lift']

    # Preprocessing steps for numerical and categorical data
    numeric_transformer = Pipeline(steps=[
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    # Combine preprocessing steps
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numerical_features),
            ('cat', categorical_transformer, categorical_features),
            ('pass', 'passthrough', passthrough_features)
        ])

    # Create a full pipeline with the regressor
    # Using RandomForestRegressor for good default performance
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    
    return model_pipeline

def train_model():
    print("Loading data...")
    try:
        df = load_data(DATA_PATH)
    except FileNotFoundError:
        print(f"Error: Could not find dataset at {DATA_PATH}")
        return
        
    print(f"Dataset shape: {df.shape}")
    
    # Check for missing values
    if df.isnull().sum().sum() > 0:
        print("Handling missing values...")
        df = df.dropna()
        
    # Define features and target
    features = ['location', 'area_sqft', 'bhk', 'bathrooms', 'age_of_property', 'parking', 'lift']
    target = 'actual_price'
    
    X = df[features]
    y = df[target]
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Building pipeline...")
    pipeline = build_pipeline()
    
    print("Training model...")
    pipeline.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    print(f"Model Performance Metrics:")
    print(f"MAE:  ₹{mae:,.2f}")
    print(f"RMSE: ₹{rmse:,.2f}")
    print(f"R²:   {r2:.4f}")
    
    # Save the model
    print("Saving model artifacts...")
    os.makedirs(MODEL_DIR, exist_ok=True)
    model_path = os.path.join(MODEL_DIR, 'model.joblib')
    joblib.dump(pipeline, model_path)
    print(f"Model saved successfully to {model_path}")

if __name__ == "__main__":
    train_model()
