import { CalendarIcon } from "@/utils/Icons";
import { DatePicker } from "antd";

const ActionBar = () => {
  return (
    <div className=" flex gap-3 lg:gap-2 items-center  lg:justify-end flex-wrap my-4 ">
      <form method="post" className="mr-auto">
        <input className="w-[10rem] outline-none border-none bg-white p-1" type="search" name="search" id="seach" placeholder="User ID or User Name"/>
        <button className="w-[5rem] bg-[#FFB200] px-2 py-1" type="submit">Search</button>
      </form>
      <select
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        defaultValue=""
        className="rounded-lg px-2 py-2 outline-none border-0  bg-white text-black"
      >
        <option value="" disabled>
          Types
        </option>
        <option value="all">All</option>
        <option value="user">User</option>
        <option value="agency">Agency</option>
      </select>
      <select
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        defaultValue=""
        className="rounded-lg px-2 py-2 outline-none border-0  bg-white text-black"
      >
        <option value="" disabled>
          Currency
        </option>
        <option value="all">All</option>
        <option value="usd">USD</option>
        <option value="eur">EUR</option>
      </select>
      <div className="flex items-center gap-1   ">
        <DatePicker
          className="!py-2 !rounded-lg !bg-white  placeholder:!text-black"
          placeholder="MM/DD/YYYY"
          suffixIcon={<CalendarIcon />}
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        />
        <span className="text-black-4 mx-1">To</span>
        <DatePicker
          className="!py-2 !rounded-lg !bg-white  placeholder:!text-black"
          placeholder="MM/DD/YYYY"
          suffixIcon={<CalendarIcon />}
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        />
      </div>

      <select
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        defaultValue=""
        className="rounded-lg px-2  py-2 bg-white text-black"
      >
        <option value="" disabled>
          Status
        </option>
        <option value="All">All</option>
        <option value="active">Active</option>
        <option value="suspend">Suspend</option>
        <option value="block">Block</option>
        <option value="dormant">Dormant</option>
        <option value="closed">Closed</option>
      </select>
    </div>
  );
};

export default ActionBar;
