

"use client";

import CreateArchitecture from "@/components/ui/MergedComponents/CreateArchitecture";
import CreateBlog from "@/components/ui/MergedComponents/CreateBlog";

import CreateNotice from "@/components/ui/MergedComponents/CreateNotice";
import CreateOrder from "@/components/ui/MergedComponents/CreateOrder";
import CreateService from "@/components/ui/MergedComponents/CreateService";
import CreateTemplate from "@/components/ui/MergedComponents/CreateTemplate";
import CreateEmployee from "@/modules/footer/components/CreateEmployee";

import React, { useState } from "react";

const Category: React.FC = () => {
  
  const [currentTab, setCurrentTab] = useState<string>("tab1");

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  const [isOpen, setIsOpen] = useState({
    bannerOpen: true,
    paymentOpen: false,
    socialMedia: false,
    companyProfile: false,
    globalLocations: false,
    templates: false,
    orders: false,
    logo: false,
  });

  
  return (
    <section className="w-full p-4 md:p-6 2xl:p-10">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          className={`${"tab1"} ${
            currentTab === "tab1" ? "activeTab" : ""
          }  rounded border-2 bg-blue-600 px-3 py-2 text-white hover:bg-blue-400 active:border-white  active:bg-blue-400 `}
          onClick={() => handleTabChange("tab1")}
        >
          Create Template
        </button>


        <button
          className={`${"tab2"} ${
            currentTab === "tab2" ? "activeTab" : ""
          }  rounded border-2 bg-blue-600 px-3 py-2 text-white hover:bg-blue-400 active:border-white  active:bg-blue-400 `}
          onClick={() => handleTabChange("tab2")}
        >
          Create Architecture
        </button>
        <button
          className={`${"tab3"} ${
            currentTab === "tab3" ? "activeTab" : ""
          }  active:bg rounded border-2 bg-blue-600 px-3 py-2 text-white hover:bg-blue-400 active:border-white  active:bg-blue-400 `}
          onClick={() => handleTabChange("tab3")}
        >
          Create Service
        </button>
        <button
          className={`${"tab4"} ${
            currentTab === "tab4" ? "activeTab" : ""
          }  rounded border-2 bg-blue-600 px-3 py-2 text-white hover:bg-blue-400 active:border-white  active:bg-blue-400 `}
          onClick={() => handleTabChange("tab4")}
        >
          Create Notice
        </button>
        <button
          className={`${"tab5"} ${
            currentTab === "tab5" ? "activeTab" : ""
          }  rounded border-2 bg-blue-600 px-3 py-2 text-white hover:bg-blue-400 active:border-white  active:bg-blue-400 `}
          onClick={() => handleTabChange("tab5")}
        >
          Create Order
        </button>
        <button
          className={`${"tab6"} ${
            currentTab === "tab6" ? "activeTab" : ""
          }  rounded border-2 bg-blue-600 px-3 py-2 text-white hover:bg-blue-400 active:border-white  active:bg-blue-400 `}
          onClick={() => handleTabChange("tab6")}
        >
          Create Employee
        </button>
        <button
          className={`${"tab7"} ${
            currentTab === "tab7" ? "activeTab" : ""
          }  rounded border-2 bg-blue-600 px-3 py-2 text-white hover:bg-blue-400 active:border-white  active:bg-blue-400 `}
          onClick={() => handleTabChange("tab7")}
        >
          Create Blog
        </button>
        
      </div>
      <div className="min-h-screen">
        {/* Buttons Contant */}
        {currentTab === "tab1" && (
          <div>
            {" "}
            <CreateTemplate />{" "}
          </div>
        )}
        {/* {currentTab === "createFeatured" && (
          <div>
            {" "}
            <CreateFeatured />{" "}
          </div>
        )} */}
        {currentTab === "tab2" && (
          <div>
            <CreateArchitecture />
          </div>
        )}
        {/* {currentTab === "createArchitecture" && (
          <div>
            <CreateArchitecture />
          </div>
        )} */}
        {currentTab === "tab3" && (
          <div>
            <CreateService />
          </div>
        )}
        {currentTab === "tab4" && (
          <div>
            <CreateNotice/>
          </div>
        )}
        {currentTab === "tab5" && (
          <div>
            <CreateOrder />
          </div>
        )}
        {currentTab === "tab6" && (
          <div>
            <CreateEmployee />
          </div>
        )}
        {currentTab === "tab7" && (
          <div>
            <CreateBlog />
          </div>
        )}
        

        
      </div>
    </section>
  );
};

export default Category;
