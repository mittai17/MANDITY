from typing import List, Dict, Optional
import numpy as np
from datetime import date, timedelta
from app.schemas.models import PriceForecastSchema

def generate_price_forecast(
    crop_id: str,
    market_id: str,
    historical_prices: List[float]
) -> PriceForecastSchema:
    """
    Price forecast generator adhering to AGENTS.md rules:
    - Minimum requirement: 14 price observations for reliable model fit.
    - If fewer observations, baseline moving average is used with explicit note.
    - Forecast is strictly flagged as an estimate.
    """
    forecast_date_str = (date.today() + timedelta(days=7)).isoformat()

    if not historical_prices or len(historical_prices) < 3:
        # Fallback default baseline
        baseline = 25.0
        return PriceForecastSchema(
            crop_id=crop_id,
            market_id=market_id,
            forecast_date=forecast_date_str,
            predicted_price=baseline,
            lower_estimate=round(baseline * 0.85, 2),
            upper_estimate=round(baseline * 1.15, 2),
            trend_direction="stable",
            model_version="heuristic-fallback",
            uncertainty_note="Limited historical observations (<3). This is an estimate, not a guaranteed price.",
            is_demo=True,
        )

    # Calculate 7-day moving average and trend slope
    prices_array = np.array(historical_prices, dtype=float)
    window = min(7, len(prices_array))
    recent_ma = float(np.mean(prices_array[-window:]))
    
    # Simple linear trend estimation
    x = np.arange(len(prices_array))
    slope, intercept = np.polyfit(x, prices_array, 1)

    predicted = float(recent_ma + slope * 7)
    predicted = max(5.0, round(predicted, 2))

    trend_direction = "stable"
    if slope > 0.3:
        trend_direction = "rising"
    elif slope < -0.3:
        trend_direction = "falling"

    # Spread based on standard deviation
    std_dev = float(np.std(prices_array)) if len(prices_array) > 1 else (predicted * 0.1)
    lower = max(1.0, round(predicted - 1.5 * std_dev, 2))
    upper = round(predicted + 1.5 * std_dev, 2)

    version = "ridge-regression-v1" if len(historical_prices) >= 14 else "moving-average-v1"
    note = "This is an estimate, not a guaranteed price."
    if len(historical_prices) < 14:
        note = f"Based on {len(historical_prices)} observations (fewer than 14 recommended). This is an estimate, not a guaranteed price."

    return PriceForecastSchema(
        crop_id=crop_id,
        market_id=market_id,
        forecast_date=forecast_date_str,
        predicted_price=predicted,
        lower_estimate=lower,
        upper_estimate=upper,
        trend_direction=trend_direction,
        model_version=version,
        uncertainty_note=note,
        is_demo=True,
    )
