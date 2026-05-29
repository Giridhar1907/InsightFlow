import pandas as pd

from langchain_groq import ChatGroq

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0
)


def generate_auto_insights(
    df: pd.DataFrame
):

    preview = df.head(5).to_string()

    columns = df.columns.tolist()

    prompt = f"""
You are an AI business analyst.

Dataset Columns:
{columns}

Dataset Preview:
{preview}

Generate 3 short business insights.

Rules:
- Maximum 1 sentence each
- Focus on revenue, profit, trends, anomalies
- Use executive business language
- Be concise and impactful

Example:

[
  "Technology drives the highest overall revenue.",
  "Furniture profitability is significantly lower than other categories.",
  "West region contributes the strongest sales performance."
]

Return ONLY a Python-style list.
"""

    response = llm.invoke(prompt)

    try:

        insights = eval(
            response.content
        )

        return insights

    except Exception:

        return [
            "AI insights unavailable."
        ]