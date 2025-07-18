import { CalendarIcon } from "@/utils/Icons";
import { Button, DatePicker } from "antd";
import { Poppins } from "next/font/google";
import React from "react";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500"],
});
interface buttonTitleProp {
  title?: string;
  onOpenModal: (title: string) => void;
  setQuery: React.Dispatch<React.SetStateAction<string>>
}
const onStartDate = (value: string) => {
  console.log(value);
};
const onEndDate = (value: any) => {
  console.log(value);
};

const DateTimeSearch: React.FC<buttonTitleProp> = ({ title, onOpenModal, setQuery }) => {
  return (
    <div>
      {/* Date Range Picker and Search */}
      <div className="flex w-full flex-row items-center justify-between mb-4">
        <div className="flex item-center gap-2">
          
        </div>

        <form method="post" className="mr-auto">
          <input onChange={(e) => setQuery(e.target.value as string)} className="w-[10rem] outline-none border-none bg-white p-1" type="search" name="search" id="seach" placeholder=""/>
          <button className="w-[5rem] bg-[#FFB200] px-2 py-1" type="submit">Search</button>
        </form>
        {title && title !== "Create Employee" && (
          <Button
            className={`!bg-[#FFB200] h-[45px] !outline-none !p-5 ${poppins.className} !font-medium !text-base !text-center !text-[#000000] !rounded-lg`}
            onClick={() => onOpenModal(title)}
          >
            {title}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DateTimeSearch;
