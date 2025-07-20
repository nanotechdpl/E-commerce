"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Poppins } from "next/font/google";
import ActionBar from "./_components/ActionBar";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store/store";
import { getPaymentTracker } from "./action";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status?: string;
}

// Demo data for testing
const demoPayments: Payment[] = [
  { id: "1", currency: "APN", amount: 450 },
  { id: "2", currency: "AGA", amount: 456 },
  { id: "3", currency: "AWG", amount: 458 },
  { id: "4", currency: "BGD", amount: 456 },
  { id: "5", currency: "BSD", amount: 456 },
  { id: "6", currency: "ALL", amount: 45455 },
  { id: "7", currency: "ADA", amount: 45456 },
  { id: "8", currency: "AWG", amount: 45456 },
  { id: "9", currency: "BKD", amount: 45456 },
  { id: "10", currency: "KCP", amount: 45456 },
  { id: "11", currency: "USD", amount: 45445 },
  { id: "12", currency: "AGA", amount: 45445 },
  { id: "13", currency: "AWG", amount: 45445 },
  { id: "14", currency: "BGT", amount: 45445 },
  { id: "15", currency: "RAD", amount: 45445 },
  { id: "16", currency: "CSD", amount: 4545 },
  { id: "17", currency: "AGA", amount: 4545 },
  { id: "18", currency: "EUR", amount: 4545 },
  { id: "19", currency: "BGT", amount: 4545 },
  { id: "20", currency: "INR", amount: 4545 },
  { id: "21", currency: "CSD", amount: 99 },
  { id: "22", currency: "AGA", amount: 99 },
  { id: "23", currency: "AZN", amount: 99 },
  { id: "24", currency: "BGT", amount: 99 },
  { id: "25", currency: "INR", amount: 99 },
  { id: "26", currency: "APN", amount: 450 },
  { id: "27", currency: "AGA", amount: 456 },
  { id: "28", currency: "AWG", amount: 458 },
  { id: "29", currency: "BGD", amount: 456 },
  { id: "30", currency: "BSD", amount: 456 },
  { id: "31", currency: "ALL", amount: 45455 },
  { id: "32", currency: "ADA", amount: 45456 },
  { id: "33", currency: "AWG", amount: 45456 },
  { id: "34", currency: "BKD", amount: 45456 },
  { id: "35", currency: "KCP", amount: 45456 }
];

export const PayTrackTable: React.FC = () => {
  const dispatch = useDispatch();
  const paymentTracker = useSelector((state: RootState) => state.payment.paymentTracker);
  const [searchTerm, setSearchTerm] = useState("");
  // const [status] = useState("");
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  // const [viewperpage] = useState(10);
  // const [bankid] = useState("");
  const [paymentType, setPaymentType] = useState("");

  useEffect(() => {
    // Fetch real payment tracker data on mount
    dispatch(getPaymentTracker({
      status: "",
      startdate: startdate || undefined,
      enddate: enddate || undefined,
      viewperpage: 100, // or any default
      bankid: "",
      payment_type: paymentType || undefined,
    }));
  }, [dispatch, startdate, enddate, paymentType]);

  const filteredData = (Array.isArray(paymentTracker) ? paymentTracker : []).filter((item) =>
    item.currency?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onStartDate = (value: Date) => {
    setStartdate(value.toISOString());
  };
  const onEndDate = (value: Date) => {
    setEnddate(value.toISOString());
  };

  const onButtonClick = (paymentType: string) => {
    setPaymentType(paymentType);
  };

  // const chunkData = (arr: Payment[], chunkSize: number): Payment[][] => {
  //   const result: Payment[][] = [];
  //   for (let i = 0; i < arr.length; i += chunkSize) {
  //     result.push(arr.slice(i, i + chunkSize));
  //   }
  //   return result;
  // };

  // const chunkedData = chunkData(filteredData, 5);

  return (
    <>
      <div className="w-full h-screen px-2 text-black bg-transparent">
        {/* Search and Filter Section */}
        <ActionBar
          onStartDate={onStartDate}
          onEndDate={onEndDate}
          onButtonClick={onButtonClick}
          activePaymentType={paymentType}
        />

        {/* Data Table */}
        <div className="overflow-x-hidden px-3">
          <div className="rounded-t-lg bg-warning overflow-hidden">
            <table className="w-full rounded border-collapse min-w-[600px]">
              <thead className="bg-[#FFB200] text-xs rounded-t-lg">
                <tr>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>No.</th>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>Currency ISO</th>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>Amount</th>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>No.</th>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>Currency ISO</th>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>Amount</th>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>No.</th>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>Currency ISO</th>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>Amount</th>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>No.</th>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>Currency ISO</th>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>Amount</th>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>No.</th>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>Currency ISO</th>
                  <th className={`${poppins.className} text-[#231F20] font-semibold px-2 py-5`}>Amount</th>
                </tr>
              </thead>
              <tbody className="text-center border border-[#FFB200]">
                {Array.from({ length: Math.ceil(filteredData.length / 5) }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="odd:bg-[#FAEFD8] even:bg-white">
                    {Array.from({ length: 5 }).map((_, colIndex) => {
                      const dataIndex = rowIndex * 5 + colIndex;
                      const data = filteredData[dataIndex];
                      return (
                        <React.Fragment key={colIndex}>
                          <td className="py-4 px-2 border-r border-r-[#FFB200]">
                            {data && (
                              <div className={`${poppins.className} font-bold rounded-md text-black w-6 h-6 bg-[#FFB200] mx-auto text-xs flex items-center justify-center`}>
                                {dataIndex + 1}
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-2 text-xs border-r border-r-[#FFB200]">
                            {data?.currency}
                          </td>
                          <td className="py-2 px-2 text-xs border-r border-r-[#FFB200]">
                            {data?.amount}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayTrackTable;