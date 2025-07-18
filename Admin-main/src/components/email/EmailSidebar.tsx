"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { AiOutlineDelete, AiOutlineStar } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import { LuPen } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const router = useRouter();

  const menuItems = [
    { id: "Inbox", label: "Inbox", icon: <FaRegComment />, path: "/c/email" },
    { id: "Sent", label: "Sent", icon: <MdOutlineEmail />, path: "/c/sent" },
    { id: "Drafts", label: "Drafts", icon: <LuPen />, path: "/c/drafts" },
    {
      id: "Deleted",
      label: "Deleted",
      icon: <AiOutlineDelete />,
      path: "/c/deleted",
    },
    {
      id: "Marked",
      label: "Marked",
      icon: <AiOutlineStar />,
      path: "/c/marked",
    },
  ];

  return (
    <div className="w-64 bg-slate-100 shadow-md h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-center text-center p-5 font-bold items-center gap-3 mb-4">
        Mailboxes
      </div>

      {/* Divider */}
      <div className="h-[2px] bg-[#ccc] mx-4 mb-6"></div>

      {/* Add Message Button */}
      <div className="flex justify-center mb-6">
        <button
          className="bg-[#ffb200] text-black px-4 py-2 rounded-[15px] text-sm hover:bg-[#e0a000]"
          // onClick={() =>
          // alert("Add message functionality not implemented yet!")} // Temporary
        >
          Add Message
        </button>
      </div>

      {/* Menu Items */}
      <ul className="flex-1 py-4">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`flex items-center gap-3 px-6 py-3 cursor-pointer ${
              activeTab === item.id
                ? "bg-gray-100 text-[#ffb200]"
                : "hover:text-[#ffb200]"
            }`}
            onClick={() => {
              setActiveTab(item.id);
              router.push(item.path);
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
