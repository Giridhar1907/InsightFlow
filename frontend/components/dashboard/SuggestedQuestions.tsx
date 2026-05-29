interface Props {
  questions: string[];
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({
  questions,
  onSelect,
}: Props) {

  if (!questions.length) return null;

  return (

    <div className="bg-white rounded-2xl shadow-sm p-6 mt-8">

      <h2 className="text-2xl font-bold mb-5">
        Suggested Questions
      </h2>

      <div className="flex flex-wrap gap-4">

        {questions.map((question, index) => (

          <button
            key={index}
            onClick={() => onSelect(question)}
            className="
              px-5 py-3 rounded-xl
              bg-zinc-100
              hover:bg-black
              hover:text-white
              transition-all duration-300
              text-sm font-medium
            "
          >
            {question}
          </button>

        ))}

      </div>

    </div>

  );
}