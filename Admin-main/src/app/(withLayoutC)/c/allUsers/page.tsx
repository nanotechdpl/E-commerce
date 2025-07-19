"use client";

import React, { useEffect, useMemo, useState } from "react";
import Card from "../../../../components/Card/Card";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

import Loader from "@/components/common/Loader";
import ActionBar from "./_components/ActionBar";
import UsersTable from "./_components/UsersTable";
import { getAllAdminUsers, getUserAnalytics } from "./actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { bindActionCreators } from "@reduxjs/toolkit";
import { IUser } from "@/types/user";

interface UserAnalytics {
  totaluser: any[];
  totalusers: number;
  totalactiveusers: number;
  totalblockusers: number;
}

const AllUsers: React.FC = () => {
  const users = useSelector((state: RootState) => state.users?.users);
  const userAnalytics = useSelector<RootState, UserAnalytics | undefined>(
    (state: RootState) => state.users?.userAnalytics as UserAnalytics
  );
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  
  const dispatch = useDispatch();

  const actions = useMemo(
    () => bindActionCreators({ getAllAdminUsers, getUserAnalytics }, dispatch),
    [dispatch]
  );

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const cardData = userAnalytics
    ? [
        {
          title: "Total Active User",
          value: userAnalytics?.totalactiveusers || 0,
        },
        {
          title: "Total Suspend User",
          value: userAnalytics?.totalusers - (userAnalytics?.totalactiveusers || 0) || 0,
        },
        {
          title: "Total Block User",
          value: userAnalytics?.totalblockusers || 0,
        },
        {
          title: "Total Dormant User",
          value: 0,
        },
        {
          title: "Total Closed User",
          value: 0,
        },
      ]
    : [];

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };

  const onTableChange = (pagination: any, filter: any, sorter: any) => {
    const { order, field } = sorter;
    setSortBy(field as string);
    setSortOrder(order === "ascend" ? "asc" : "desc");
  };

  const onSearch = (value: string) => {
    console.log(value);
  };

  useEffect(() => {
    actions?.getAllAdminUsers();
    actions?.getUserAnalytics();
  }, [actions]);

  return (
    <div className="w-full p-2 md:py-5 2xl:p-10">
      {/* <Breadcrumb pageName="All Users"/> */}
      {loading ? (
        // Show the loading image or spinner
        <Loader />
      ) : (
        <>
          <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2  gap-2 mb-3 ">
            {cardData.map((card, i) => (
              <Card key={i} title={card.title} value={card.value} />
            ))}
          </div>

          <div className="w-full  py-4">
            {/* <CustomSearch onSearch={onSearch} /> */}
            <ActionBar />
          </div>
          <UsersTable users={users?users:[]} />

          <div className="flex flex-row justify-center w-full mt-6">
            <div className="flex flex-col justify-between items-center bg-transparent">
              <span className="text-black font-bold">
                Showing 1 to 5 of 50 Results
              </span>
              <div className="w-50 p-1 mt-4 cursor-pointer border bg-[#FFB200] rounded-[10px] flex flex-row justify-center items-center">
                <span>More Results</span>
                <select name="" id="" className="ml-4">
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                  <option value="96">96</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllUsers;
