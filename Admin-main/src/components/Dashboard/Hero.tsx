"use client";
import {
  ArcElement,
  Chart,
  DoughnutController,
  Legend,
  registerables,
  Tooltip,
} from "chart.js";
import React, { useEffect, useMemo, useState } from "react";
Chart.register(...registerables);

import { Inter } from "next/font/google";
import { BiRupee } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { IoIosCodeWorking } from "react-icons/io";

import {
  MdAccountBalanceWallet,
  MdCancelScheduleSend,
  MdConfirmationNumber,
  MdIncompleteCircle,
  MdPendingActions,
  MdUpcoming,
} from "react-icons/md";
import {
  RiLuggageDepositFill,
  RiLuggageDepositLine,
  RiPassPendingFill,
  RiSpam2Fill,
} from "react-icons/ri";
const inter = Inter({
  weight: ["600"],
  subsets: ["latin"],
});
import moment from "moment";
// Registering necessary components for doughnut chart
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

import CardDataStats from "../CardDataStats";

import LineChart from "../ui/CustomLineChart";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import {
  getAdminOrdersData,
  getAdminDashboadUsersData,
  getAdminDashboadPaymentsData,
  getAdminDashboadRetrunsData,
  getAdminDashboadAgenciesData,
} from "@/app/(withLayoutC)/c/dashboard/action";
import { IWithdraw } from "@/types/payment";
import { OrderData } from "@/types/orderData";
import { IAgency } from "@/types/agency";
import Link from "next/link";

