import React from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
  Bar,
  ResponsiveContainer,
} from "recharts";
import dynamic from "next/dynamic";

import DatePickerOne from "../FormElements/DatePicker/DatePickerOne";
import DatePickerTwo from "../FormElements/DatePicker/DatePickerTwo";
import { Data } from "@/constants/data";

const ReBar = dynamic(
  () => import("recharts").then((module) => module.BarChart),
  { ssr: false },
);

const RenewChart = () => {
  // const [endDate, setEndDate] = useState<Date | null>(null);
  return (
    <div className="mt-10 grid grid-cols-5 gap-4 ">
      <div className="col-span-5 rounded-md bg-blue-950 p-4">
        <div className="mb-5">
          <p className="text-gray-200 text-2xl font-bold">
            {" "}
            Revenew by customer type
          </p>

          <div className="flex flex-row items-center justify-end gap-2">
            <DatePickerOne />
            <span>To</span>
            <DatePickerTwo />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ReBar width={2000} height={400} data={Data} margin={{ bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              stroke="red"
              dataKey="name"
              tick={{ fill: "#d4d4d4" }}
              className="m-0 break-all p-0 text-[12px] tracking-tighter"
              angle={-45}
              textAnchor="end"
            />
            <YAxis
              tick={{ fill: "#d4d4d4" }}
              className="m-0 p-0 text-[10px]"
              stroke="red"
            />
            <Tooltip
              labelStyle={{ color: "#898a83" }}
              itemStyle={{ color: "#898a83" }}
            />
            <Legend
              wrapperStyle={{ color: "purple" }}
              layout="vertical" // Position the legend vertically
              align="right"
            />
            <Bar dataKey="pv" fill="#8884d8" stackId="a" barSize={20} />
            <Bar dataKey="pv" fill="#FFC0CB" stackId="a" barSize={10}>
              {" "}
              <LabelList
                position="top"
                formatter={(value: number) => {
                  if (value >= 1000) {
                    return `${Math.floor(value / 1000)}k`;
                  } else {
                    return value; // Display the original value if less than 1000
                  }
                }}
              />{" "}
            </Bar>
          </ReBar>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RenewChart;
