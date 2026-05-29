from fastapi import APIRouter, Header

import services.data_store as data_store

from ai.executive_summary import (
    generate_executive_summary
)

router = APIRouter()


@router.get("/")
async def executive_summary(authorization: str = Header(None)):
    user_id = "guest"
    if authorization and authorization.startswith("Bearer token_"):
        user_id = authorization.replace("Bearer token_", "").strip()

    df = data_store.get_df(user_id)

    if df is None:

        return {
            "error": "No dataset uploaded"
        }

    summary = generate_executive_summary(
        df
    )

    return {
        "summary": summary
    }