"use client";

import Image from "next/image";
import { useState } from "react";
import CardThreeUpdate from "../CardThreeUpdate ";
import PhotoVideoUpdate from "../PhotoVideoUpdate";
import SupportIcon from "../SupportIcon";

import CardFiveUpdate from "../CardFiveUpdate";
import Hiring from "../Hiring";

const HomeTab = () => {
  const [currentTab, setCurrentTab] = useState("threeCard");

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <section className="flex flex-col w-full  overflow-hidden lg:flex-row">
      {/* Sidebar Input (only visible for "photoVideo" tab) */}
      {currentTab === "photoVideo" && (
        <div className="lg:min-w-[322px] lg:min-h-full bg-[#F8F6F0] lg:rounded-br-2xl p-3">
          <div className="flex flex-col space-y-4">
            <div className="flex w-full max-w-[300px] mx-auto justify-center rounded-[5px] border border-[#000000]">
              <input
                type="text"
                placeholder="Name"
                className="flex-1 font-inter font-light text-[14px] leading-[12.1px] text-[#000000] px-2 bg-[#EDEDED] rounded-l-[5px]"
              />
              <button className="px-3 h-[55px] bg-[#172554] rounded-r-[5px] text-white">
                Add
              </button>
            </div>
            <div className="flex items-center justify-between w-full max-w-[300px] mx-auto rounded-[5px] bg-[#EDEDED] border border-[#000000] p-2">
              <input
                type="text"
                placeholder="hh"
                className="flex-1 h-[41px] w-[4rem] bg-[#EDEDED] border-none focus:outline-none px-2"
              />
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div
                  className="relative w-11 h-6 bg-[#C8C8C8] rounded-full peer 
                     peer-checked:after:translate-x-full peer-checked:after:bg-green-500
                     after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full 
                     after:h-5 after:w-5 after:transition-all"
                />
              </label>
              <Image src={"/icons/trash.png"} width={16} height={16} className="object-contain" alt="delete" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="h-full flex-1  py-6">
        {/* Tab Buttons */}
        <div className="flex gap-3 lg:gap-5 max-w-5xl mx-auto justify-center flex-wrap overflow-x-auto pb-3">
          {[
            { key: "threeCard", label: "3 Card" },
            { key: "fiveCard", label: "5 Card" },
            { key: "hiring", label: "Hiring" },
            { key: "photoVideo", label: "Service Gallery" },
            { key: "paymentIcon", label: "Support Icon & Support Logo" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`rounded-[10px] shadow-lg px-3 py-3 text-sm border-[0.5px] font-semibold whitespace-nowrap 
                ${
                  currentTab === tab.key
                    ? "bg-[#ffb200] text-black"
                    : "bg-white text-[#00000080] border-[#00000080]"
                }
                hover:bg-[#ffb200] hover:border-none transition-all`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className=" w-full p-5">
          {currentTab === "threeCard" && <CardThreeUpdate />}
          {currentTab === "fiveCard" && <CardFiveUpdate />}
          {currentTab === "hiring" && <Hiring
           />}
          {currentTab === "photoVideo" && <PhotoVideoUpdate />}
          {currentTab === "paymentIcon" && <SupportIcon />}
        </div>
      </div>
    </section>
  );
};

export default HomeTab;
