import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaArrowDown } from "react-icons/fa6";
import OrderModal from "./OrderModal";
import { Poppins } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { bindActionCreators } from "@reduxjs/toolkit";
// import { useNavigation } from "next/navigation";
import {
  suspendUser,
  toggleUser,
} from "@/app/(withLayoutC)/c/allUsers/actions";
import OrderMessageModel from "./OrderMessageModel";
import NewAgencyModel from "./NewAgencyModel";
import AgencyMessageModel from "./AgencyMessageModel";
import NewPaymentModel from "./NewPaymentModel";
import NewReturnModel from "./NewReturnModel";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "500"],
});

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short", // Tue
    day: "2-digit", // 07
    month: "long", // June
    year: "numeric", // 2024
    timeZone: "GMT",
  };

  return `${date.toLocaleDateString("en-GB", options)} (GMT)`;
};

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const pathName = usePathname();
  const navigation = useRouter()
  const routeName = pathName.split("/")[pathName.split("/").length - 1];
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const statuses = ["Active", "Suspend", "Block"];


  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSave = () => setIsModalOpen(true);
  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleConfirmSave = () => {
    // Add save logic here
    console.log("Data saved!");
    // selectedStatus === "Suspend"
    //   ? actions.suspendUser(user._id)
    //   : actions.toggleUser(user?._id);
    setIsModalOpen(false);
  };

  const selectStatus = (status: string) => {
    setSelectedStatus(status);
    setIsOpen(false);
  };

  const user: any = useSelector((state: RootState) => state.users?.userById);

  const isUsersAllRoute =
    pathName.includes("/allUsers/") &&
    (pathName.includes("/profile") ||
      pathName.includes("/orders") ||
      pathName.includes("/payments") ||
      pathName.includes("/settings"));
      
  return (
    <header
      style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      className="sticky top-0 z-40 flex w-full bg-[#F8F6F0] "
    >
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm  lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out  ${!props.sidebarOpen && "!w-full delay-300"
                    }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out  ${!props.sidebarOpen && "delay-400 !w-full"
                    }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out  ${!props.sidebarOpen && "!w-full delay-500"
                    }`}
                ></span>
              </span>
            </span>
          </button>
        </div>

        <div
          className={`${isUsersAllRoute ? "flex" : "hidden"
            } flex-row justify-between w-[311px] h-[88px]'`}
        >
          <div className="flex flex-col justify-center">
            <span
              className={`${poppins.className} font-medium text-[24px] leading-[36px] text-[#3E435D]`}
            >
              {capitalizeFirstLetter(routeName)}
            </span>
          </div>
          <div
            className={`${pathName.includes("/profile") ? "flex" : "hidden"
              } flex-col px-4`}
          >
            <span
              className={`${poppins.className} font-medium text-[24px] leading-[36px] text-[#3E435D]`}
            >
              Welcome,
            </span>
            <span
              className={`${poppins.className} font-light text-[16px] leading-[24px] text-[#3E435D]`}
            >
              {user?.email || "John@example.com"}
            </span>
            <span
              className={`${poppins.className} font-light text-[16px] leading-[24px] text-[#3E435D]`}
            >
              {/* {currentDate()} */}
              {formatDate(user?.createdAt)}
            </span>
          </div>
        </div>

        <form
          className={`${(pathName === "/c/allUsers" || pathName === "/c/orders" || pathName === "/c/agency" || pathName === "/c/category" || pathName === '/c/service' || pathName === '/c/footer')
              ? "lg:flex"
              : "hidden"
            } w-full max-w-lg items-center rounded-md bg-white shadow-md`}
        >
          <input
            type="text"
            placeholder={`${pathName.includes("/specificPage1")
                ? "Search the Orders"
                : pathName.includes("/specificPage2")
                  ? "Search the withdraws"
                  : "Placeholder Text"
              }`}
            className="flex-grow rounded-l-md border border-white px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-none"
          />
          <button
            type="submit"
            className="rounded-r-md bg-[#ffb200] px-6 py-3 text-sm font-semibold text-[#231F20] hover:bg-yellow-600"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4"></ul>
        </div>
        <div
          className={` relative ${isUsersAllRoute ? "hidden" : "flex"
            } flex justify-center gap-2 relative `}
        >
          <ul className="flex gap-2 items-center justify-center  ">
            <li>
              <Link href="/" className="block ">
                <Image
                  src="/Rotate.png"
                  alt="Rotate"
                  width={28}
                  height={28}
                  className="w-8 h-8 object-contain "
                />
              </Link>
            </li>
            <div className="block">
              <FullScreen />
            </div>

            {/* Orders Icon */}
            <li>
              <NewOrderModelButton />
            </li>

            {/* Email Icon */}
            <li>
              <OrderMessageModelButton />
            </li>

            {/* Agency Icon */}
            <li>
              <NewAgencyModelButton />

            </li>

            {/* Email Icon (Duplicate) */}
            <li>
              <AgencyMessageModelButton />
            </li>

            {/* Payment Icon */}
            <li>
              <NewPaymentModelButton />

            </li>

            {/* Return Icon */}
            <li>
              <NewReturnModelButton />

            </li>
          </ul>

          {/* <ul className="flex items-center">
            {/* <DarkModeSwitcher /> */}
          {/* <Image src="/switcher.png" alt='Rotate' width={35} height={32} /> 
          </ul> */}
          {/* {isOrderModalOpen && (
            <OrderModal
              isOpen={isOrderModalOpen}
              onClose={closeModal}
              orders={orders}
            />
          )}

          {isSavingsModalOpen && (
            <OrderModal
              isOpen={isOrderModalOpen}
              onClose={closeModal}
              orders={orders}
            />
          )}

          {isWithdrawModalOpen && (
            <OrderModal
              isOpen={isOrderModalOpen}
              onClose={closeModal}
              orders={orders}
            />
          )}

          {isModalOpen && (
            <OrderModal
              isOpen={isOrderModalOpen}
              onClose={closeModal}
              orders={orders}
            />
          )}



          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={closeModal}
            payments={payments}
          /> */}
          {/* // Order Modal button */}



          {/* // Withdraw Modal button */}
          {/* <button onClick={() => openModal("Withdraw")}>

            <img width={35} height={30} src={"/icons/withdraw.svg"} alt="Withdraw Icon" className="bg-gray-500" />
          </button>
          <WithdrawModal isOpen={isWithdrawModalOpen} onClose={closeModal} withdrawals={withdrawals} /> */}
        </div>
        <div className={`${isUsersAllRoute ? "flex" : "hidden"} `}>
          <div className="relative inline-block">
            {/* Dropdown Button */}
            <div
              onClick={toggleDropdown}
              className="flex flex-row justify-around items-center min-w-25 h-[45px] border-[1.5px] border-[#FFB200] rounded-lg mr-4 cursor-pointer"
            >
              <span className="font-inter font-normal text-base text-[#000000]">
                {selectedStatus}
              </span>
              <span>
                <FaArrowDown />
              </span>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute mt-2 min-w-25 bg-white border border-[#FFB200] rounded-lg shadow-lg z-10">
                {statuses.map((status) => (
                  <div
                    key={status}
                    onClick={() => selectStatus(status)}
                    className="px-4 py-2 text-[#000000] font-inter font-normal text-base hover:bg-[#FFB200] hover:text-white cursor-pointer"
                  >
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            onClick={handleSave}
            className={
              "flex flex-row justify-around items-center w-21 h-[45px] border-[1.5px] bg-[#FFB200] rounded-lg mr-4 cursor-pointer"
            }
          >
            <span className="font-inter font-normal text-base text-[#000000]">
              Save
            </span>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 bg-opacity-50 flex items-center justify-center ">
              <div className="flex flex-col justify-center bg-white p-6 rounded-[10px] border border-[#C3C3C3] shadow-lg w-[473px] h-[386px]">
                <div className="flex flex-col justify-center items-center w-12 h-12 bg-[#FFFFFF] border border-[#D9D9D9] rounded-full self-center mb-4">
                  <Image
                    src={"/icons/warning.png"}
                    alt={"warning"}
                    width={24}
                    height={24}
                  />
                </div>
                <h2 className="font-inter text-[24px] leading-[24px] text-[#0C0B0B] font-medium text-center mb-4">
                  Change Status
                </h2>
                <p className="font-inter font-normal text-[16px] leading-[22.24px] text-[#6B6B6B] text-center mb-6">
                  You proceed to change <br />
                  the status
                  <br /> {"Click no if you don't want to"}
                </p>
                <div className="flex flex-row justify-evenly">
                  <button
                    onClick={handleCancel}
                    className="w-[169px] h-[56px] px-4 py-2 border border-[#FFB200] text-[#FFB200] bg-white rounded-lg"
                  >
                    No
                  </button>
                  <button
                    onClick={handleConfirmSave}
                    className="w-[169px] h-[56px] px-4 py-2 bg-[#FFB200] text-black rounded-lg"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
          <div onClick={() => navigation.back()} className="flex cursor-pointer flex-row justify-center items-center">
            <Image
              src={"/icons/close.png"}
              width={21.5}
              height={21.5}
              alt="close-icon"
            />
          </div>
        </div>
      </div>
    </header>
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
        className="bg-slate relative flex  width={20}
                height={18} items-center justify-center rounded-full border-[0.5px] border-stroke hover:text-primary "
      >
        <Image
          src="/fullscreen.png"
          alt="Rotate"
          width={24}
          height={32}
        // className={""}
        />
      </span>
    </li>
  );
};

const NewOrderModelButton = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const ordersData = useSelector((root: RootState) => root.dashboard.orders);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button ref={buttonRef} className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <Image
          src="/orders.png"
          alt="orders"
          width={19}
          height={18}
          className="w-8 h-8 object-contain "
        />
      </button>

      {isOpen && (
        <div ref={modalRef}>
          <OrderModal isOpen={isOpen} onClose={() => setIsOpen(false)} orders={ordersData} />
        </div>
      )}
    </div>
  );
};
const OrderMessageModelButton = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const ordersData = useSelector((root: RootState) => root.dashboard.orders);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button ref={buttonRef} className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <Image
          src="/email.png"
          alt="email"
          width={24}
          height={26}
          className="w-8 h-8 object-contain "
        />
      </button>

      {isOpen && (
        <div ref={modalRef}>
          <OrderMessageModel isOpen={isOpen} onClose={() => setIsOpen(false)} orders={ordersData} />
        </div>
      )}
    </div>
  );
};
const NewAgencyModelButton = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const agencyData = useSelector((root: RootState) => root.dashboard.agencies);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button ref={buttonRef} className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <Image
          src="/agency.png"
          alt="agency"
          width={24}
          height={18}
          className="w-8 h-8 object-contain "
        />
      </button>

      {isOpen && (
        <div ref={modalRef}>
          <NewAgencyModel isOpen={isOpen} onClose={() => setIsOpen(false)} agencies={agencyData} />
        </div>
      )}
    </div>
  );
};

