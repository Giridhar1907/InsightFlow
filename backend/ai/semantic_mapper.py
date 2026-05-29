COLUMN_SYNONYMS = {

    "sales": [
        "sales",
        "revenue",
        "amount",
        "income",
    ],

    "profit": [
        "profit",
        "earnings",
        "margin",
    ],

    "quantity": [
        "quantity",
        "units",
        "count",
    ],

    "item": [
        "product",
        "product name",
        "item",
    ],

    "customer": [
        "customer",
        "customer name",
        "client",
    ],

    "region": [
        "region",
        "state",
        "city",
        "location",
    ],

    "category": [
        "category",
        "segment",
        "type",
    ],

    "date": [
        "date",
        "month",
        "monthly",
        "year",
        "yearly",
        "time",
        "trend",
    ]
}


def prioritize_readable_columns(columns):

    readable_priority = [

        "name",

        "product name",

        "customer name",

        "category",

        "segment",

        "region",

        "city",

        "state",
    ]

    # PRIORITIZE HUMAN-READABLE COLUMNS
    for keyword in readable_priority:

        for col in columns:

            col_lower = col.lower()

            if (
                keyword in col_lower
                and "id" not in col_lower
            ):

                return col

    # AVOID ID COLUMNS IF POSSIBLE
    non_id_columns = [

        col for col in columns

        if "id" not in col.lower()
    ]

    if non_id_columns:

        return non_id_columns[0]

    return columns[0]

def detect_grouping_column(
    question,
    categorical_columns
):

    question = question.lower()

    ENTITY_PRIORITY = {

        "region": [
            "region",
            "state",
            "city",
        ],

        "customer": [
            "customer name",
            "customer",
        ],

        "product": [
            "product name",
            "product",
            "item",
        ],

        "category": [
            "category",
            "segment",
        ],
    }

    # DIRECT ENTITY MATCH
    for entity, keywords in (
        ENTITY_PRIORITY.items()
    ):

        if entity in question:

            for keyword in keywords:

                for col in categorical_columns:

                    col_lower = col.lower()

                    if (
                        keyword in col_lower
                        and "id" not in col_lower
                    ):

                        return col

    # FALLBACK
    return prioritize_readable_columns(
        categorical_columns
    )


def find_best_column(question, columns):

    question = question.lower()

    scored_columns = []

    for column in columns:

        column_lower = column.lower()

        score = 0

        # SYNONYM MATCHING
        for _, synonyms in COLUMN_SYNONYMS.items():

            for synonym in synonyms:

                if synonym in question:

                    if synonym in column_lower:
                        score += 10

        # HUMAN-READABLE BOOST
        if "name" in column_lower:
            score += 15

        # PENALIZE IDs
        if "id" in column_lower:
            score -= 10

        # PRODUCT-SPECIFIC BOOST
        if (
            "product" in question
            and "product name" in column_lower
        ):
            score += 25

        # CUSTOMER-SPECIFIC BOOST
        if (
            "customer" in question
            and "customer name" in column_lower
        ):
            score += 25

        scored_columns.append(
            (column, score)
        )

    # SORT BY BEST SCORE
    scored_columns.sort(
        key=lambda x: x[1],
        reverse=True
    )

    best_column = scored_columns[0][0]

    return best_column

    question = question.lower()

    best_match = None

    for keyword, synonyms in COLUMN_SYNONYMS.items():

        for synonym in synonyms:

            if synonym in question:

                # EXACT SEMANTIC MATCH
                for column in columns:

                    column_lower = column.lower()

                    if synonym in column_lower:

                        # Avoid IDs if better options exist
                        if "id" in column_lower:

                            continue

                        return column

                # FALLBACK TO READABLE COLUMN
                best_match = prioritize_readable_columns(
                    columns
                )

    if best_match:

        return best_match

    return prioritize_readable_columns(
        columns
    )