export default function KPISkeleton() {

  return (

    <div className="grid grid-cols-5 gap-6 mb-10">

      {[1, 2, 3, 4, 5].map((item) => (

        <div
          key={item}
          className="bg-white rounded-xl p-6 shadow-sm animate-pulse"
        >

          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />

          <div className="h-8 bg-gray-300 rounded w-3/4" />

        </div>

      ))}

    </div>

  );
}