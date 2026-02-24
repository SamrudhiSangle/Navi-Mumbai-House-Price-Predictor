from fastapi import APIRouter, HTTPException
import joblib
import pandas as pd
import os
import logging
from ..models.schemas import PredictionRequest, PredictionResponse, HealthResponse

router = APIRouter()
logger = logging.getLogger(__name__)

# Path to the model
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "model_artifacts")
MODEL_PATH = os.path.join(MODEL_DIR, "model.joblib")

# Global variable to hold the model
model_pipeline = None

@router.on_event("startup")
async def load_model():
    global model_pipeline
    try:
        if os.path.exists(MODEL_PATH):
            model_pipeline = joblib.load(MODEL_PATH)
            logger.info("Machine Learning model loaded successfully.")
        else:
            logger.warning(f"Model not found at {MODEL_PATH}. Prediction endpoint will fail until model is trained.")
    except Exception as e:
        logger.error(f"Error loading model: {e}")

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint useful for container environments like Render."""
    return HealthResponse()

@router.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Predict the price of a house in Navi Mumbai given its features.
    """
    global model_pipeline
    if model_pipeline is None:
        raise HTTPException(status_code=503, detail="Machine Learning model is not available. Please train it first.")

    try:
        # Convert request to pandas dataframe
        # Order must match what model was trained on: 'location', 'area_sqft', 'bhk', 'bathrooms', 'age_of_property', 'parking', 'lift'
        input_data = {
            'location': [request.location],
            'area_sqft': [request.area_sqft],
            'bhk': [request.bhk],
            'bathrooms': [request.bathrooms],
            'age_of_property': [request.age_of_property],
            'parking': [request.parking],
            'lift': [request.lift]
        }
        df = pd.DataFrame(input_data)
        
        # Predict
        prediction = model_pipeline.predict(df)[0]
        
        return PredictionResponse(predicted_price=round(float(prediction), 2))
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=400, detail=str(e))
