from fastapi import APIRouter, Header

import services.data_store as data_store

from ai.question_generator import (
    generate_questions
)

router = APIRouter()


@router.get("/")
async def get_questions(authorization: str = Header(None)):
    user_id = "guest"
    if authorization and authorization.startswith("Bearer token_"):
        user_id = authorization.replace("Bearer token_", "").strip()

    df = data_store.get_df(user_id)

    if df is None:

        return {
            "questions": []
        }

    questions = generate_questions(
        df.columns.tolist()
    )

    return {
        "questions": questions
    }