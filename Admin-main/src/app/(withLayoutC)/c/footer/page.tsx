"use client";

import CreateGlobalLocations from "@/modules/footer/components/CreateGlobalBranch"

import CompanyTab from "@/components/ui/temp/CompanyTab";
import ContactUsDropDownTable from "@/components/ui/temp/ContactUsDropDownTable";
import CreateEmployee from "@/modules/footer/components/CreateEmployee";

import SocialSharePayment from "@/components/ui/temp/SocialSharePayment";


import { useState } from "react";
import CreateNotice from "@/modules/footer/components/CreateNotice";
import CreateBlog from "@/modules/footer/components/CreateBlog";

const CompanyTabPage = () => {
  const [currentTab, setCurrentTab] = useState("tab2"); // Start with Global Branch

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };
  return (
    <section className="w-full">
      {/* Header */}
      <div className=" w-full p-4 md:p-5 2xl:p-5">
        <div className="flex flex-wrap items-center justify-start gap-5">
          <button
            className={`${
              currentTab === "tab2" ? "bg-[#ffb200] text-black" : "bg-white"
            } rounded-lg shadow-lg border-[#ffb200] px-4 py-2 text-sm text-black whitespace-nowrap font-semibold hover:bg[#ffb200]`}
            onClick={() => handleTabChange("tab2")}
          >
            Global Branch
          </button>

       
          <button
            className={`${
              currentTab === "notice" ? "bg-[#FFB200]" : "bg-white"
            } rounded-lg shadow-lg border border-[#ffb200] px-3 py-2 text-sm text-black font-semibold hover:bg-[#ffb200] transition-colors duration-200`}
            onClick={() => handleTabChange("notice")}
          >
            Notice
          </button>
          <button
            className={`${
              currentTab === "tab4" ? "bg-[#ffb200] text-black" : "bg-white"
            } rounded-lg shadow-lg border-[#ffb200] px-4 py-2 text-sm text-black whitespace-nowrap font-semibold hover:bg[#ffb200]`}
            onClick={() => handleTabChange("tab4")}
          >
            Employee
          </button>
          <button
            className={`${
              currentTab === "tab5" ? "bg-[#ffb200] text-black" : "bg-white"
            } rounded-lg shadow-lg border-[#ffb200] px-4 py-2 text-sm text-black whitespace-nowrap font-semibold hover:bg[#ffb200]`}
            onClick={() => handleTabChange("tab5")}
          >
            Blog
          </button>

          <button
            className={`${
              currentTab === "tab6" ? "bg-[#ffb200] text-black" : "bg-white"
            } rounded-lg shadow-lg border-[#ffb200] px-4 py-2 text-sm text-black whitespace-nowrap font-semibold hover:bg[#ffb200]`}
            onClick={() => handleTabChange("tab6")}
          >
            Contact Us
          </button>

          <button
            className={`${
              currentTab === "tab7" ? "bg-[#ffb200] text-black" : "bg-white"
            } rounded-lg shadow-lg border-[#ffb200] px-4 py-2 text-sm text-black font-semibold hover:bg[#ffb200] whitespace-nowrap`}
            onClick={() => handleTabChange("tab7")}
          >
            Company
          </button>

          <button
            className={`${
              currentTab === "tab8" ? "bg-[#ffb200] text-black" : "bg-white"
            } rounded-lg shadow-lg border-[#ffb200] px-4 py-2 text-sm text-black font-semibold hover:bg-[#ffb200] whitespace-nowrap`}
            onClick={() => handleTabChange("tab8")}
          >
            Social media & Payment icon
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-1 min-h-screen">
        {/* {currentTab === "tab1" && <OfficeAddress />} */}
        {currentTab === "tab2" && <CreateGlobalLocations />}
        {currentTab === "notice" && <CreateNotice />}
        {currentTab === "tab4" && <CreateEmployee />}
        {currentTab === "tab5" && <CreateBlog />}
        {currentTab === "tab6" && <ContactUsDropDownTable />}
        {currentTab === "tab7" && <CompanyTab />}
        {currentTab === "tab8" && <SocialSharePayment />}
      </div>
    </section>
  );
};

export default CompanyTabPage;

//change
