"use client";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
  Bar,
} from "recharts";
import { DashboardData } from "@/constants/dashboardData";
import { Data } from "@/constants/data";
import { useState } from "react";
import { CustomLineChart } from "@/components/ui/CustomLineChart";

const ReBar = dynamic(
  () => import("recharts").then((module) => module.BarChart),
  { ssr: false },
);

interface notificationType {
  id: number,
  title: string,
  content: string,
};

const HeroSection: React.FC = () => {
  // const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  // const [titleDisabled, setTitleDisabled] = useState<boolean>(false);
  // const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  // const [isOrderDropdownOpen, setIsOrderDropdownOpen] =
  //   useState<boolean>(false);

  // const [notifications] = useState<notificationType[]>([
  //   {
  //     id: 1,
  //     title: "New message",
  //     content: "You have a new message from John",
  //   },
  //   { id: 2, title: "Order update", content: "Your order has been shipped" },
  //   { id: 3, title: "Order update", content: "Your order has been shipped" },
  //   { id: 4, title: "Order update", content: "Your order has been shipped" },
  //   { id: 5, title: "Order update", content: "Your order has been shipped" },
  //   { id: 6, title: "Order update", content: "Your order has been shipped" },
  //   { id: 7, title: "Order update", content: "Your order has been shipped" },
  // ]);

  // const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  // const [showFullPage, setShowFullPage] = useState<boolean>(false);

  // const handleButtonClick = () => {
  //   if (showFullPage) {
  //     document.exitFullscreen();
  //   } else {
  //     const rootElement = document.documentElement;
  //     if (rootElement.requestFullscreen) {
  //       rootElement.requestFullscreen();
  //     }
  //   }

  //   setShowFullPage(!showFullPage);
  // };

  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode);
  // };

  // const handleNotificationClick = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  //   setIsOrderDropdownOpen(false);
  // };

  // const notificationCount = notifications.length;

  // const handleOrderDropdown = () => {
  //   setIsOrderDropdownOpen(!isOrderDropdownOpen);
  //   setIsDropdownOpen(false);
  // };

  // const [showPaymentTable, setShowPaymentTable] = useState<boolean>(false);
  // const hanleShowpayment = () => {
  //   setShowPaymentTable(!showPaymentTable);
  // };
  return (
    <>
      <div className="mb-3 mt-1 flex w-full justify-start ">
        <h1 className="mx-3 w-fit rounded-br-lg rounded-tl-lg bg-gradient-to-t  from-pink-500 to-yellow-300 p-2 text-start text-lg font-bold text-blue-800   ">
          DashBoard
        </h1>
      </div>
      <div className={`full-page-content  -mx-4 px-8 `}>
        <>
          <div className="grid grid-cols-6 gap-4 ">
            {DashboardData.map((item, i) => (
              <div
                key={i}
                className="rounded-br-3xl rounded-tl-3xl  bg-gradient-to-tr from-[#3949ac] to-purple-900 p-4 shadow-xl  shadow-yellow-200"
              >
                <p className="flex justify-between gap-8 text-white">
                  <span>{item.name}</span>

                  {/* <item.icon className="w-10 h-10 bg-green-500 rounded-full p-2" /> */}
                </p>
                <p className="text-xl text-white">$73,265</p>

                <div className="relative pt-1">
                  <div className="relative w-full py-1">
                    <div className="h-2 rounded-full bg-blue-200 ">
                      <div
                        style={{ width: `88%` }}
                        className="h-2 rounded-full bg-green-500"
                      ></div>
                    </div>
                    <div className="flex  items-center justify-between">
                      <div>
                        <p className="text-gray-100  inline-block py-1  text-xs ">
                          Previous period
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-100  inline-block text-xs">
                          88%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="ml-6 mt-10 w-[280px]">
            <CustomLineChart />
          </div>

          <div className="mt-10 grid grid-cols-5 gap-4 ">
            <div className="col-span-5 rounded-md bg-blue-950 p-4">
              <div className="mb-5">
                <p className="text-gray-200 text-2xl font-bold">
                  {" "}
                  Revenew by customer type
                </p>

                <div className="flex flex-row justify-end ">
                  <div>
                    <label htmlFor="fromDate"> </label>
                    <input
                      type="date"
                      id="fromDate"
                      value={endDate ? endDate.toISOString().split("T")[0] : ""}
                      onChange={(e) => setEndDate(new Date(e.target.value))}
                    ></input>
                  </div>
                  <div>
                    <label
                      htmlFor="toDate"
                      className="ml-6 text-2xl text-white"
                    >
                      To
                    </label>
                    <input
                      className="ml-6 h-12 w-60"
                      type="date"
                      id="toDate"
                      value={endDate ? endDate.toISOString().split("T")[0] : ""}
                      onChange={(e) => setEndDate(new Date(e.target.value))}
                    ></input>
                  </div>
                </div>
              </div>
              <ReBar
                width={1040}
                height={400}
                data={Data}
                margin={{ bottom: 50 }}
              >
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
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default HeroSection;
