import json

from langchain_groq import ChatGroq

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0
)


def generate_query_plan(
    question,
    columns
):

    prompt = f"""
You are an AI analytics planner.

Dataset Columns:
{columns}

User Question:
{question}

Generate a JSON response with:

1. metric_column
2. grouping_column
3. aggregation
4. sort_order
5. chart_type
6. analysis_goal

Rules:
- Prefer business-readable columns
- Avoid ID columns
- Use proper business logic
- Return ONLY valid JSON

Example:

{{
    "metric_column": "Profit",
    "grouping_column": "Region",
    "aggregation": "sum",
    "sort_order": "desc",
    "chart_type": "bar",
    "analysis_goal": "highest_profit_region"
}}
"""

    response = llm.invoke(prompt)

    try:

        return json.loads(
            response.content
        )

    except Exception:

        return None