"use client";
import { useEffect, useMemo, useState } from "react";
import Card from "../../../../components/Card/Card";

import Loader from "@/components/common/Loader";

import { Poppins } from "next/font/google";
import ActionBar from "./_components/ActionBar";
import PaymentTable from "./_components/PaymentTable";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { getAllPayments } from "./actions";
import { RootState } from "@/redux/store/store";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

interface DashboardData {
  totalpayment: number;
  totalspamordersamount: number;
  totalpendingpayment: number;
  totalacceptedpayment: number;
  totalspampayment: number;
  totalpayamount: number;
  totalspampayamount: number;
  userpayments: Array<any>;
}

const ALLPayments = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentPayment, setCurrentPayment] = useState<any>(null);

  const userId = localStorage.getItem("userId");

  const dispatch = useDispatch();
  const payment: any = useSelector(
    (state: RootState) => state.payment?.payments
  );
  console.log(payment);
  const actions = useMemo(
    () => bindActionCreators({ getAllPayments }, dispatch),
    [dispatch]
  );

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (!userId) return;
    actions.getAllPayments(userId);
  }, [actions,userId]);

  const cardData = [
    { title: "Total payment", value: payment?.totaluserpayment || 0 },
    {
      title: "Total Pending Payment",
      value: payment?.totalpendingpayment || 0,
    },
    {
      title: "Total Accepted Payment",
      value: payment?.totalacceptedpayment || 0,
    },
    { title: "Total Spam Payment", value: payment?.totalspampayment || 0 },
    { title: "Total Pay Amount", value: payment?.totalsumpayment || 0 },
  ];

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };

  const onTableChange = (pagination: any, filter: any, sorter: any) => {
    const { order, field } = sorter;
    setSortBy(field as string);
    setSortOrder(order === "ascend" ? "asc" : "desc");
  };

  return (
    <div className="w-full p-4 md:p-6 2xl:p-10">
      {/* <Breadcrumb pageName="All Payments" /> */}
      {loading ? (
        // Show the loading image or spinner
        <Loader />
      ) : (
        <>
          <div className="rounded-xl py-5 px-1 lg:px-3">
            <div className="grid md:grid-cols-5 grid-cols-2 h-fit gap-3 ">
              {cardData.map((card, i) => (
                <Card key={i} title={card.title} value={card.value} />
              ))}
            </div>
          </div>
          <div className="w-full flex items-center justify-end gap-3 py-4">
            <ActionBar />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="rounded-t-lg overflow-x-auto">
            <PaymentTable PaymentsData={payment?.userpayment || []} />
          </div>

          <div className="flex flex-row justify-center w-full mt-6">
            <div className="flex flex-col justify-between items-center bg-transparent">
              <span className="text-black font-bold">
                Showing 1 to 5 of 50 Results
              </span>
              <div className="p-2 border-[0.89px] border-[#fff] bg-[#FFB200] rounded-[10px] flex flex-row justify-center items-center">
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
};

export default ALLPayments;
