"use client";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/common/Loader";
import { Poppins } from "next/font/google";
import AgencyCard from "./_components/AgencyCard";
import AgencyTable from "./_components/AgencyTable";
import Date from "./_components/Date";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyAnalytics, getAllAgencies } from "./actions";
import { RootState } from "@/redux/store/store";
import { agencies } from "@/constants/agency";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const AllUsers = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const agencies: any = useSelector((state: RootState) => state.agency.agenies);
  const agencyAnalytics: any = useSelector(
    (state: RootState) => state.agency?.agencyAnalytics
  );
  console.log(agencies);
  const actions = useMemo(
    () => bindActionCreators({ getAllAgencies, getAgencyAnalytics }, dispatch),
    [dispatch]
  );

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const statusColors: { [key: string]: string } = {
    Block: "bg-[#921313]",
    Active: "bg-[#00850D]",
    Suspend: "bg-[#00C0CC]",
  };

  useEffect(() => {
    actions?.getAllAgencies();
    actions?.getAgencyAnalytics();
  }, [actions]);

  console.log("first All Analytics::", agencyAnalytics);

  const cardData = agencyAnalytics
    ? [
        { title: "Total Agents", value: agencyAnalytics?.totalAgencies },
        {
          title: "Total InActive User",
          value: agencyAnalytics?.totalSuspendUsers,
        },
        {
          title: "Total Active User",
          value: agencyAnalytics?.totalactiveusers,
        },
        {
          title: "Total Disolved Agents",
          value: agencyAnalytics.totalblockusers,
        },
        {
          title: "Total Dormant Agents",
          value: agencyAnalytics?.totalPendingDelete,
        },
        {
          title: "Total Closed Agents",
          value: agencyAnalytics?.totalPendingDelete,
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

  return (
    <div className="w-full p-4  2xl:p-10">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="rounded-xl py-5 ">
            <AgencyCard cardData={cardData} />
          </div>
          <Date onStartDate={undefined} onEndDate={undefined} />

          <div className="rounded-t-lg overflow-x-auto mt-6">
            {/* <AgencyTable agencies={agencies && agencies} poppins={poppins} /> */}
            <AgencyTable agencies={agencies} poppins={poppins} />
          </div>

          {error && <p className="text-red-600">Error: {error}</p>}
          <div className="flex flex-col w-full items-center justify-center my-7 gap-5">
            <p className="font-inter font-semibold text-base leading-[19.36px] text-black-4">
              Showing 1 to 5 of 97 results
            </p>
            <div className="rounded-[10px] border-[0.89px] border-white bg-[#FFB200] text-[#231F20] font-inter font-semibold text-[13px] leading-[15.73px] py-2 px-4">
              <span>More Results</span>
              <select name="" id="" className="ml-4">
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
                <option value="96">96</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllUsers;
