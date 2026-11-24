from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, datetime

class CropSchema(BaseModel):
    id: str
    name: str
    category: str
    image_url: Optional[str] = None
    local_names: Optional[Dict[str, str]] = {}
    is_active: bool = True

class MarketSchema(BaseModel):
    id: str
    name: str
    state: str
    district: str
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_active: bool = True

class MarketPriceSchema(BaseModel):
    id: str
    crop_id: str
    market_id: str
    observation_date: str
    min_price: float
    max_price: float
    modal_price: float
    unit: str = "kg"
    source: str = "AGMARKNET"
    is_demo: bool = True

class PriceForecastSchema(BaseModel):
    crop_id: str
    market_id: str
    forecast_date: str
    predicted_price: float
    lower_estimate: float
    upper_estimate: float
    trend_direction: str = "stable"
    model_version: str = "baseline-v1"
    uncertainty_note: str = "This is an estimate, not a guaranteed price."
    is_demo: bool = True

class MarketComparisonItem(BaseModel):
    market_id: str
    market_name: str
    district: str
    modal_price: float
    estimated_distance_km: float
    estimated_transport_cost: float
    estimated_net_proceeds: float
    is_best_value: bool = False
    observation_date: str

class NetProceedsCalculateRequest(BaseModel):
    crop_id: str
    quantity_kg: float
    expected_price_per_kg: Optional[float] = None
    transport_cost: Optional[float] = None
    other_expenses: Optional[float] = 0.0

class VoiceQueryRequest(BaseModel):
    transcript: str
    language: str = "en"  # en, ta, hi, te, kn, ml

class VoiceQueryResponse(BaseModel):
    transcript: str
    language: str
    intent: str
    entities: Dict[str, str] = {}
    response_text: str
    data_retrieved: Optional[Dict[str, Any]] = None
    is_demo: bool = True
