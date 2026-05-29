interface Props {
  insights: string[];
}

export default function AIHighlights({
  insights,
}: Props) {

  if (!insights.length) return null;

  return (

    <div className="
      grid grid-cols-1
      md:grid-cols-3
      gap-6 mb-10
    ">

      {insights.map(
        (
          insight,
          index
        ) => (

          <div
            key={index}
            className="
              bg-black text-white
              rounded-2xl p-6
              shadow-sm
            "
          >

            <p className="
              text-sm uppercase
              tracking-wide
              opacity-70 mb-2
            ">
              AI Insight
            </p>

            <p className="
              text-lg font-medium
              leading-relaxed
            ">
              {insight}
            </p>

          </div>

        )
      )}

    </div>

  );
}