import pandas as pd

from langchain_groq import ChatGroq

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0
)


def generate_executive_summary(
    df: pd.DataFrame
):

    preview = df.head(20).to_string()

    prompt = f"""
You are an expert business analyst AI.

Analyze this dataset preview:

{preview}

Generate:
1. Executive Summary
2. 4 concise business insights

Rules:
- Keep insights short
- Use executive/business tone
- Mention trends if visible
- Mention profitability if visible
- Maximum 6 lines total
"""

    response = llm.invoke(prompt)

    return response.content