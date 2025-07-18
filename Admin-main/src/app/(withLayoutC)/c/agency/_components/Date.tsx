import { CalendarIcon } from "@/utils/Icons";
import { DatePicker } from "antd";
import { useState } from "react";

interface AgencyData {
  sl: number;
  agencyName: string;
  account: string;
  refundAmount: number;
  refundDay: string;
  status: string;
  _id: string;
}

const AgencyTable = () => {
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);

  // Demo data - replace with your actual data
 

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex justify-end items-center gap-2 w-full px-1 py-2 rounded-lg mb-4">
        {/* Currency Select */}
        <form method="post" className="mr-auto">
          <input className="w-[10rem] outline-none border-none bg-white p-1" type="search" name="search" id="seach" placeholder="User ID or Agent Name"/>
          <button className="w-[5rem] bg-[#FFB200] px-2 py-1" type="submit">Search</button>
        </form>
        <select
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          defaultValue=""
          className="min-w-[120px] rounded-lg px-2 py-2 bg-white text-black focus:outline-none"
        >
          <option value="" disabled defaultValue={''}>
            Types
          </option>
          <option value="all">All</option>
          <option value="user">User</option>
          <option value="agency">Agency</option>
        </select>

        <select
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          defaultValue=""
          className="min-w-[120px] rounded-lg px-2 py-2 bg-white text-black focus:outline-none"
        >
          <option value="" disabled defaultValue={''}>
            Currency
          </option>
          <option value="all">All</option>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
        </select>

        {/* Date Pickers */}
        <div className="flex items-center gap-1">
          <DatePicker
            onChange={setStartDate}
            className="!min-w-[140px] !rounded-lg !py-2 focus:!outline-none placeholder:!text-black"
            placeholder="MM/DD/YYYY"
            suffixIcon={<CalendarIcon />}
            style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          />
          <span className="text-black-4">To</span>
          <DatePicker
            onChange={setEndDate}
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
          <option value="" disabled >
            Department
          </option>
          <option value="all">All</option>
          <option value="technical">Technical</option>
          <option value="construction">Construction</option>
          <option value="real-estate">Real Estate</option>
          <option value="visa">Visa</option>
          <option value="travelling">Travelling</option>
          <option value="export">Export</option>
          <option value="hiring">Hiring</option>
          <option value="business">Business</option>
        </select>
        
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
          <option value="suspend">Suspend</option>
          <option value="block">Block</option>
          <option value="dormant">Dormant</option>
          <option value="dissolved">Dissolved</option>
          <option value="close">Close</option>
        </select>
      </div>
    </div>
  );
};

export default AgencyTable;
