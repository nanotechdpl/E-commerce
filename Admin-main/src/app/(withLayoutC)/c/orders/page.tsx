"use client";
import React, { useEffect, useMemo, useState } from "react";
import Card from "../../../../components/Card/Card";
import Loader from "@/components/common/Loader";
import ActionBar from "./_components/ActionBar";
import OrdersTable from "./_components/OrdersTable";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store/store";
import { getAllOrders } from "./actions";

const AllOrders: React.FC = () => {
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState(""); // for search input
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const dispatch = useDispatch();
  const orders: any = useSelector((state: RootState) => state.orders?.orders);

  const actions = useMemo(
    () => bindActionCreators({ getAllOrders }, dispatch),
    [dispatch]
  );

  // Fetch orders when filters, search, page, or limit change
  useEffect(() => {
    actions.getAllOrders({
      email: search,
      orderStatus: status,
      serviceType: service,
      page,
      limit,
    });
  }, [actions, search, status, service, page, limit]);



  const [loading] = useState<boolean>(false);

  const total = orders?.totalOrders || 0;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const cardData = [
    { title: "Total Orders", value: orders?.totalOrders || 0 },
    { title: "Total Pending Orders", value: orders?.totalPendingOrders || 0 },
    { title: "Total Payment Orders", value: orders?.totalPaymentOrders || 0 },
    { title: "Total Waiting Orders", value: orders?.totalWorkingOrders || 0 },
    { title: "Total Working Orders", value: orders?.totalWorkingOrders || 0 },
    { title: "Total Stopped Orders", value: orders?.totalStoppedOrders || 0 },
    { title: "Total Complete Orders", value: orders?.totalCompleteOrders || 0 },
    { title: "Total Delivery Orders", value: orders?.totalDeliveryOrders || 0 },
    { title: "Total Refunded Orders", value: orders?.totalRefundedOrders || 0 },
    { title: "Total Cancel Orders", value: orders?.totalCancelOrders || 0 },
  ];

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const value = (form.elements.namedItem("search") as HTMLInputElement).value;
    setSearch(value);
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className="z-0 w-full px-2 md:p-6 2xl:p-10 ">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="rounded-xl  px-3">
            <div className="grid md:grid-cols-5 grid-cols-1  gap-5 mb-3">
              {cardData.map((card, i) => (
                <Card key={i} title={card.title} value={card.value} />
              ))}
            </div>
          </div>
          <div className="w-full flex items-center justify-end gap-3 py-8">
            <ActionBar
              service={service}
              setService={setService}
              status={status}
              setStatus={setStatus}
              // Pass search and handleSearch to ActionBar
              search={search}
              setSearch={setSearch}
              handleSearch={handleSearch}
            />
          </div>
          <div className="rounded-t-lg overflow-x-auto ">
            <OrdersTable orders={orders?.data} />
          </div>
          <div className="flex flex-col w-full items-center justify-center my-7 gap-5">
            <p className="font-inter font-semibold text-base leading-[19.36px] text-black-4">
              Showing {start} to {end} of {total} results
            </p>
            <div className="flex items-center gap-4">
              <button
                className="rounded-[10px] border-[0.89px] border-white bg-[#FFB200] text-[#231F20] font-inter font-semibold text-[13px] leading-[15.73px] py-2 px-4"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span>Page {orders?.page || page} of {orders?.totalPages || 1}</span>
              <button
                className="rounded-[10px] border-[0.89px] border-white bg-[#FFB200] text-[#231F20] font-inter font-semibold text-[13px] leading-[15.73px] py-2 px-4"
                disabled={end >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
              <span>More Results</span>
              <select
                className="ml-4"
                value={limit}
                onChange={e => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
                <option value="96">96</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllOrders;