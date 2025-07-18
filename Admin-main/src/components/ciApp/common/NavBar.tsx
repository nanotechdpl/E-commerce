"use client";
import Image from "next/image";
import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { FaBell, FaShoppingCart } from "react-icons/fa";
import { GoScreenFull } from "react-icons/go";
import { RxCrossCircled } from "react-icons/rx";
import { TfiReload } from "react-icons/tfi";
import DarkMoodButton from "../../ui/DarkMoodContaxt";
import OrderProduct from "../../ui/Order/page";

const NavBar: React.FC = () => {
  const [showFullPage, setShowFullPage] = useState<boolean>(false); //for dark mood
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] =
    useState<boolean>(false);
  interface Notification {
    id: number;
    title: string;
    content: string;
  }
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New message",
      content: "You have a new message from John",
    },
    { id: 2, title: "Order update", content: "Your order has been shipped" },
    { id: 3, title: "Order update", content: "Your order has been shipped" },
    { id: 4, title: "Order update", content: "Your order has been shipped" },
    { id: 5, title: "Order update", content: "Your order has been shipped" },
    { id: 6, title: "Order update", content: "Your order has been shipped" },
    { id: 7, title: "Order update", content: "Your order has been shipped" },
  ]);
  // const [isDarkMode, setIsDarkMode] = useState<boolean | undefined>(undefined);

  const handleButtonClick = () => {
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

  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode);
  // };
  const Refreshpage = () => {
    window.location.reload();
  };

  const handleNotificationClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsOrderDropdownOpen(false);
  };

  const notificationCount = notifications.length;

  const handleOrderDropdown = () => {
    setIsOrderDropdownOpen(!isOrderDropdownOpen);
    setIsDropdownOpen(false);
  };

  // const handleMode = () => {
  //   setMode(!mode);
  // };

  return (
    <div className="-ml-8 flex flex-row-reverse gap-6 rounded-r-md bg-indigo-950 p-4 ">
      <button className={`text-2xl text-white hover:scale-125`}>
        <CgProfile size={30} />
      </button>
      <div className=" bg-blue cursor-pointer p-2 " onClick={Refreshpage}>
        refresh
      </div>
      <button
        onClick={handleNotificationClick}
        className={`relative  text-2xl text-white hover:scale-125`}
      >
        <FaBell />
        {notificationCount > 0 && (
          <div className="absolute right-[-4px] top-[-8px] rounded-full border border-white bg-rose-500 px-1 py-[1px] text-xs  text-white  ">
            {notificationCount}
          </div>
        )}
      </button>

      <button onClick={handleOrderDropdown} className={`text-2xl text-white `}>
        <FaShoppingCart />
        {notificationCount > 0 && (
          <div className="absolute right-[-4px] top-[-8px] rounded-full border border-white bg-rose-500 px-1 py-[1px] text-xs  text-white  ">
            {notificationCount}
          </div>
        )}
      </button>

      <button className={`text-2xl text-white`} onClick={handleButtonClick}>
        <GoScreenFull />
        {notificationCount > 0 && (
          <div className="absolute right-[-4px] top-[-8px] rounded-full border border-white bg-rose-500 px-1 py-[1px] text-xs  text-white  ">
            {notificationCount}
          </div>
        )}
      </button>
      <button className={`text-2xl text-white`}>
        <DarkMoodButton />
      </button>
      <button className=" cursor-pointer text-white " onClick={Refreshpage}>
        <TfiReload size={30} />
      </button>
      <div className="flex gap-1 rounded-2xl border-2 border-white p-1 outline-none  ">
        <button className={`text-2xl  text-white  hover:scale-125`}>
          <CiSearch />
        </button>
        <input
          type="text"
          className={`w-[350px] border-none bg-indigo-950 pl-2 text-white outline-none hover:border-none `}
          placeholder="Write to Search...."
        />
      </div>

      <div>
        {isDropdownOpen && (
          <div className="dropdown-content  absolute right-20  top-20 z-50 border-2 bg-slate-100  ">
            <header className="w-ful  flex items-center justify-around bg-blue-700 p-2">
              <h2 className="text-nowrap text-lg font-bold  text-white">
                Shopping Card
              </h2>
              <button className=" bg-[#4b4bb6] px-4 py-2 font-bold text-white">
                Items
              </button>
            </header>
            <div className="h-[450px] overflow-scroll ">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <div className="card flex cursor-pointer  gap-2 hover:bg-blue-100">
                    <div className="flex h-14  w-14 items-center justify-center rounded-md p-1">
                      <Image
                        src={
                          "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg"
                        }
                        alt=""
                        width={70}
                        height={70}
                        className="rounded-sm"
                      />
                    </div>
                    <div className="flex w-full items-center justify-between px-2  ">
                      <span>
                        <h2 className="Product-Name">{notification.title}</h2>
                        <span className="gap-2">{notification.content}</span>
                      </span>
                      <span className="cursor-pointer items-end ">
                        <RxCrossCircled size={10} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <footer className="absolute bottom-3 z-50  flex w-full flex-col justify-center gap-4 bg-white   px-6 pt-2 ">
              <div className="flex justify-between px-4 ">
                <h3 className="text-gray-600 text-sm font-bold">Total</h3>
                <p className="text-gray-600 text-sm font-bold">$500.0</p>
              </div>
              <button
                type="button"
                className="w-full rounded-md bg-blue-600  p-2 font-bold text-white"
              >
                Proceed Cheakout
              </button>
            </footer>
          </div>
        )}
      </div>
      <div>
        {isOrderDropdownOpen && (
          <div className="dropdown-content absolute right-28 top-20 z-50 h-96 w-80 rounded-sm border-2 bg-slate-100">
            <div className=" notification-item">
              <OrderProduct />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
