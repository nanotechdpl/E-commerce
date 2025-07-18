"use client";

import CreateArchitecture from "@/components/ui/MergedComponents/NewCategoryComponents/CreateArchitecture";
import CreateConstruction from "@/components/ui/MergedComponents/NewCategoryComponents/CreateConstruction";
import CreateExport from "@/components/ui/MergedComponents/NewCategoryComponents/CreateExport";
import CreateTechnical from "@/components/ui/MergedComponents/NewCategoryComponents/CreateTechnical";
import CreateTraveling from "@/components/ui/MergedComponents/NewCategoryComponents/CreateTraveling";
import Business from "@/components/ui/temp/Business";
import HiringEmployee from "@/modules/menuService/components/HiringEmployee";


import { useState } from "react";

const NewCategory: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("tab2");

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <section className="w-full">
      {/* Topbar */}
      <div className=" w-full p-4 my-2  2xl:p-10">
        <div className="flex flex-wrap items-center justify-start gap-3 md:gap-1 max-w-5xl">
          <button
            className={`${
              currentTab === "tab2" ? "bg-[#FFB200]" : "bg-white"
            } rounded-lg shadow-lg border border-[#ffb200] px-3 py-2 text-sm text-black font-semibold hover:bg-[#ffb200] transition-colors duration-200`}
            onClick={() => handleTabChange("tab2")}
          >
            Technical
          </button>

          <button
            className={`${
              currentTab === "tab3" ? "bg-[#FFB200]" : "bg-white"
            } rounded-lg shadow-lg border border-[#ffb200] px-3 py-2 text-sm text-black font-semibold hover:bg-[#ffb200] transition-colors duration-200`}
            onClick={() => handleTabChange("tab3")}
          >
            Construction
          </button>
          <button
            className={`${
              currentTab === "tab4" ? "bg-[#FFB200]" : "bg-white"
            } rounded-lg shadow-lg border border-[#ffb200] px-3 py-2 text-sm text-black font-semibold hover:bg-[#ffb200] transition-colors duration-200`}
            onClick={() => handleTabChange("tab4")}
          >
            Real Estate
          </button>
          <button
            className={`${
              currentTab === "tab5" ? "bg-[#FFB200]" : "bg-white"
            } rounded-lg shadow-lg border border-[#ffb200] px-3 py-2 text-sm text-black font-semibold hover:bg-[#ffb200] transition-colors duration-200`}
            onClick={() => handleTabChange("tab5")}
          >
            Input Export
          </button>
          <button
            className={`${
              currentTab === "tab7" ? "bg-[#FFB200]" : "bg-white"
            } rounded-lg shadow-lg border border-[#ffb200] px-3 py-2 text-sm text-black font-semibold hover:bg-[#ffb200] transition-colors duration-200`}
            onClick={() => handleTabChange("tab7")}
          >
           Visa Traveling
          </button>
          <button
            className={`${
              currentTab === "tab8" ? "bg-[#FFB200]" : "bg-white"
            } rounded-lg shadow-lg border border-[#ffb200] px-3 py-2 text-sm text-black font-semibold hover:bg-[#ffb200] transition-colors duration-200`}
            onClick={() => handleTabChange("tab8")}
          >
            Employee Hiring
          </button>
          <button
            className={`${
              currentTab === "tab9" ? "bg-[#FFB200]" : "bg-white"
            } rounded-lg shadow-lg border border-[#ffb200] px-3 py-2 text-sm text-black font-semibold hover:bg-[#ffb200] transition-colors duration-200`}
            onClick={() => handleTabChange("tab9")}
          >
            Business
          </button>
          
        </div>
      </div>

      {/* Main Content */}
      <div className=" my-2 min-h-screen">
        {currentTab === "tab2" && <CreateTechnical />}
        {currentTab === "tab3" && <CreateConstruction />}
        {currentTab === "tab4" && <CreateArchitecture />}
        {currentTab === "tab5" && <CreateExport />}
        {currentTab === "tab7" && <CreateTraveling />}
        {currentTab === "tab8" && <HiringEmployee />}
        {currentTab === "tab9" &&  <Business />}

    
      </div>
    </section>
  );
};

export default NewCategory;