const ECommerce: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdminOrdersData());
    dispatch(getAdminDashboadUsersData());
    dispatch(getAdminDashboadPaymentsData());
    dispatch(getAdminDashboadRetrunsData());
    dispatch(getAdminDashboadAgenciesData());
  }, [dispatch]);

  const userData: any = useSelector(
    (state: RootState) => state.dashboard?.users
  );
  const orderData = useSelector(
    (state: RootState) => state.dashboard.orders
  );
  const paymentsData = useSelector(
    (state: RootState) => state.dashboard?.payments
  );
  const returnData: any = useSelector(
    (state: RootState) => state.dashboard?.returns
  );
  const agencyData: any = useSelector(
    (state: RootState) => state.dashboard?.agencies
  );

  const testData = [
    { name: "Total User", icon: FiUsers, number: userData?.totalusers || 0 },
    {
      name: "Total Orders",
      icon: MdPendingActions,
      number: orderData?.totaluserorder || 0,
    },
    {
      name: "Total pending orders",
      icon: IoIosCodeWorking,
      number: orderData?.totalpendingorders || 0,
    },
    {
      name: "Total payment order",
      icon: MdCancelScheduleSend,
      number: orderData?.totalorderpayment || 0,
    },
    {
      name: "Total waiting order",
      icon: MdIncompleteCircle,
      number: orderData?.totalwaitingorders || 0,
    },
    {
      name: "Total working orders",
      icon: BiRupee,
      number: orderData?.totalworkingorders || 0,
    },
    {
      name: "Total complete orders",
      icon: MdAccountBalanceWallet,
      number: orderData?.totalcompleteorders || 0,
    },
    {
      name: "Total delivery orders",
      icon: MdUpcoming,
      number: orderData?.totaldeliveredorders || 0,
    },
    {
      name: "Total cancel orders",
      icon: RiLuggageDepositFill,
      number: orderData?.totalcancelorders || 0,
    },

    {
      name: "Total amount $",
      icon: RiLuggageDepositLine,
      number: paymentsData?.totalsumpayment || 0,
    },
    {
      name: "Total profit amount $",
      icon: RiPassPendingFill,
      number: "22,671",
    },
    {
      name: "Total Arrived amount $",
      icon: MdConfirmationNumber,
      number: paymentsData?.totaluserpayment || 0,
    },
    { name: "Total remaining amount $", icon: RiSpam2Fill, number: "18,375" },
    { name: "Total online deposit", icon: RiSpam2Fill, number: "7,845" },
    {
      name: "Total online payment amount $",
      icon: RiSpam2Fill,
      number: "26,498",
    },
    {
      name: "Total pending payment",
      icon: RiSpam2Fill,
      number: paymentsData?.totalpendingpayment || 0,
    },
    {
      name: "Total accepted payment",
      icon: RiSpam2Fill,
      number: paymentsData?.totalacceptedpayment || 0,
    },
    {
      name: "Total spam payment",
      icon: RiSpam2Fill,
      number: paymentsData?.totalspampayment || 0,
    },
    { name: "Total offline deposit", icon: RiSpam2Fill, number: "8,520" },
    {
      name: "Total offline payment amount $",
      icon: RiSpam2Fill,
      number: "25,340",
    },
    { name: "Total offline Active Check", icon: RiSpam2Fill, number: "12,875" },
    {
      name: "Total offline Deactive Check",
      icon: RiSpam2Fill,
      number: "5,120",
    },
    {
      name: "Total offline complete Check",
      icon: RiSpam2Fill,
      number: "7,912",
    },

    {
      name: "Total online refund",
      icon: RiSpam2Fill,
      number: returnData?.totaluserrefund || 0,
    },
    {
      name: "Total online refund amount $",
      icon: RiSpam2Fill,
      number: returnData?.totalsumrefund || 0,
    },
    {
      name: "Total online pending refund",
      icon: RiSpam2Fill,
      number: returnData?.totalpendingrefund || 0,
    },
    {
      name: "Total online sending refund",
      icon: RiSpam2Fill,
      number: returnData?.totalsedningrefund || 0,
    },
    {
      name: "Total online ineligible refund",
      icon: RiSpam2Fill,
      number: returnData?.totalIneligibleRefund || 0,
    },
    { name: "Total offline refund", icon: RiSpam2Fill, number: "4,310" },
    {
      name: "Total offline refund amount $",
      icon: RiSpam2Fill,
      number: "20,815",
    },
    {
      name: "Total offline pending refund",
      icon: RiSpam2Fill,
      number: "3,204",
    },
    {
      name: "Total offline sending refund",
      icon: RiSpam2Fill,
      number: "1,892",
    },
    {
      name: "Total offline ineligible refund",
      icon: RiSpam2Fill,
      number: "1,201",
    },
    { name: "Total Subscribe", icon: RiSpam2Fill, number: "14,785" },
    { name: "Total communication", icon: RiSpam2Fill, number: "6,230" },
    { name: "Total live chat user", icon: RiSpam2Fill, number: "2,645" },
  ];

  // const actions = useMemo(
  //   () =>
  //     bindActionCreators(
  //       {
  //         getAdminOrdersData,
  //         getAdminDashboadUsersData,
  //         getAdminDashboadPaymentsData,
  //         getAdminDashboadRetrunsData,
  //         getAdminDashboadAgenciesData,
  //       },
  //       dispatch
  //     ),
  //   [dispatch]
  // );
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    let trafficByDeviceChart: Chart | null = null;
    let trafficByLocationChart: any | null = null;
    let marketingSeoChart: Chart | null = null;

    const ctx1 = document.getElementById(
      "trafficByDevice"
    ) as HTMLCanvasElement;

    if (ctx1 && !trafficByDeviceChart) {
      trafficByDeviceChart = new Chart(ctx1, {
        type: "bar",
        data: {
          labels: ["Linux", "Mac", "iOS", "Window", "Android", "Other"],
          datasets: [
            {
              label: "Traffic",
              data: [15000, 25000, 18000, 30000, 10000, 22000],
              backgroundColor: [
                "rgb(156, 163, 255)", // Linux - Purple
                "rgb(167, 243, 208)", // Mac - Light Green
                "rgb(198, 176, 255)", // iOS - Light Purple
                "rgb(147, 197, 253)", // Windows - Light Blue
                "rgb(209, 213, 219)", // Android - Gray
                "rgb(134, 239, 172)", // Other - Green
              ],
              borderRadius: 8,
              barThickness: 25,
              maxBarThickness: 30,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 30000,
              ticks: {
                stepSize: 10000,
                callback: function (value) {
                  return value === 0 ? "0" : Number(value) / 1000 + "K";
                },
                padding: 10,
                font: {
                  family: "Inter",
                  size: 12,
                },
              },
              grid: {
                display: false,
              },
              border: {
                display: false,
              },
            },
            x: {
              grid: {
                display: false,
              },
              border: {
                display: false,
              },
              ticks: {
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
                padding: 10,
                font: {
                  family: "Inter",
                  size: 12,
                },
                color: "#6B7280", // Gray color for labels
              },
            },
          },
          layout: {
            padding: {
              top: 20,
              bottom: 20,
              left: 10,
              right: 10,
            },
          },
          maintainAspectRatio: false,
          // barPercentage: 0.7,
          // categoryPercentage: 0.9,
        },
      });
    }

    const ctx2 = document.getElementById(
      "trafficByLocation"
    ) as HTMLCanvasElement;
    if (ctx2 && !trafficByLocationChart) {
      trafficByLocationChart = new Chart(ctx2, {
        type: "doughnut",
        data: {
          labels: ["United States", "Canada", "Mexico", "Other"],
          datasets: [
            {
              label: "Location",
              data: [38.6, 22.5, 30.8, 8.1],
              backgroundColor: [
                "rgb(198, 176, 255)",
                "rgb(147, 197, 253)",
                "rgb(167, 243, 208)",
                "rgb(209, 213, 219)",
              ] as string[],
              borderWidth: 2,
              spacing: 1.5,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          cutout: "50%",
          plugins: {
            legend: {
              display: true,
              position: "right" as const,
              align: "center" as const,
              labels: {
                usePointStyle: true,
                pointStyle: "circle",
                padding: 15,
                font: {
                  family: "Inter",
                  size: 12,
                },
                generateLabels: function (chart) {
                  const data = chart.data;
                  if (!data.labels || !data.datasets.length) return [];
                  
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    const backgroundColor = Array.isArray(data.datasets[0].backgroundColor) 
                      ? (data.datasets[0].backgroundColor as string[])[i] 
                      : undefined;
                    
                    return {
                      text: `${label}${" "}${value}%`,
                      fillStyle: backgroundColor,
                      hidden: false,
                      textAlign: "left",
                      lineCap: undefined,
                      lineDash: undefined,
                      lineDashOffset: undefined,
                      lineJoin: undefined,
                      lineWidth: 0,
                      strokeStyle: undefined,
                      pointStyle: "circle",
                      index: i
                    };
                  });
                },
              },
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: function (context) {
                  return ` ${context.label}: ${context.raw}%`;
                },
              },
            },
          },
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 30,
              top: 10,
              bottom: 10,
            },
          },
        },
      });
    }

    const ctx3 = document.getElementById("marketingSeo") as HTMLCanvasElement;
    if (ctx3 && !marketingSeoChart) {
      marketingSeoChart = new Chart(ctx3, {
        type: "bar",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Marketing & SEO",
              data: [
                12000, 25000, 17000, 28000, 8000, 22000, 12000, 25000, 17000,
                30000, 8000, 22000,
              ],
              backgroundColor: [
                "#A5B4FF", // Jan - purple
                "#98FB98", // Feb - light green
                "#B0A7E3", // Mar - light purple
                "#87CEEB", // Apr - light blue
                "#B0C4DE", // May - light grey-blue
                "#98FB98", // Jun - light green
                "#A5B4FF", // Jul - purple
                "#98FB98", // Aug - light green
                "#B0A7E3", // Sep - light purple
                "#87CEEB", // Oct - light blue
                "#B0C4DE", // Nov - light grey-blue
                "#98FB98", // Dec - light green
              ],
              borderRadius: 8,
              borderSkipped: false,
              barThickness: 24,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 30000,
              ticks: {
                stepSize: 10000,
                callback: function (value) {
                  return Number(value) / 1000 + "K";
                },
                font: {
                  size: 12,
                },
              },
              grid: {
                display: false,
              },
              border: {
                display: false,
              },
            },
            x: {
              grid: {
                display: false,
              },
              border: {
                display: false,
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (trafficByDeviceChart) trafficByDeviceChart.destroy();
      if (trafficByLocationChart) trafficByLocationChart.destroy();
      if (marketingSeoChart) marketingSeoChart.destroy();
    };
  }, []);

  const handleSeeMore = () => {
    setVisibleCount(testData?.length);
  };
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex-1 w-full lg:w-3/4">
        <div className="">
          {/* Cards Layout */}
          <div className=" grid  grid-cols-1 xsm:grid-cols-2 gap-2 xsm:gap-3 md:grid-cols-2 md:gap-3 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4 2xl:gap-4">
            {testData?.slice(0, visibleCount)?.map((data, index) => (
              <CardDataStats key={index} name={data.name} number={data.number}>
                <data.icon />
              </CardDataStats>
            ))}
          </div>

          {/* Line Chart */}
          <div className="mt-8   ">
            <LineChart />
          </div>

          {/* Traffic by Device and Location */}
          <div className="items-center min-h-screen my-6 ">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              {/* Traffic by Device */}
              <div className="bg-white   rounded-[20px] shadow-lg p-6 w-full lg:w-1/2 ">
                <h2
                  className={`${inter.className}  text-black text-base font-semibold mb-4`}
                >
                  Traffic by Device
                </h2>
                <div className="h-[300px] ">
                  <canvas
                    id="trafficByDevice"
                    className="  "
                  ></canvas>
                </div>
              </div>

              {/* Traffic by Location */}
              <div className=" bg-white  text-black rounded-[20px] shadow-lg p-6 w-full lg:w-1/2 ">
                <h2
                  className={`${inter.className}  text-base font-semibold mb-4`}
                >
                  Traffic Location
                </h2>
                <div className="h-[300px] ">
                  <canvas
                    id="trafficByLocation"
                    className=""
                  ></canvas>
                </div>
              </div>
            </div>

            {/* Marketing & SEO */}
            <div className="bg-[#FFF]  rounded-2xl p-6 lg:p-8 w-full max-w-full h-auto lg:h-[500px] shadow-lg mt-8">
              <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
                <h2 className="text-[14px] lg:text-[16px]  text-black font-semibold">
                  Marketing & SEO
                </h2>
                <div className="flex items-center gap-2 mt-4 lg:mt-0">
                  <input
                    type="text"
                    placeholder="MM/DD/YYYY"
                    className="border rounded px-2 py-1 text-sm w-24 lg:w-32"
                  />
                  <span className="text-sm">To</span>
                  <input
                    type="text"
                    placeholder="MM/DD/YYYY"
                    className="border rounded px-2 py-1 text-sm w-24 lg:w-32"
                  />
                </div>
              </div>
              <div className="h-[300px] lg:h-[350px] ">
                <canvas id="marketingSeo"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* chat column */}
      <div className="md:flex flex-wrap h-fit  w-full gap-8 lg:w-1/4 ">
        <div className="text-black  w-full  bg-white  h-fit  rounded-2xl shadow-md p-4   ">
          <div className="flex flex-row  justify-between    mb-2">
            <h2 className="header font-medium    text-sm font-inter">
              New Orders
            </h2>
            <h2 className="header font-medium text-black  text-sm font-inter">
              New {orderData?.userorders?.length || 0}
            </h2>
          </div>
          <ul className="space-y-4">
            {orderData?.userorders
              ?.slice(0, 3)
              ?.map((order: OrderData, index: number) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 border-[0.5px]  border-[#00000030] rounded-xl px-2 py-2"
                >
                  {/* Name and role */}
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="font-inter text-sm font-normal  text-black overflow-hidden text-ellipsis whitespace-nowrap">
                      {order.project_type}
                    </p>
                    <p className="text-sm text-black/50 overflow-hidden text-ellipsis whitespace-nowrap">
                      {order.budget} USD
                    </p>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-xs text-nowrap text-gray-500">
                      {moment(order.createdAt).fromNow()}
                    </p>
                  </div>
                </li>

              ))}
          </ul>
          <Link href={"/c/orders"} className="flex flex-row justify-end mt-2 ">
            <span className="w-[116px] text-center text-[12px] leading-[18px] rounded-md font-normal border border-[#FFB20033] py-2">
              see all orders
            </span>
          </Link>
        </div>
        <div className="text-black  w-full  bg-white  h-fit  rounded-2xl shadow-md p-4   ">
          <div className="flex flex-row justify-between  mb-2">
            <h2 className="header font-medium text-[#000000]   text-sm font-inter">
              New Agency
            </h2>
            <h2 className="header font-medium text-[#000000]   text-sm font-inter">
              New {agencyData?.totalAgency || 0}
            </h2>
          </div>
          <ul className="space-y-4 ">
            {agencyData?.agencies
              ?.slice(0, 3)
              ?.map((agency: IAgency, index: number) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 border-[0.5px]  border-[#00000030] rounded-xl px-2 py-2"
                >
                  {/* Name and role */}
                  <div className="w-[60%] text-ellipsis text-left overflow-hidden whitespace-nowrap">
                    <p className="font-inter text-sm text-nowrap text-ellipsis font-normal  text-black overflow-hidden">
                      {agency.agencyName}
                    </p>
                    <p className="text-sm text-black/50 overflow-hidden text-ellipsis whitespace-nowrap">
                      {agency.fullName}
                    </p>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-xs text-gray-500 text-ellipsis ">
                      {moment(agency.createdAt).fromNow()}
                    </p>
                  </div>
                </li>

              ))}
          </ul>
          <Link href={"/c/agency"} className="flex flex-row justify-end mt-2">
            <span className="w-[116px] text-center text-[12px] leading-[18px] rounded-md font-normal border border-[#FFB20033] py-2">
              see all agency
            </span>
          </Link>
        </div>

        <div className="text-black  w-full  bg-white  h-fit  rounded-2xl shadow-md p-4   ">
          <div className="flex flex-row justify-between  mb-2">
            <h2 className="header font-medium text-[#000000]   text-sm font-inter">
              New Payments
            </h2>
            <h2 className="header font-medium text-[#000000]   text-sm font-inter">
              New {paymentsData?.totaluserpayment || 0}
            </h2>
          </div>

          <ul className="space-y-4  ">
            {paymentsData?.userpayment
              ?.slice(0, 3)
              ?.map((payment: any, index: number) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 border-[0.5px]  border-[#00000030] rounded-xl px-2 py-2"
                >
                  {/* Name and role */}
                  <div className="flex-1 text-left">
                    <p className="font-inter text-sm font-normal  text-black">
                      {payment.account_name}
                    </p>
                    <p className="text-sm text-black/50">
                      {payment.amount} USD
                    </p>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-xs text-gray-500">
                      {moment(payment.createdAt).fromNow()}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
          <Link
            href={"/c/allpayment"}
            className="flex flex-row justify-end mt-2"
          >
            <span className="w-[116px] text-center text-[12px] leading-[18px] rounded-md font-normal border border-[#FFB20033] py-2">
              see all payments
            </span>
          </Link>
        </div>

        <div className="text-black  w-full  bg-white  h-fit  rounded-2xl shadow-md p-4   ">
          <div className="flex flex-row justify-between  mb-2">
            <h2 className="header font-medium text-[#000000]   text-sm font-inter">
              New Returns
            </h2>
            <h2 className="header font-medium text-[#000000]   text-sm font-inter">
              New {returnData?.userrefund?.length || 0}
            </h2>
          </div>

          <ul className="space-y-4">
            {returnData?.userrefund
              ?.slice(0, 3)
              ?.map((withdraw: IWithdraw, index: number) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 border-[0.5px]  border-[#00000030] rounded-xl px-2 py-2"
                >
                  {/* Name and role */}
                  <div className="flex-1 text-left">
                    <p className="font-inter text-sm font-normal  text-black">
                      {withdraw.account_name}
                    </p>
                    <p className="text-sm text-black/50">
                      {withdraw.amount} USD
                    </p>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-xs text-gray-500">
                      {moment(withdraw.createdAt).fromNow()}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
          <Link href={"/c/withdraw"} className="flex flex-row justify-end mt-2">
            <span className="w-[116px] text-center text-[12px] leading-[18px] rounded-md font-normal border border-[#FFB20033] py-2">
              see all returns
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ECommerce;
