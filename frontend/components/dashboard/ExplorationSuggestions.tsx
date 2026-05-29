interface Suggestion {
  title: string;
  question: string;
}

interface Props {
  suggestions: Suggestion[];
  onSelect: (
    question: string
  ) => void;
}

export default function
ExplorationSuggestions({

  suggestions,

  onSelect,

}: Props) {

  if (!suggestions.length)
    return null;

  return (

    <div className="mb-10">

      <h2 className="
        text-2xl font-bold
        mb-6
      ">
        AI-Guided Exploration
      </h2>

      <div className="
        grid grid-cols-1
        md:grid-cols-2
        gap-6
      ">

        {suggestions.map(
          (
            suggestion,
            index
          ) => (

            <button
              key={index}
              onClick={() =>
                onSelect(
                  suggestion.question
                )
              }
              className="
                text-left
                bg-white
                border
                rounded-2xl
                p-6
                hover:shadow-md
                transition
              "
            >

              <p className="
                text-sm uppercase
                text-gray-500
                mb-2
              ">
                AI Recommendation
              </p>

              <h3 className="
                text-xl font-semibold
                mb-3
              ">
                {suggestion.title}
              </h3>

              <p className="
                text-gray-600
              ">
                {suggestion.question}
              </p>

            </button>

          )
        )}

      </div>

    </div>
  );
}