"use client";
import { bindActionCreators } from "@reduxjs/toolkit";
import { use, useEffect, useMemo } from "react";
import { FaInstagramSquare, FaTwitter } from "react-icons/fa";
import { SiFacebook, SiYoutube } from "react-icons/si";
import { getSingleUser } from "../../actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { NextPage } from "next";

const icons = [
  <SiFacebook
    key={"1"}
    width={25}
    height={24.85}
    color="#172554"
    className="self-center"
  />,
  <SiYoutube
    key={"2"}
    width={25}
    height={24.85}
    color="#172554"
    className="self-center"
  />,
  <FaTwitter
    key={"3"}
    width={25}
    height={24.85}
    color="#172554"
    className="self-center"
  />,
  <FaInstagramSquare
    key={"4"}
    width={25}
    height={24.85}
    color="#172554"
    className="self-center"
  />,
];

type PagePropsTypes = {
  params: Promise<{ userId: string }>;
};

export const Page: NextPage<PagePropsTypes> = (props) => {
  const user: any = useSelector((state: RootState) => state.users?.userById);

  const dispatch = useDispatch();
  const { params } = props;
  const { userId } = use(params);
  // const userId = params?.userId;
  const actions = useMemo(
    () => bindActionCreators({ getSingleUser }, dispatch),
    [dispatch]
  );

  useEffect(() => {
    actions.getSingleUser(userId);
  }, [actions,userId]);

  return (
    <div className="w-full h-[calc(h-screen - 76px)] mt-[76px] container mx-auto">
      <div className="relative w-[929px] h-[423.58px] mx-auto bg-white border-[#D9D9D9] border-[0.52px] rounded-[15.69px]">
        {/* Icons Container */}
        <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 flex flex-col gap-5">
          
          {icons.map((icon, index) => (
            <div
              key={icon.key}
              className="w-[40px] h-[40px] rounded-full bg-white border-[#172554] border-[0.52px] flex justify-center items-center shadow"
            >
              {icon}
            </div>
          ))}
        </div>

        {/* Card Content */}
        <div className="flex flex-col">
          <div className="flex flex-row justify-center mt-7">
            <span className="font-inter font-medium text-[33.47px] leading-[33.47px] text-center text-[#131212]">
              Personal Information
            </span>
          </div>
          <div className="flex flex-row justify-around">
            <div className="flex flex-col items-start gap-y-4 mt-10">
              <span className="font-inter font-medium text-[29px] leading-[29px] text-[#373535] text-left">
                Name
              </span>
              <span className="font-inter font-medium text-[29px] leading-[29px] text-[#373535] text-left">
                Phone No
              </span>
              <span className="font-inter font-medium text-[29px] leading-[29px] text-[#373535] text-left">
                Email
              </span>
              <span className="font-inter font-medium text-[29px] leading-[29px] text-[#373535] text-left">
                Currency
              </span>
              <span className="font-inter font-medium text-[29px] leading-[29px] text-[#373535] text-left">
                Company Name
              </span>
            </div>
            <div className="flex flex-col items-start gap-y-4 mt-10">
              <span className="font-inter font-medium text-[29px] leading-[29px] text-[#373535] text-left">
                {user?.name || "N/A"}
              </span>
              <span className="font-inter font-medium text-[29px] leading-[29px] text-[#373535] text-left">
                {user?.phone || "N/A"}
              </span>
              <span className="font-inter font-medium text-[29px] leading-[29px] text-[#373535] text-left">
                {user?.email || "N/A"}
              </span>
              <span className="font-inter font-medium text-[29px] leading-[29px] text-[#373535] text-left">
                {user?.currency || "N/A"}
              </span>
              <span className="font-inter font-medium text-[29px] leading-[29px] text-[#373535] text-left">
                {user?.nationality || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
