import { Table } from "antd";
import "./ICTable.css";

type ICTableProps = {
  loading?: boolean;
  columns: any;
  dataSource: any;
  pageSize?: number;
  totalPages?: number;
  showSizeChanger?: boolean;
  onPaginationChange?: (page: number, pageSize: number) => void;
  // onTableChange?: (pagination: any, filter: any, sorter: any) => void;
  showPagination?: boolean;
  // rowKey?: any;
  // expandable?: any;
  headerbg?: any;
};

const ICTable = ({
  loading = false,
  columns,
  dataSource,
  pageSize,
  totalPages,
  showSizeChanger = true,
  onPaginationChange,
  // onTableChange,
  showPagination = true,
  // rowKey,
  // expandable,
}: ICTableProps) => {
  const paginationConfig = showPagination
    ? {
        pageSize: pageSize,
        total: totalPages,
        pageSizeOptions: [5, 10, 20],
        showSizeChanger: showSizeChanger,
        onChange: onPaginationChange,
      }
    : false;

  return (
    <Table
      className="blue-table text-center"
      loading={loading}
      columns={columns}
      dataSource={dataSource}
    ></Table>
  );
};

export default ICTable;
