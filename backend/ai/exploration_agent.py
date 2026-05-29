import pandas as pd

from langchain_groq import ChatGroq

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0
)


def generate_exploration_suggestions(
    df: pd.DataFrame
):

    preview = df.head(5).to_string()

    columns = df.columns.tolist()

    prompt = f"""
You are an AI analytics strategist.

Dataset Columns:
{columns}

Dataset Preview:
{preview}

Generate 5 intelligent analytics exploration suggestions.

Rules:
- Suggestions must feel insightful
- Focus on trends, profitability,
  anomalies, growth, regions,
  categories, and customers
- Each suggestion should contain:
  1. title
  2. question
- Questions should be directly usable
  by an analytics AI engine

Return ONLY valid JSON list.

Example:

[
  {{
    "title":
    "Investigate declining profitability",

    "question":
    "Show monthly profit trend in 2016"
  }},

  {{
    "title":
    "Explore strongest sales regions",

    "question":
    "Compare sales across regions"
  }}
]
"""

    response = llm.invoke(prompt)

    try:

        suggestions = eval(
            response.content
        )

        return suggestions

    except Exception:

        return []