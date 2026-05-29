def generate_questions(columns):

    columns_lower = [
        col.lower()
        for col in columns
    ]

    questions = []

    # PROFITABILITY
    if any(
        "profit" in col
        for col in columns_lower
    ):

        questions.extend([

            "Which products are least profitable?",

            "Which region has highest profit?",

            "Show profit trend over time",

            "Which category has declining profit?",

        ])

    # SALES EXPLORATION
    if any(
        "sales" in col
        for col in columns_lower
    ):

        questions.extend([

            "Which city generates highest revenue?",

            "Find top customers by sales",

            "Which products have declining sales?",

            "Compare sales across segments",

        ])

    # CUSTOMER ANALYTICS
    if any(
        "customer" in col
        for col in columns_lower
    ):

        questions.extend([

            "Which customers generate repeat revenue?",

            "Top customers by profitability",

        ])

    # TIME-SERIES
    if any(
        "date" in col
        for col in columns_lower
    ):

        questions.extend([

            "Detect seasonal sales spikes",

            "Show yearly growth trend",

        ])

    # Remove duplicates
    questions = list(
        dict.fromkeys(questions)
    )

    return questions[:8]