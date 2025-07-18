"use client";

import { CalendarIcon } from "@/utils/Icons";
import { DatePicker, Table } from "antd";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Card from "../../../../components/Card/Card";
import "./PaymentTable.css";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store/store";
import { getAllReturns } from "./actions";
import { IWithdraw } from "@/types/payment";
import { Poppins } from "next/font/google";

const statusColors = {
  ineligible: "bg-[#FC450E]",
  pending: "bg-[#FFB200]",
  sending: "bg-[#0059FF]",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

// Demo data
const demoWithdraws: IWithdraw[] = [
  {
    _id: "WD001",
    account_name: "Digital Solutions Agency",
    bank_name: "Chase Bank",
    account_number: "1234567890",
    routing_number: "021000021",
    code: "USD",
    transaction_receipt: "TR001",
    additional_note: "First payment",
    reason: "Monthly withdrawal",
    amount: 5000,
    bank_wallet: "Bank Transfer",
    currency: "USD",
    status: "pending",
    orderid: "ORD001",
    userid: "USER001",
    createdAt: "2024-03-15T10:30:00Z",
    returnNumber: "RN001",
    __v: 0
  },
  {
    _id: "WD002",
    account_name: "Tech Innovators Ltd",
    bank_name: "Bank of America",
    account_number: "9876543210",
    routing_number: "026009593",
    code: "USD",
    transaction_receipt: "TR002",
    additional_note: "Project completion",
    reason: "Project payment",
    amount: 7500,
    bank_wallet: "Bank Transfer",
    currency: "USD",
    status: "sending",
    orderid: "ORD002",
    userid: "USER002",
    createdAt: "2024-03-14T15:45:00Z",
    returnNumber: "RN002",
    __v: 0
  },
  {
    _id: "WD003",
    account_name: "Creative Minds Inc",
    bank_name: "Wells Fargo",
    account_number: "5678901234",
    routing_number: "121000248",
    code: "USD",
    transaction_receipt: "TR003",
    additional_note: "Service payment",
    reason: "Service fee",
    amount: 3000,
    bank_wallet: "Bank Transfer",
    currency: "USD",
    status: "ineligible",
    orderid: "ORD003",
    userid: "USER003",
    createdAt: "2024-03-13T09:15:00Z",
    returnNumber: "RN003",
    __v: 0
  },
  {
    _id: "WD004",
    account_name: "Global Services Co",
    bank_name: "Citibank",
    account_number: "4321098765",
    routing_number: "031100209",
    code: "USD",
    transaction_receipt: "TR004",
    additional_note: "Quarterly payment",
    reason: "Regular withdrawal",
    amount: 6000,
    bank_wallet: "Bank Transfer",
    currency: "USD",
    status: "pending",
    orderid: "ORD004",
    userid: "USER004",
    createdAt: "2024-03-12T14:20:00Z",
    returnNumber: "RN004",
    __v: 0
  },
  {
    _id: "WD005",
    account_name: "Smart Solutions LLC",
    bank_name: "TD Bank",
    account_number: "8901234567",
    routing_number: "054001725",
    code: "USD",
    transaction_receipt: "TR005",
    additional_note: "Final installment",
    reason: "Project completion",
    amount: 4500,
    bank_wallet: "Bank Transfer",
    currency: "USD",
    status: "sending",
    orderid: "ORD005",
    userid: "USER005",
    createdAt: "2024-03-11T11:00:00Z",
    returnNumber: "RN005",
    __v: 0
  }
];

const OnlinePaymentChecking = () => {
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [currentPaymentId, setCurrentPaymentId] = useState(null);
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [currency, setCurrency] = useState("");
  const [status, setStatus] = useState("");

  const dispatch = useDispatch();
  const returns: any = useSelector((state: RootState) => state.returns.returns);
  console.log(returns);
  const actions = useMemo(
    () => bindActionCreators({ getAllReturns }, dispatch),
    [dispatch]
  );

  const cardData = [
    {
      title: "Total Security Deposit",
      value: returns?.totalsendingamount || 0,
    },
    { title: "Total Deposit Amount", value: returns?.totalpendingrefund || 0 },
    { title: "Total Return Amount", value: returns?.totalrefundamount || 0 },
    { title: "Total Sending Return", value: returns?.totalsendingrefund || 0 },
    {
      title: "Total Ineligible Return",
      value: returns?.totalineligiblerefund || 0,
    },
    { title: "Total Sending Return Amount", value: returns?.totalrefund || 0 },
  ];

  useEffect(() => {
    actions.getAllReturns({
      status: "",
      startdate: "2025-02-01T00:00:00.000Z",
      enddate: "2025-02-12T23:59:59.999Z",
      currency: "",
      viewperpage: 10,
    });
  }, [actions]);

  useEffect(() => {
    if ((!startdate && enddate) || (startdate && !enddate)) return;
    actions.getAllReturns({
      status: status,
      startdate: startdate,
      enddate: enddate,
      currency: currency,
      viewperpage: 10,
    });
  }, [actions, startdate, enddate, currency, status]);

  const columns = [
    {
      title: "No.",
      dataIndex: "sl",
      render: (no: any) => (
        <span className="inline-block w-6 h-6 leading-6 text-center font-bold rounded text-black bg-[#FFB200]">
          {no}
        </span>
      ),
    },
    {
      title: "Return ID",
      dataIndex: "refundId",
      className: "font-normal",
    },
    {
      title: "Agency Name",
      dataIndex: "agencyName",
      className: "font-normal",
    },
    {
      title: "Account",
      dataIndex: "account",
      className: "font-normal",
    },
    {
      title: "Amount",
      dataIndex: "refundAmount",
      className: "font-normal",
    },
    {
      title: "Day",
      dataIndex: "refundDay",
      className: "font-normal",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: keyof typeof statusColors) => (
        <span
          className={`px-3 py-1 rounded text-white ${statusColors[status] || "bg-slate-500"
            } `}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      render: (record: any) => (
        <Link
          className="rounded-md bg-[#FFB200] px-3 py-1 text-[14px] text-black transition-all hover:bg-black hover:text-white hover:shadow-md"
          href={`/c/withdraw/view/payment?refundId=${record?.key}`}
        >
          view
        </Link>
      ),
    },
  ];

  const onStartDate = (value: any) => {
    setStartdate(value.toISOString());
  };
  const onEndDate = (value: any) => {
    setEnddate(value.toISOString());
  };

  const onCurrencyChange = (paymentType: string) => {
    setCurrency(paymentType);
  };

  const onStatusChange = (bankid: string) => {
    setStatus(bankid);
  };
  function convertToCustomUTCFormat(dateString: string) {
    const date = new Date(dateString);

    // Extract UTC components
    const year = date.getUTCFullYear().toString().slice(2); // Get last two digits of the year
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    // Determine AM or PM
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format

    // Format the output
    return `UTC.${year}-${month}-${day}. ${String(hours).padStart(2, '0')}:${minutes}  ${ampm}`;
}


  return (
    <div className="w-full p-2  lg:p-3 xl:p-5 bg-[#D0C2FF]">
      <div className="rounded-xl py-5">
        <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
          {cardData.map((card, i) => (
            <Card title={card.title} key={i} value={card.value} />
          ))}
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 w-full px-1 py-2 rounded-lg">
        {/* Currency Select */}
        <select
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          defaultValue=""
          className="min-w-[120px] rounded-lg px-2 py-2 bg-white text-black focus:outline-none"
        >
          <option value="" disabled>
            Currency
          </option>
          <option value="all">All</option>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
        </select>

        {/* Date Pickers */}
        <div className="flex items-center gap-1">
          <DatePicker
            onChange={onStartDate}
            className="!min-w-[140px] !rounded-lg !py-2 focus:!outline-none placeholder:!text-black"
            placeholder="MM/DD/YYYY"
            suffixIcon={<CalendarIcon />}
            style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          />
          <span className="text-black-4">To</span>
          <DatePicker
            onChange={onEndDate}
            className="!min-w-[140px] !rounded-lg !py-2 focus:!outline-none placeholder:!text-black"
            placeholder="MM/DD/YYYY"
            suffixIcon={<CalendarIcon />}
            style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          />
        </div>

        {/* Status Select */}
        <select
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          defaultValue=""
          className="min-w-[120px] rounded-lg px-2 py-2 bg-white text-black focus:outline-none"
        >
          <option value="" disabled>
            Status
          </option>
          <option value="all">All</option>
          <option value="inactive">InActive</option>
          <option value="active">Active</option>
          <option value="dormant">Dormant</option>
          <option value="dissolved">Dissolved</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="overflow-hidden rounded-2xl border border-[#FFB200] bg-white">
          <table className="w-full border-collapse">
            <thead className="bg-[#FFB200] text-sm">
              <tr>
                <th className="text-[#231F20] font-semibold px-2 py-4 first:rounded-tl-2xl">No.</th>
                <th className="text-[#231F20] font-semibold px-2 py-4">Return ID</th>
                <th className="text-[#231F20] font-semibold px-2 py-4">Return method</th>

                <th className="text-[#231F20] font-semibold px-2 py-4">Amount</th>
                <th className="text-[#231F20] font-semibold px-2 py-4">Day</th>
                <th className="text-[#231F20] font-semibold px-2 py-4">Status</th>
                <th className="text-[#231F20] font-semibold px-2 py-4 last:rounded-tr-2xl">Action</th>
              </tr>
            </thead>
            <tbody className="text-center text-black">
              {(returns?.userrefund || demoWithdraws).map((item: IWithdraw, index: number) => (
                <tr key={item._id} className="odd:bg-[#FAEFD8] even:bg-white text-xs">
                  <td className="py-3 border-r border-r-[#FFB200]">
                    <div className="font-bold text-black text-[9.72px] leading-[22.58px] w-[22.48px] h-[22.28px] bg-[#FFB200] mx-auto flex items-center justify-center rounded">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3 border-r border-r-[#FFB200]">{item._id}</td>
                  <td className="py-3 border-r border-r-[#FFB200]">{item.bank_name}</td>
                  <td className="py-3 border-r border-r-[#FFB200]">{item.amount} {item.currency}</td>
                  <td className="py-3 border-r border-r-[#FFB200]">
                    {convertToCustomUTCFormat(item.createdAt)}
                  </td>
                  <td className="py-3 border-r border-r-[#FFB200]">
                    <span className={`px-3 py-1 rounded text-white ${statusColors[item.status as keyof typeof statusColors] || "bg-slate-500"
                      }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <Link
                      className="rounded-md bg-[#FFB200] px-3 py-1 text-[14px] text-black transition-all hover:bg-black hover:text-white hover:shadow-md"
                      href={`/c/withdraw/view/payment?refundId=${item._id}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-center mt-4">
        <p className="text-md mb-2 text-black font-bold">
          Showing 1 To {returns?.userrefund?.length || 0} of {returns?.userrefund?.length || 0} Results
        </p>
        <button className="px-4 py-2 border bg-[#FFB200] rounded-full text-black hover:bg-black hover:text-white transition-colors">
          More Results
        </button>
      </div>
    </div>
  );
};

export default OnlinePaymentChecking;
