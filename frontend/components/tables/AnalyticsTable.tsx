interface Props {
  data: any[];
}

export default function AnalyticsTable({
  data,
}: Props) {

  if (!data || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0]);

  return (

    <div className="bg-white rounded-xl shadow-sm p-6 mt-10">

      <h2 className="text-2xl font-bold mb-6">
        Analytics Table
      </h2>

      <div className="overflow-x-auto">

        <table className="min-w-full border-collapse">

          <thead className="bg-gray-100">

            <tr>

              {columns.map((column) => (

                <th
                  key={column}
                  className="border px-4 py-2 text-left"
                >
                  {column}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {data.map((row, index) => (

              <tr key={index}>

                {columns.map((column) => (

                  <td
                    key={column}
                    className="border px-4 py-2"
                  >
                    {String(row[column])}
                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}