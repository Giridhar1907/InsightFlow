from fastapi import APIRouter
from pydantic import BaseModel

import pandas as pd
import re

import services.data_store as data_store

from ai.semantic_mapper import (
    find_best_column,
    detect_grouping_column
)

from ai.query_intent import (
    detect_intent
)

from ai.query_planner import (
    generate_query_plan
)

router = APIRouter()


from fastapi import Header

class ChartRequest(BaseModel):
    question: str


@router.post("/")
async def generate_chart(
    request: ChartRequest,
    authorization: str = Header(None)
):
    user_id = "guest"
    if authorization and authorization.startswith("Bearer token_"):
        user_id = authorization.replace("Bearer token_", "").strip()

    df = data_store.get_df(user_id)

    if df is None:

        return {
            "error": "No dataset uploaded",
            "chart_type": "bar",
            "title": "No Data",
            "labels": [],
            "values": [],
            "table_data": []
        }

    question = request.question.lower()

    # =========================
    # AI QUERY PLAN
    # =========================

    query_plan = generate_query_plan(
        question,
        df.columns.tolist()
    )

    # =========================
    # INTENT DETECTION
    # =========================

    intent = detect_intent(
        question
    )

    # =========================
    # COLUMN TYPES
    # =========================

    numeric_cols = df.select_dtypes(
        include="number"
    ).columns.tolist()

    categorical_cols = df.select_dtypes(
        exclude="number"
    ).columns.tolist()

    if (
        not numeric_cols
        or not categorical_cols
    ):

        return {
            "error":
            "Dataset unsuitable for charts",

            "chart_type": "bar",

            "title": "Invalid Dataset",

            "labels": [],

            "values": [],

            "table_data": []
        }

    # =========================
    # DEFAULTS
    # =========================

    value_col = None

    label_col = None

    chart_type = "bar"

    sort_order = "desc"

    aggregation = "sum"

    # =========================
    # USE AI QUERY PLAN
    # =========================

    if query_plan:

        ai_metric = query_plan.get(
            "metric_column"
        )

        ai_grouping = query_plan.get(
            "grouping_column"
        )

        # =========================
        # NORMALIZE METRIC COLUMN
        # =========================

        if ai_metric:

            for col in numeric_cols:

                if (
                    ai_metric.lower()
                    in col.lower()
                ):

                    value_col = col
                    break

        # =========================
        # NORMALIZE GROUPING COLUMN
        # =========================

        if ai_grouping:

            for col in categorical_cols:

                if (
                    ai_grouping.lower()
                    in col.lower()
                ):

                    label_col = col
                    break

        chart_type = query_plan.get(
            "chart_type",
            "bar"
        )

        sort_order = query_plan.get(
            "sort_order",
            "desc"
        )

        aggregation = query_plan.get(
            "aggregation",
            "sum"
        )

    # =========================
    # FALLBACKS
    # =========================

    if (
        not value_col
        or value_col not in df.columns
    ):

        value_col = find_best_column(
            question,
            numeric_cols
        )

    if (
        not label_col
        or label_col not in df.columns
    ):

        label_col = detect_grouping_column(
            question,
            categorical_cols
        )

    # FINAL SAFETY
    if not value_col:
        value_col = numeric_cols[0]

    if not label_col:
        label_col = categorical_cols[0]

    # =========================
    # TIME SERIES DETECTION
    # =========================

    is_time_query = any(

        word in question

        for word in [

            "month",
            "monthly",
            "trend",
            "over time",
            "growth",
            "year",
            "yearly",
            "time series",
        ]
    )

    # FORCE LINE CHART
    if is_time_query:
        chart_type = "line"

    # =========================
    # YEAR FILTER
    # =========================

    year_match = re.search(
        r"(20\d{2})",
        question
    )

    filter_year = None

    if year_match:

        filter_year = int(
            year_match.group(1)
        )

    # =========================
    # TIME SERIES ANALYSIS
    # =========================

    if is_time_query:

        date_col = None

        for col in df.columns:

            if "date" in col.lower():

                date_col = col
                break

        if date_col:

            try:

                df[date_col] = pd.to_datetime(
                    df[date_col],
                    errors="coerce"
                )

                # FILTER YEAR
                if filter_year:

                    df = df[
                        df[date_col]
                        .dt.year == filter_year
                    ]

                grouped = (
                    df.groupby(
                        df[date_col]
                        .dt.strftime("%b")
                    )[value_col]
                    .sum()
                )

                month_order = [

                    "Jan", "Feb", "Mar",

                    "Apr", "May", "Jun",

                    "Jul", "Aug", "Sep",

                    "Oct", "Nov", "Dec"
                ]

                grouped = grouped.reindex(
                    month_order,
                    fill_value=0
                )

                label_col = "Month"

            except Exception:

                grouped = pd.Series()

        else:

            grouped = pd.Series()

    # =========================
    # NORMAL ANALYTICS
    # =========================

    else:

        try:

            if aggregation == "mean":

                grouped = (
                    df.groupby(label_col)[
                        value_col
                    ]
                    .mean()
                )

            elif aggregation == "count":

                grouped = (
                    df.groupby(label_col)[
                        value_col
                    ]
                    .count()
                )

            elif aggregation == "max":

                grouped = (
                    df.groupby(label_col)[
                        value_col
                    ]
                    .max()
                )

            elif aggregation == "min":

                grouped = (
                    df.groupby(label_col)[
                        value_col
                    ]
                    .min()
                )

            else:

                grouped = (
                    df.groupby(label_col)[
                        value_col
                    ]
                    .sum()
                )

            grouped = (
                grouped
                .sort_values(
                    ascending=(
                        sort_order == "asc"
                    )
                )
                .head(10)
            )

        except Exception:

            grouped = pd.Series()

    # =========================
    # EMPTY RESULTS SAFETY
    # =========================

    if grouped.empty:

        return {

            "error":
            "No matching analytics found",

            "chart_type":
            chart_type,

            "title":
            "No Data Found",

            "labels": [],

            "values": [],

            "table_data": []
        }

    # =========================
    # TABLE DATA
    # =========================

    table_data = []

    for label, value in grouped.items():

        table_data.append({

            label_col: label,

            value_col:
            round(float(value), 2)

        })

    # =========================
    # TITLE
    # =========================

    title = f"{value_col} by {label_col}"

    if is_time_query:

        if filter_year:

            title = (
                f"{value_col} "
                f"Trend in {filter_year}"
            )

        else:

            title = (
                f"{value_col} "
                f"Trend Over Time"
            )

    # =========================
    # RESPONSE
    # =========================

    # =========================
    # SAVE AI MEMORY
    # =========================

    data_store.set_last_question(question, user_id)

    data_store.set_last_query_plan(query_plan, user_id)

    data_store.set_last_result(table_data, user_id)

    data_store.set_last_chart({
        "chart_type": chart_type,
        "title": title,
    }, user_id)

    data_store.set_last_entity(label_col, user_id)

    return {

        "chart_type": chart_type,

        "title": title,

        "labels":
        grouped.index.tolist(),

        "values":
        grouped.values.tolist(),

        "table_data":
        table_data
    }