const AgencyMessageModelButton = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const agencyData = useSelector((root: RootState) => root.dashboard?.agencies);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button ref={buttonRef} className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <Image
          src="/email.png"
          alt="email"
          width={24}
          height={26}
          className="w-8 h-8 object-contain "
        />
      </button>

      {isOpen && agencyData && (
        <div ref={modalRef}>
          <AgencyMessageModel
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            agencies={agencyData}
          />
        </div>
      )}
    </div>
  );
};
const NewPaymentModelButton = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const paymentData = useSelector((root: RootState) => root.dashboard.payments);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button ref={buttonRef} className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <Image
          src="/payment.png"
          alt="payment"
          width={20}
          height={18}
          className="w-8 h-8 object-contain "
        />
      </button>

      {isOpen && (
        <div ref={modalRef}>

          <NewPaymentModel
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            payments={paymentData}
          />

        </div>
      )}
    </div>
  );
};
const NewReturnModelButton = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const returnData = useSelector((root: RootState) => root.dashboard.returns);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button ref={buttonRef} className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <Image
          src="/return.png"
          alt="return"
          width={20}
          height={18}
          className="w-8 h-8 object-contain "
        />
      </button>

      {isOpen && (
        <div ref={modalRef}>
          <NewReturnModel isOpen={isOpen} onClose={() => setIsOpen(false)} returns={returnData} />
        </div>
      )}
    </div>
  );
};



export default Header;


