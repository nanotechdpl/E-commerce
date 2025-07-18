"use client";

import CreateConstruction from "@/components/ui/MergedComponents/NewCategoryComponents/CreateConstruction";
import CreateExport from "@/components/ui/MergedComponents/NewCategoryComponents/CreateExport";
import CreateTechnical from "@/components/ui/MergedComponents/NewCategoryComponents/CreateTechnical";
import CreateTraveling from "@/components/ui/MergedComponents/NewCategoryComponents/CreateTraveling";
import { useState } from "react";

const Service: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("tab2");

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <section className="w-full">
      {/* Topbar */}
      <div className=" w-full p-4 my-2  2xl:p-10">
        <div className="flex flex-wrap items-center justify-start gap-3 md:gap-5 max-w-5xl">
          <button
            className={`${
              currentTab === "tab2" ? "bg-[#FFB200]" : "bg-white"
            } rounded-lg shadow-lg border border-[#ffb200] px-3 py-2 text-sm text-black font-semibold hover:bg-[#ffb200] transition-colors duration-200`}
            onClick={() => handleTabChange("tab2")}
          >
            Create Technical
          </button>

          <button
            className={`${
              currentTab === "tab4" ? "bg-[#FFB200]" : "bg-white"
            } rounded-lg shadow-lg border border-[#ffb200] px-3 py-2 text-sm text-black font-semibold hover:bg-[#ffb200] transition-colors duration-200`}
            onClick={() => handleTabChange("tab4")}
          >
            Create Construction
          </button>
          <button
            className={`${
              currentTab === "tab5" ? "bg-[#FFB200]" : "bg-white"
            } rounded-lg shadow-lg border border-[#ffb200] px-3 py-2 text-sm text-black font-semibold hover:bg-[#ffb200] transition-colors duration-200`}
            onClick={() => handleTabChange("tab5")}
          >
            Create Export
          </button>
          <button
            className={`${
              currentTab === "tab6" ? "bg-[#FFB200]" : "bg-white"
            } rounded-lg shadow-lg border border-[#ffb200] px-3 py-2 text-sm text-black font-semibold hover:bg-[#ffb200] transition-colors duration-200`}
            onClick={() => handleTabChange("tab6")}
          >
            Create Visa
          </button>
          <button
            className={`${
              currentTab === "tab7" ? "bg-[#FFB200]" : "bg-white"
            } rounded-lg shadow-lg border border-[#ffb200] px-3 py-2 text-sm text-black font-semibold hover:bg-[#ffb200] transition-colors duration-200`}
            onClick={() => handleTabChange("tab7")}
          >
            Create Traveling
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className=" px-4 my-2 min-h-screen">
        {currentTab === "tab2" && <CreateTechnical />}
        {currentTab === "tab" && <CreateTechnical />}
        {currentTab === "tab4" && <CreateConstruction />}
        {currentTab === "tab5" && <CreateExport />}
        {/* {currentTab === "tab6" && <CreateVisa />} */}
        {currentTab === "tab7" && <CreateTraveling />}
      </div>
    </section>
  );
};

export default Service;
