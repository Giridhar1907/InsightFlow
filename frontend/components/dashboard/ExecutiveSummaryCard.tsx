interface Props {
  summary: string;
}

export default function ExecutiveSummaryCard({
  summary,
}: Props) {

  if (!summary) return null;

  return (

    <div className="
      bg-gradient-to-r
      from-black
      to-zinc-800
      text-white
      rounded-2xl
      p-8
      shadow-sm
      mb-10
    ">

      <h2 className="
        text-3xl font-bold mb-4
      ">
        Executive Summary
      </h2>

      <div className="
        whitespace-pre-line
        text-zinc-200
        leading-8
        text-lg
      ">

        {summary}

      </div>

    </div>

  );
}