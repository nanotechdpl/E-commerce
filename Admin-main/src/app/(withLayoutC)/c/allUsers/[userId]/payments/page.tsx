"use client";

import Card from "@/components/Card/Card";
import Loader from "@/components/common/Loader";

import { Poppins } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import PaymentTable from "./_components/PaymentTable";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { bindActionCreators } from "@reduxjs/toolkit";
import { getUserPaymentsById } from "../../actions";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

type PagePropsTypes = {
  params: Promise<{ paymentId: string }>;
};

function Page() {
  const payments = useSelector(
    (state: RootState) => state.users?.paymentsById
  );
  const [searchQuery, setSearchQuery] = useState("");
  const user: any = useSelector((state: RootState) => state.users?.userById);

  // const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>("");
  // const [size, setSize] = useState<number>(10);
  // const [sortBy, setSortBy] = useState<string>("");
  // const [sortOrder, setSortOrder] = useState<string>("");

  const cardData = payments
    ? [
        { title: "All", value: payments?.totaluserpayment || 0 },
        { title: "Succedded", value: payments?.totalsumpayment || 0 },
        {
          title: "Refunded",
          value: payments?.totalpendingpayment || 0,
        },
        {
          title: "Disputed",
          value: payments?.totalacceptedpayment || 0,
        },
        {
          title: "Failed",
          value: payments?.totalspampayment || 0,
        },
        {
          title: "Unacceptable",
          value: payments?.totalspampayment || 0,
        },
      ]
    : [];

  // const onPaginationChange = (page: number, pageSize: number) => {
  //   setPage(page);
  //   setSize(pageSize);
  // };

  // const onTableChange = (pagination: any, filter: any, sorter: any) => {
  //   const { order, field } = sorter;
  //   setSortBy(field as string);
  //   setSortOrder(order === "ascend" ? "asc" : "desc");
  // };

  // const onSearch = (value: string) => {
  //   console.log(value);
  // };

  // const onStartDate = (value: string) => {
  //   console.log(value);
  // };
  // const onEndDate = (value: any) => {
  //   console.log(value);
  // };

  const dispatch = useDispatch();
  const actions = useMemo(
    () => bindActionCreators({ getUserPaymentsById }, dispatch),
    [dispatch]
  );

  useEffect(() => {
    actions?.getUserPaymentsById(user?._id);
  }, [actions,user?._id]);
  const filteredPayments = useMemo(() => {
    if (!payments?.userpayment || !searchQuery.trim()) {
      return payments?.userpayment || [];
    }
    const query = searchQuery.toLowerCase().trim();
    return payments?.userpayment.filter((order) => 
      order.payment_type.toLowerCase().includes(query) ||
      order.transaction_id.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query) ||
      order.amount.toString().includes(query)
    );
  }, [payments?.userpayment, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <div className="w-full p-4 md:p-6 2xl:p-10">
      {/* <Breadcrumb pageName="All Users"/> */}
      {loading ? (
        // Show the loading image or spinner
        <Loader />
      ) : (
        <>
          <div className="rounded-xl py-5 px-6">
            <div className="grid md:grid-cols-5 grid-cols-1 h-24 gap-5 mb-3">
              {cardData.map((card, i) => (
                <Card key={i} title={card.title} value={card.value} />
              ))}
            </div>
          </div>
          <div>

            </div>

        <div className="flex py-4 items-center justify-between mt-16">
          <h2 className="text-3xl font-black">Transaction</h2>
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
          <div className="rounded-t-lg overflow-hidden">

            <PaymentTable PaymentsData={filteredPayments || []} />
          </div>

          <div className="flex flex-row justify-center w-full mt-6">
            <div className="flex flex-col justify-between items-center h-[70px] bg-transparent">
              <span className="text-black font-bold">
                Showing 1 to 5 of 50 Results
              </span>
              <div className="p-3 cursor-pointer border-[0.89px] border-black bg-[#FFB200] rounded-[10px] flex flex-row justify-center items-center">
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
        </>
      )}
    </div>
  );
}

export default Page;
