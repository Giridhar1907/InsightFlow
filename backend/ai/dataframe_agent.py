import pandas as pd

from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

import services.data_store as data_store

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0
)


def analyze_dataframe(
    df: pd.DataFrame,
    question: str,
    user_id: str = "guest"
):

    # =========================
    # CLEAN BUSINESS READABLE DATA
    # =========================

    preferred_columns = []

    for col in df.columns:

        col_lower = col.lower()

        # Remove technical IDs
        if (
            "id" in col_lower
            and any(
                word in col_lower
                for word in [
                    "product",
                    "customer",
                    "order",
                    "row",
                ]
            )
        ):
            continue

        preferred_columns.append(col)

    # Readable dataframe
    readable_df = df[
        preferred_columns
    ]

    # Smaller preview for faster inference
    preview = readable_df.head(5).to_string()

    columns = readable_df.columns.tolist()

    # =========================
    # MEMORY CONTEXT
    # =========================

    memory_context = ""
    last_q = data_store.get_last_question(user_id)

    if last_q:

        previous_result = str(
            data_store.get_last_result(user_id)
        )[:500]

        memory_context = f"""

Previous User Question:
{last_q}

Previous Analysis Summary:
{previous_result}

Previous Grouping Entity:
{data_store.get_last_entity(user_id)}

"""

    # =========================
    # PROMPT
    # =========================

    prompt = PromptTemplate.from_template(
        """
You are an elite AI business analyst.

Dataset Columns:
{columns}

Dataset Preview:
{preview}

Conversation Memory:
{memory_context}

User Question:
{question}

Instructions:

- Give concise executive-level insights
- Maximum 6 short lines
- Use professional business language
- Mention important metrics if relevant
- Explain WHY the trend matters
- Mention business impact
- Mention possible drivers
- Compare against other categories if relevant
- Quantify insights whenever possible
- Prefer business-readable names over IDs
- Never mention technical identifiers unless necessary
- If the question is a follow-up,
  use conversation memory intelligently
- Be direct, analytical, and insightful
- Focus on actionable business understanding
- Format neatly

Good Response Example:

Top Performing Category:
Technology

Revenue Contribution:
36% of total sales

Insight:
Technology products consistently outperform
other categories due to higher average
order values and stronger demand.

Business Impact:
Technology is the primary revenue driver
and should remain a strategic focus area.

Now answer the user's question.
"""
    )

    chain = prompt | llm

    try:

        response = chain.invoke({

            "columns": columns,

            "preview": preview,

            "memory_context": memory_context,

            "question": question

        })

        return response.content

    except Exception as e:

        return f"AI analysis failed: {str(e)}"