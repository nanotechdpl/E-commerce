import React, { useState } from "react";
import { BsCashCoin } from "react-icons/bs";
import { CgMail } from "react-icons/cg";
import { IoMdCart } from "react-icons/io";
import { MdFullscreen } from "react-icons/md";
import { SlRefresh } from "react-icons/sl";

export const Refresh = () => {
  const Refreshpage = () => {
    window.location.reload();
  };
  return (
    <li className="relative cursor-pointer">
      <span
        onClick={Refreshpage}
        className="bg-slate relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke hover:text-primary   "
      >
        <SlRefresh />
      </span>
    </li>
  );
};

export const FullScreen = () => {
  const [showFullPage, setShowFullPage] = useState(false);
  const handleFullScreen = () => {
    if (showFullPage) {
      document.exitFullscreen();
    } else {
      const rootElement = document.documentElement;
      if (rootElement.requestFullscreen) {
        rootElement.requestFullscreen();
      }
    }

    setShowFullPage(!showFullPage);
  };
  return (
    <li className="relative cursor-pointer">
      <span
        onClick={handleFullScreen}
        className="bg-slate relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke hover:text-primary   "
      >
        <MdFullscreen />
      </span>
    </li>
  );
};

export const GmailIcon = () => {
  return (
    <li className="relative cursor-pointer">
      <span className="bg-slate relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke hover:text-primary   ">
        <CgMail />
      </span>
    </li>
  );
};

export const Cart = () => {
  return (
    <li className="relative cursor-pointer">
      <span className="bg-slate relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke hover:text-primary   ">
        <IoMdCart />
      </span>
    </li>
  );
};

export const Cash = () => {
  return (
    <li className="relative cursor-pointer">
      <span className="bg-slate relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke hover:text-primary   ">
        <BsCashCoin />
      </span>
    </li>
  );
};
