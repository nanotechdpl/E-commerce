"use client";

import { CalendarIcon } from "@/utils/Icons";
import { DatePicker } from "antd";

const projectTypes = [
  { value: "All", label: "All" },
  { value: "payment", label: "Payment" },
  { value: "refund", label: "Refund" },
]

const ActionBar = () => {
  return (
    <div className="flex items-center lg:justify-end flex-wrap lg:flex-nowrap w-full gap-3">
      {/* Currency Select */}
      <form method="post" className="mr-auto">
          <input className="w-[10rem] outline-none border-none bg-white p-1" type="search" name="search" id="seach" placeholder="User ID or Agent Name"/>
          <button className="w-[5rem] bg-[#FFB200] px-2 py-1" type="submit">Search</button>
      </form>
      <select
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        defaultValue=""
        className="min-w-[120px] rounded-lg px-2 py-2 bg-white text-black focus:outline-none"      >
        <option value="" disabled>
          Types
        </option>
        {projectTypes.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <select
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        defaultValue=""
        className="rounded-lg px-2 py-2 bg-white text-black focus:outline-none"
      >
        <option value="" disabled>
          Currency
        </option>
        <option value="all">All</option>
        <option value="usd">USD</option>
        <option value="eur">EUR</option>
      </select>

      {/* Payment Method Select */}
      {/* <select
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        defaultValue=""
        className=" rounded-lg px-2 py-2 bg-white text-black focus:outline-none"
      >
        <option value="" disabled>
          Payment Method
        </option>
        <option value="All">All</option>
        <option value="sbi Bank">SBI Bank</option>
        <option value="paypal">Paypal</option>
        <option value="apply pay">Apply Pay</option>
      </select> */}
      {/* Date Pickers */}
      <div className="flex  sm:flex-row items-center gap-2 col-span-1 sm:col-span-2">
        <DatePicker
          onChange={() => console.log("Start Date")}
          className=" !rounded-lg !py-2 !bg-white !text-black focus:!outline-none"
          placeholder="MM/DD/YYYY"
          suffixIcon={<CalendarIcon />}
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        />
        <div className="text-black-4">To</div>
        <DatePicker
          onChange={() => console.log("End Date")}
          className=" !rounded-lg !py-2 !bg-white !text-black focus:!outline-none"
          placeholder="MM/DD/YYYY"
          suffixIcon={<CalendarIcon />}
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        />
      </div>

      {/* Status Select */}
      <select
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        defaultValue=""
        className=" rounded-lg px-2 py-2 bg-white text-black focus:outline-none"
      >
        <option value="" disabled>
          Status
        </option>
        <option value="all">All</option>
        <option value="succeeded">Succeeded</option>
        <option value="failed">Failed</option>
        <option value="disputed">Disputed</option>
        <option value="unacceptable">Unacceptable</option>
      </select>
    </div>
  );
};

export default ActionBar;
