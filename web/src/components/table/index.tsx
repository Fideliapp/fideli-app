interface TableProps {
  data: Array<Record<string, any>>;
}

export const Table = (props: TableProps) => {
  const { data } = props;

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm text-left text-gray-700">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-2 border-b border-gray-200 bg-gray-50 font-semibold text-gray-600 uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {headers.map((header) => (
                <td
                  key={header}
                  className="px-4 py-2 border-b border-gray-200 text-gray-800"
                >
                  {row[header] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};