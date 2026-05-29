interface Props {
  insight: string;
}

export default function AIInsightCard({
  insight,
}: Props) {
  return (
    <div className="border rounded-xl p-6 bg-white shadow-sm mt-6">
      <h2 className="text-2xl font-bold mb-4">
        AI Insights
      </h2>

      <p className="text-gray-700 whitespace-pre-line">
        {insight}
      </p>
    </div>
  );
}