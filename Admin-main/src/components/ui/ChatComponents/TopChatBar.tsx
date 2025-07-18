"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaCog } from "react-icons/fa";
import Link from "next/link";
interface ChatBarProps {
  item: any;
  onClick: (value: number) => void;
  index: number;
}
const TopChatBar: React.FC<ChatBarProps> = ({ item, onClick, index }) => {
  const [settingIcon, setSettingIcon] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
      // Clicked outside the box
      setShowSetting(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      onMouseEnter={() => setSettingIcon(true)}
      onMouseLeave={() => setSettingIcon(false)}
      className="relative m-1 cursor-pointer items-center rounded-lg bg-neutral-100  px-5 pb-1 pt-1 "
      onClick={() => onClick(index)}
    >
      <div className="relative h-10 w-10 rounded-[50%]">
        <Image src={item.img} alt="" fill className="rounded-[50%]" />
      </div>
      <div className="absolute right-6 top-9 z-999 h-2 w-2 rounded-[50%] bg-emerald-400"></div>

      <div className="text-center">
        <h1 className="text-center">{item.name}</h1>
        {/* <h1 className="text-gray-500 text-[14px]">{item.lastMesg}</h1> */}
      </div>
      <div className="absolute right-0 top-[25%]">
        {/* <h3 className=" text-[12px]">{item.day}</h3> */}
        <button
          className={` ml-1 mt-2 text-[14px] ${
            showSetting || settingIcon ? "block" : "hidden"
          }`}
          onClick={() => setShowSetting(!showSetting)}
        >
          <FaCog />
        </button>

        <div
          ref={boxRef}
          className={`border-gray-50 absolute right-0 z-10 w-40 flex-col items-start rounded-md border border-solid text-left shadow ${
            showSetting ? "flex" : "hidden"
          } bg-white`}
        >
          <Link
            href=""
            className="border-gray-300 w-[100%] border-b  border-solid p-4 text-[14px]"
          >
            Mute
          </Link>
          <Link href="" className="block w-[100%] pl-4 pt-4 text-[14px] ">
            Archive
          </Link>
          <Link
            href=""
            className="border-gray-300 text-red-400 w-[100%] border-b border-solid p-4 text-[14px]"
          >
            Delete
          </Link>
          <Link href="" className="w-[100%] pl-4 pt-2 text-[14px] ">
            Mark as Read
          </Link>
          <Link href="" className="w-[100%] pl-4 pt-2 text-[14px] ">
            Somethings Wrong
          </Link>
          <Link href="" className="w-[100%] pl-4 pt-2 text-[14px] ">
            Ignore Messages
          </Link>
          <Link href="" className="w-[100%] pb-4 pl-4 pt-2 text-[14px] ">
            Block Messages
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopChatBar;
