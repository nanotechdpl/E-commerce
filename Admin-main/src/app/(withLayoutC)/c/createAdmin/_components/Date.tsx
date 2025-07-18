import { CalendarIcon } from "@/utils/Icons";
import { DatePicker } from "antd";

const Date = () => {
  return (
    <div className="mb-2 flex items-center justify-start w-full gap-3">
      <DatePicker
        className="py-2 bg-white w-35 placeholder:text-black"
        placeholder="MM/DD/YYYY"
        suffixIcon={<CalendarIcon />}
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      />
      <span className="text-black-4">To</span>
      <DatePicker
        className="py-2 bg-white w-35 placeholder:text-black"
        placeholder="MM/DD/YYYY"
        suffixIcon={<CalendarIcon />}
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      />
    </div>
  );
};

export default Date;
