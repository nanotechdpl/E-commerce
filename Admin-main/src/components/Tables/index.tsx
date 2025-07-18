import React from "react";

interface Columns {
  title: string;
  dataIndex: string;
  render?: (data: DataSource) => React.ReactNode;
}

interface DataSource {
  [key: string]: any; // Allows dynamic properties in each row
}

type TableProps = {
  columns: Columns[];
  dataSource: DataSource[];
};

const Table = ({ columns, dataSource }: TableProps) => {
  return (
    <div className="relative w-full overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-slate-500 rtl:text-right">
        <thead className="bg-slate-50 text-xs uppercase text-slate-700">
          <tr>
            {columns?.map((item) => (
              <th scope="col" className="p-4 text-center" key={item.dataIndex}>
                {item.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource?.map((dataItem, i) => (
            <tr key={i} className="border-b bg-white hover:bg-slate-50">
              {columns?.map((columnItem) => (
                <td className="w-4 p-4 text-center" key={columnItem.dataIndex}>
                  {columnItem.render
                    ? columnItem.render(dataItem)
                    : dataItem[columnItem.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
