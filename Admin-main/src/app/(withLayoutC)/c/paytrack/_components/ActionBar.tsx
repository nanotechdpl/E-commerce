import { CalendarIcon } from "@/utils/Icons";
import { DatePicker } from "antd";
// import { Poppins } from "next/font/google";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["500", "600", "700"],
// });

interface ActionBarProps {
  onStartDate?: (startDate: Date) => void; // Assuming these are optional
  onEndDate?: (endDaye: Date) => void;
  onButtonClick: (paymentType: string) => void; // Expecting a function that takes a string
  activePaymentType: string; // Fixed type
}



const ActionBar: React.FC<ActionBarProps> = ({
  onStartDate,
  onEndDate,
  onButtonClick,
  activePaymentType,
}) => {

  const isActive = (paymentType: string) =>
    paymentType === activePaymentType ? "bg-[#FFB200] text-black" : "bg-white text-black";



  return (
    <div className="mb-10 flex flex-col md:flex-row flex-wrap justify-end gap-4 items-center my-10 px-4">
      {/* Date Pickers and Dropdown */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
        <div className="flex gap-2 w-full sm:w-auto">
          <DatePicker
            onChange={onStartDate}
            className={`!py-2 !bg-white !w-full sm:!w-[150px] placeholder:!text-black !text-center`}
            placeholder="MM/DD/YYYY"
            suffixIcon={<CalendarIcon />}
            style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          />
          <span className="flex items-center">To</span>
          <DatePicker
            onChange={onEndDate}
            className={`!py-2 !bg-white !w-full sm:!w-[150px] placeholder:!text-black !text-center`}            placeholder="MM/DD/YYYY"
            suffixIcon={<CalendarIcon />}
            style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap w-full sm:w-auto">
        {["Security_deposite", "Success_payment", "Success_refund", "Project_due amount", "profit"].map((type) => (
          <button
            key={type}
            style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
            className={`${isActive(type)} font-inter font-medium text-[12px] leading-[12.1px] px-2 py-2.5 lg:py-3.5 rounded-lg flex-1 min-w-[120px] sm:min-w-[150px] text-center`}
            onClick={() => onButtonClick(type)}
          >
            {type.replace("_", " ")}
          </button>
        ))}
      </div>

    </div>
  );
};

export default ActionBar;
