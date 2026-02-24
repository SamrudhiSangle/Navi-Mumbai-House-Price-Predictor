from pydantic import BaseModel, Field
from typing import Optional

class PredictionRequest(BaseModel):
    location: str = Field(..., description="Node or area in Navi Mumbai")
    area_sqft: float = Field(..., gt=0, description="Area in Square Feet")
    bhk: float = Field(..., gt=0, description="Number of Bedrooms, Hall, Kitchen")
    bathrooms: float = Field(..., ge=0, description="Number of Bathrooms")
    age_of_property: float = Field(0, ge=0, description="Age of the property in years")
    parking: int = Field(0, ge=0, le=1, description="1 if parking available, 0 otherwise")
    lift: int = Field(0, ge=0, le=1, description="1 if lift available, 0 otherwise")
    
class PredictionResponse(BaseModel):
    predicted_price: float
    currency: str = "INR"
    status: str = "success"

class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str = "1.0.0"
