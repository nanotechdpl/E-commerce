"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { suspendData } from "@/types/suspendData";
import Link from "next/link";
import { SuspendData } from "@/constants/suspendData";
import ICTable from "@/components/ui/ICTable";
import CustomSelect from "@/components/ui/CustomSelect";
import CustomSearch from "@/components/ui/CustomSearch";
import { DatePicker } from "antd";


const Suspended: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  // const [sortBy, setSortBy] = useState<string>("");
  // const [sortOrder, setSortOrder] = useState<string>("");

  const statusColors: { [key: string]: string } = {
    Suspended: 'bg-red',
    Active: 'bg-blue-400',
    
  };

  const [columns,setColumns] = useState([
    {
      title: "No",
      dataIndex: "sl",
      render: (no: number) => {
        return (
          <span className={`px-3 py-1 flex justify-center rounded text-black bg-[#FFB200]`}>
            {no}
          </span>
        );
      }
    },
    { title: "User Name", dataIndex: "userName" },
    { title: "Spam Payments", dataIndex: "spamPayments" },
    { title: "Suspended Hours", dataIndex: "suspendedHours" },
    { title: "suspendedDay", dataIndex: "suspendedDay" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const statusClass = statusColors[status];
        return (
          <span className={`px-4 flex justify-center items-center py-1 rounded text-white ${statusClass}`}>
            {status}
          </span>
        );
      }
    },

    {
      title: "See",
      render: (data: suspendData) => {
        return (
          <span>
            <Link href={`/c/orders/view/${data?.sl}`}>
              <button className="rounded-md bg-[#FFB200] px-3 py-1 text-[14px] text-white  transition-all hover:bg-white hover:text-blue-600 hover:shadow-md ">
                View
              </button>
            </Link>
          </span>
        );
      },
    },
  ]);
  
  const onPaginationChange = (page: number, pageSize: number) => {
    
    setPage(page);
    setSize(pageSize);
  };
  // const onTableChange = (pagination: any, filter: any, sorter: any) => {
  //   const { order, field } = sorter;
  //   // console.log(order, field);
  //   setSortBy(field as string);
  //   setSortOrder(order === "ascend" ? "asc" : "desc");
  // };

  const accountStatusOption = [
    {
      value: "All",
      label: "All",
    },
    {
      value: "Suspended",
      label: "Suspended",
    },
    {
      value: "Active",
      label: "Active",
    },
  
  ];
 
  const onSearch = (value: any) => {
    console.log(value);
  };
  const onStartDate = (value: any) => {
    console.log(value);
  };
  // const onEndDate = (value: any) => {
  //   console.log(value);
  // };
  // const props = {
  //   className: "bg-blue-500 w-full",
  //   placeholder: "Search Blogs",
  //   loading: false,
  //   onSearch: onSearch,
  //   enterButton: true,
  // };
  return (
    <div className="z-0 w-full p-4 md:p-6 2xl:p-10 ">
      <Breadcrumb pageName="Account Suspended" />
     
      <div className="grid w-full  grid-cols-1 items-center justify-between gap-3 py-4 md:grid-cols-3 lg:grid-cols-5">
        <div className="flex gap-2 mr-5">
          show
          <select className="select select-ghost w-fit">
            <option disabled>15</option>
            <option>30</option>
            <option>60</option>
            <option>120</option>
          </select>
          row
          <select className="select select-ghost w-fit">
            <option disabled>---</option>
            <option>--</option>

          </select>
        </div>
       
        <CustomSearch onSearch={onSearch} />
        <div className="col-span-2 flex items-center justify-center gap-2">
          <DatePicker onChange={onStartDate} />
          <span>To</span>
          <DatePicker onChange={onStartDate} />
          <CustomSelect options={accountStatusOption} placeholder="Status" />

        </div>
      </div>

      <div className="w-full overflow-x-scroll">
        <ICTable
          loading={false}
          columns={columns}
          dataSource={SuspendData}
          pageSize={size}
          totalPages={SuspendData?.length}
          onPaginationChange={onPaginationChange}
          // onTableChange={onTableChange}
          showPagination={true}
        />
      </div>
    </div>
  );
};



export default Suspended;
