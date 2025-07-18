"use client";

import Card from "@/components/Card/Card";
import { useEffect, useMemo, useState } from "react";
import { DashboardData } from "@/constants/dashboardData";
import { DashboardOrderType } from "@/redux/fetures/admin/userSlice";
import { RootState } from "@/redux/store/store";

import OrderTable from "./_components/OrderTable";

import { Poppins } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { getUserOrdersById } from "../../actions";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

function Page() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const orders = useSelector((state: RootState) => state.users?.orderById);
  const user: any = useSelector((state: RootState) => state.users?.userById);
  console.log(orders);
  const [dashboardData, setDashboardData] = useState<typeof DashboardData>(DashboardData);
  // const [page, setPage] = useState<number>(1);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>("");
  // const [size, setSize] = useState<number>(10);
  // const [sortBy, setSortBy] = useState<string>("");
  // const [sortOrder, setSortOrder] = useState<string>("");

  const cardData = dashboardData
    ? [
      { title: "Total Orders", value: orders?.totaluserorder || 0 },
      { title: "Total Pending Order", value: orders?.totalpendingorders || 0 },
      { title: "Total Payments Orders", value: orders?.totalorderpayment || 0 },
      { title: "Total Waiting Orders", value: orders?.totalwaitingorders || 0 },
      { title: "Total Working Orders", value: orders?.totalworkingorders || 0 },
      { title: "Total Completed Orders", value: orders?.totalcompleteorders || 0 },
      { title: "Total Stopped Orders", value: orders?.totalcompleteorders || 0 },
      { title: "Total Delivery Orders", value: orders?.totaldeliveredorders || 0 },
      { title: "Total Refund Orders", value: orders?.totaldeliveredorders || 0 },
      { title: "Total Cancel Orders", value: orders?.totalcancelorders || 0 },
      { title: "Total Project Amount", value: orders?.totalprojectamount || 0 },
      { title: "Total Paid Amount", value: orders?.totalorderpayment || 0 },
      { title: "Total Due Amount", value: orders?.totalmoneyleft || 0 },
      { title: "Total Refund Amount", value: orders?.totalmoneyleft || 0 },
    ]
    : [];
  const dispatch = useDispatch();
  const actions = useMemo(
    () => bindActionCreators({ getUserOrdersById }, dispatch),
    [dispatch]
  );

  useEffect(() => {
    actions?.getUserOrdersById(user?._id);
  }, [actions,user?._id]);

  const filteredOrders = useMemo(() => {
    if (!orders?.userorders || !searchQuery.trim()) {
      return orders?.userorders || [];
    }
    const query = searchQuery.toLowerCase().trim();
    return orders.userorders.filter((order) => 
      order.full_name.toLowerCase().includes(query) ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.project_type.toLowerCase().includes(query)
    );
  }, [orders?.userorders, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full p-4 md:p-6 2xl:p-10">
      <div className="rounded-xl py-5 px-2">
        <div className="grid md:grid-cols-6 grid-cols-1 gap-4 mb-3">
          {cardData.map((card, i) => (
            <Card key={i} title={card.title} value={card.value} />
          ))}
        </div>
      </div>
      <div className="flex py-4 items-center justify-between">
        <h2 className="text-3xl font-black">Orders</h2>
        <form onSubmit={handleSearch} className="flex">
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search" 
            className="bg-white min-w-[300px] outline-none rounded-l-md p-2" 
          />
          <button type="submit" className="bg-[#FFB200] text-black rounded-r-md py-2 px-4">
            Search
          </button>
        </form>
      </div>

      <div className="rounded-t-lg mt-5 overflow-hidden">
        <OrderTable orders={filteredOrders} searchQuery={searchQuery}/>
        <div className="flex flex-col w-full items-center justify-center my-7 gap-5">
          <p className="font-inter font-semibold text-base leading-[19.36px] text-black-4">
            Showing 1 to 12 of 97 results
          </p>
          <div className="rounded-[10px] cursor-pointer border-[0.89px] border-black bg-[#FFB200] text-[#231F20] font-inter font-semibold text-[13px] leading-[15.73px] py-2 px-4">
                <span>More Results</span>
                <select name="" id="" className="ml-4">
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                  <option value="96">96</option>
                </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
