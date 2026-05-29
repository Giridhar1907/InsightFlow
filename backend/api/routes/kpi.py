from fastapi import APIRouter, Header

router = APIRouter()


@router.get("/")
async def get_kpis(authorization: str = Header(None)):
    user_id = "guest"
    if authorization and authorization.startswith("Bearer token_"):
        user_id = authorization.replace("Bearer token_", "").strip()

    df = data_store.get_df(user_id)

    if df is None:
        return {
            "error": "No dataset uploaded"
        }

    numeric_columns = df.select_dtypes(
        include="number"
    ).columns

    total_rows = len(df)

    total_columns = len(df.columns)

    kpis = {
        "total_rows": total_rows,
        "total_columns": total_columns,
    }

    # Auto detect sales/revenue columns
    for col in numeric_columns:

        col_lower = col.lower()

        if "sales" in col_lower:
            kpis["total_sales"] = round(
                df[col].sum(),
                2
            )

        if "profit" in col_lower:
            kpis["total_profit"] = round(
                df[col].sum(),
                2
            )

        if "quantity" in col_lower:
            kpis["total_quantity"] = int(
                df[col].sum()
            )

    return kpis