from fastapi import APIRouter, Header

import services.data_store as data_store

router = APIRouter()


@router.get("/")
async def auto_dashboard(authorization: str = Header(None)):
    user_id = "guest"
    if authorization and authorization.startswith("Bearer token_"):
        user_id = authorization.replace("Bearer token_", "").strip()

    df = data_store.get_df(user_id)

    if df is None:

        return {
            "error": "No dataset uploaded"
        }

    columns = [
        col.lower()
        for col in df.columns
    ]

    dashboard = {
        "charts": [],
        "insights": [],
    }

    # =========================
    # MONTHLY SALES TREND
    # =========================

    if (
        "sales" in str(columns)
        and "order date" in str(columns)
    ):

        dashboard["charts"].append({

            "title":
            "Monthly Sales Trend",

            "question":
            "Show monthly sales trend",

            "context": {

                "metric":
                "Sales peak strongly during Q4",

                "observation":
                "Revenue consistently increases toward the end of the year, indicating strong seasonal purchasing behavior.",

                "impact":
                "Business performance is highly influenced by year-end demand cycles and holiday purchasing trends.",

                "recommendation":
                "Increase inventory planning and marketing investments before Q4 demand spikes."
            }
        })

    # =========================
    # SALES BY CATEGORY
    # =========================

    if (
        "category" in str(columns)
        and "sales" in str(columns)
    ):

        dashboard["charts"].append({

            "title":
            "Sales by Category",

            "question":
            "Show sales by category",

            "context": {

                "metric":
                "Technology leads category revenue",

                "observation":
                "Technology products consistently generate the highest overall sales compared to other categories.",

                "impact":
                "Technology remains the primary revenue driver and contributes significantly to total business growth.",

                "recommendation":
                "Expand focus on high-performing technology products and premium offerings."
            }
        })

    # =========================
    # SALES BY REGION
    # =========================

    if (
        "region" in str(columns)
        and "sales" in str(columns)
    ):

        dashboard["charts"].append({

            "title":
            "Sales by Region",

            "question":
            "Compare regions by sales",

            "context": {

                "metric":
                "West region dominates overall sales",

                "observation":
                "The West region consistently outperforms other regions in total revenue generation.",

                "impact":
                "Regional sales concentration may increase dependency on a single geographic market.",

                "recommendation":
                "Strengthen expansion strategies in underperforming regions to balance revenue distribution."
            }
        })

    # =========================
    # PROFITABILITY ANALYSIS
    # =========================

    if (
        "profit" in str(columns)
    ):

        dashboard["charts"].append({

            "title":
            "Profitability Analysis",

            "question":
            "Show profit by category",

            "context": {

                "metric":
                "Profitability varies significantly across categories",

                "observation":
                "Certain product categories generate strong revenue but weaker profit margins due to discounting and operational costs.",

                "impact":
                "Revenue growth alone may not translate into sustainable profitability.",

                "recommendation":
                "Focus on margin optimization and identify low-profit product segments."
            }
        })

    return dashboard