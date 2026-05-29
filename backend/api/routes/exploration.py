from fastapi import APIRouter, Header

import services.data_store as data_store

from ai.exploration_agent import (
    generate_exploration_suggestions
)

router = APIRouter()


@router.get("/")
async def get_exploration_suggestions(authorization: str = Header(None)):
    user_id = "guest"
    if authorization and authorization.startswith("Bearer token_"):
        user_id = authorization.replace("Bearer token_", "").strip()

    df = data_store.get_df(user_id)

    if df is None:

        return {
            "suggestions": []
        }

    suggestions = (
        generate_exploration_suggestions(df)
    )

    return {
        "suggestions": suggestions
    }