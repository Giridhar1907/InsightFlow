from fastapi import APIRouter, Header

import services.data_store as data_store

from ai.auto_insights import (
    generate_auto_insights
)

router = APIRouter()


@router.get("/")
async def get_auto_insights(authorization: str = Header(None)):
    user_id = "guest"
    if authorization and authorization.startswith("Bearer token_"):
        user_id = authorization.replace("Bearer token_", "").strip()

    df = data_store.get_df(user_id)

    if df is None:

        return {
            "insights": []
        }

    insights = generate_auto_insights(
        df
    )

    return {
        "insights": insights
    }