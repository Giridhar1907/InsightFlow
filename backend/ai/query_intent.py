def detect_intent(question: str):

    question = question.lower()

    intent = {

        "sort_order": "desc",

        "analysis_type": "comparison",

        "chart_type": "bar",
    }

    # ASCENDING ANALYSIS
    if any(
        word in question
        for word in [
            "least",
            "lowest",
            "worst",
            "bottom",
        ]
    ):

        intent["sort_order"] = "asc"

    # TREND ANALYSIS
    if any(
        word in question
        for word in [
            "trend",
            "monthly",
            "yearly",
            "over time",
            "growth",
        ]
    ):

        intent["analysis_type"] = "trend"

        intent["chart_type"] = "line"

    # DISTRIBUTION
    if any(
        word in question
        for word in [
            "share",
            "distribution",
            "percentage",
        ]
    ):

        intent["analysis_type"] = "distribution"

        intent["chart_type"] = "pie"

    return intent