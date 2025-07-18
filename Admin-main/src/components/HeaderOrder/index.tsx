"use client";
import { OrderData } from "@/types/orderData";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import { CgCloseR } from "react-icons/cg";
import { FaArrowDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useOrder } from "../../app/order/[orderId]/orderContext";
import { useRouter } from "next/navigation";












const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

function HeaderOrder() { 
  const navigation = useRouter();
  const [modalType, setModalType] = useState("");
  const [selectedAccessType, selectAccessType] = useState("Access Type");
  const [selectedStatus, setStatus] = useState("Status");
  const [isOpenAccess, setIsOpenAccess] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const toggleAccessDropdown = () => setIsOpenAccess(!isOpenAccess);
  const toggleStatusDropdown = () => setIsOpenStatus(!isOpenStatus);
  const {
    orderData: order,
    loading,
    error,
  } = useOrder() as { orderData: OrderData; loading: boolean; error: any };

  const accessTypes = ["Everyone", "Only me"];
  const statuses = [
    "pending",
    "payment",
    "waiting",
    "working",
    "complete",
    "delivery",
    "cancel",
  ];

  return (
    <>
      <header
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        className="sticky top-0 z-999 flex w-full min-h-[90px] bg-[#F8F6F0] "
      >
        <div className="flex flex-row w-full justify-between items-center">
          <div className="flex flex-col">
            <div className="flex flex-row w-full justify-evenly">
              <button
                onClick={() => {
                  setModalType("info");
                }}
                className="w-24 h-12 bg-white border border-[#000000] rounded-[10px] font-inter font-semibold text-[16px] leading-[19.36px] text-black ml-4"
              >
                Info
              </button>
              <button
                onClick={() => {
                  setModalType("delete");
                }}
                className="w-32 h-12 bg-[#FF3D00] rounded-[10px] font-inter font-normal text-[14px] leading-[16.94px] text-white mx-4"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setModalType("transaction");
                }}
                className="w-32 h-12 bg-[#D9D9D9] border border-[#000000] rounded-[10px] font-inter font-medium text-[14px] leading-[16.94px] text-black"
              >
                Transaction List
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex flex-row justify-center w-full">
              <span className="font-inter font-semibold text-[24px] leading-[29.05px] text-black">
                {order?.status} Page
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center items-end">
            <div className="flex flex-row justify-end w-full">
              <div className="relative inline-block">
                {/* Dropdown Button */}
                <button
                  onClick={toggleAccessDropdown}
                  className="flex justify-evenly items-center w-[150px] h-12 bg-[#FFB200] rounded-lg mr-4 cursor-pointer font-inter font-semibold text-[18px] leading-[29.05px] text-center text-black"
                >
                  {selectedAccessType}
                  <FaArrowDown />
                </button>

                {/* Dropdown Menu */}
                {isOpenAccess && (
                  <div className="absolute mt-2 w-[150px] bg-white border border-[#FFB200] rounded-lg shadow-lg z-10">
                    {accessTypes.map((accessType) => (
                      <div
                        key={accessType}
                        onClick={() => selectAccessType(accessType)}
                        className="px-4 py-2 text-[#000000] font-inter font-normal text-base hover:bg-[#FFB200] hover:text-white cursor-pointer"
                      >
                        {accessType}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* <button>Access Type</button> */}
              <div className="relative inline-block">
                {/* Dropdown Button */}
                <button
                  onClick={toggleStatusDropdown}
                  className="flex justify-evenly items-center w-[150px] h-12 bg-[white] border-[2px] border-[#000000] rounded-lg mr-4 cursor-pointer font-inter font-semibold text-[18px] leading-[29.05px] text-center text-black"
                >
                  {selectedStatus}
                  <FaArrowDown />
                </button>

                {/* Dropdown Menu */}
                {isOpenStatus && (
                  <div className="absolute mt-2 w-[150px] bg-white border border-[#FFB200] rounded-lg shadow-lg z-10">
                    {statuses.map((status) => (
                      <div
                        key={status}
                        onClick={() => setStatus(status)}
                        className="px-4 py-2 text-[#000000] font-inter font-normal text-base hover:bg-[#FFB200] hover:text-white cursor-pointer"
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setModalType("save")}
                className={`w-24 h-12 bg-[#009933] rounded-lg text-white ${poppins.className} font-normal text-[16px] leading-[24.8px] mr-8`}
              >
                Save
              </button>
              <CgCloseR
                className="self-center cursor-pointer mr-4"
                color="#231F20"
                onClick={() => {setModalType("");navigation.back()}}
              />
            </div>
          </div>
        </div>
      </header>
      {modalType === "info" && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg  max-w-lg mx-auto overflow-hidden relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
          >
            <div className="flex w-full flex-row justify-between">
              <p className="text-[#000] my-4 text-xl font-bold text-left">
                Changing status
              </p>
              <CgCloseR
                className="self-center cursor-pointer"
                color="#231F20"
                onClick={() => {setModalType("");navigation.back()}}
              />
            </div>

            <table className="table-auto w-full text-sm text-[#000]">
              <thead>
                <tr>
                  <th className="border px-4 whitespace-nowrap">Admin Name</th>
                  <th className="border px-4 whitespace-nowrap">Date</th>
                  <th className="border px-4 whitespace-nowrap">From</th>
                  <th className="border px-4 whitespace-nowrap">To</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/default-avatar.png"
                        alt="jack"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span>jack</span>
                    </div>
                  </td>
                  <td className="border px-4 whitespace-nowrap">
                    02-02-2024 <span className="text-xs ml-1">02:00 AM</span>
                  </td>
                  <td className="border px-4 whitespace-nowrap">Pending</td>
                  <td className="border px-4 whitespace-nowrap">Cancel</td>
                </tr>
                <tr>
                  <td className="border px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/default-avatar.png"
                        alt="jack"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span>jack</span>
                    </div>
                  </td>
                  <td className="border px-4 whitespace-nowrap">
                    03-02-2024 <span className="text-xs ml-1">02:00 AM</span>
                  </td>
                  <td className="border px-4 whitespace-nowrap">Payment</td>
                  <td className="border px-4 whitespace-nowrap">Working</td>
                </tr>
                <tr>
                  <td className="border px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/default-avatar.png"
                        alt="jack"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span>jack</span>
                    </div>
                  </td>
                  <td className="border px-4 whitespace-nowrap">
                    08-02-2024 <span className="text-xs ml-1">02:00 AM</span>
                  </td>
                  <td className="border px-4 whitespace-nowrap">Pending</td>
                  <td className="border px-4 whitespace-nowrap">Cancel</td>
                </tr>
                <tr>
                  <td className="border px-4 whitespace-nowrap">Auto</td>
                  <td className="border px-4 whitespace-nowrap">
                    02-02-2024 <span className="text-xs ml-1">02:00 AM</span>
                  </td>
                  <td className="border px-4 whitespace-nowrap">Payment</td>
                  <td className="border px-4 whitespace-nowrap">Working</td>
                </tr>
                <tr>
                  <td className="border px-4 whitespace-nowrap">Auto</td>
                  <td className="border px-4 whitespace-nowrap">
                    03-02-2024 <span className="text-xs ml-1">02:00 AM</span>
                  </td>
                  <td className="border px-4 whitespace-nowrap">Payment</td>
                  <td className="border px-4 whitespace-nowrap">Delivery</td>
                </tr>
                <tr>
                  <td className="border px-4 whitespace-nowrap">Auto</td>
                  <td className="border px-4 whitespace-nowrap">
                    03-02-2024 <span className="text-xs ml-1">02:00 AM</span>
                  </td>
                  <td className="border px-4 whitespace-nowrap">Payment</td>
                  <td className="border px-4 whitespace-nowrap">Delivery</td>
                </tr>
                <tr>
                  <td className="border px-4 whitespace-nowrap">Auto</td>
                  <td className="border px-4 whitespace-nowrap">
                    03-02-2024 <span className="text-xs ml-1">02:00 AM</span>
                  </td>
                  <td className="border px-4 whitespace-nowrap">Payment</td>
                  <td className="border px-4 whitespace-nowrap">Delivery</td>
                </tr>
                <tr>
                  <td className="border px-4 whitespace-nowrap">Auto</td>
                  <td className="border px-4 whitespace-nowrap">
                    03-02-2024 <span className="text-xs ml-1">02:00 AM</span>
                  </td>
                  <td className="border px-4 whitespace-nowrap">Payment</td>
                  <td className="border px-4 whitespace-nowrap">Delivery</td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {modalType === "delete" && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div
            className="w-[436px] h-[302px] bg-white p-10 rounded-lg shadow-lg  max-w-lg mx-auto overflow-hidden relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
          >
            <div>
              <div className="flex justify-center items-center mb-4">
                <span className="text-4xl">
                  <Image
                    src="/images/warn.png"
                    alt="warn"
                    width={60}
                    height={60}
                  />
                </span>
              </div>
              <h2 className="text-2xl font-bold text-center text-[#000] py-2">
                Confirmation
              </h2>
              <div className="flex justify-center">
                <p>Do you want to delete the order?</p>
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="w-[172px] h-14 bg-[#FFFFFF] font-semibold text-[#000] border-2 border-[#FFB200] px-12 py-2 rounded"
                  onClick={() => setModalType("")}
                >
                  No
                </button>
                <button
                  className="w-[172px] h-14 bg-[#FF3D00] font-semibold text-white px-12 py-2 rounded"
                  onClick={() => setModalType("")}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {modalType === "save" && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div
            className="w-[436px] h-[386px] bg-white p-10 rounded-lg shadow-lg  max-w-lg mx-auto overflow-hidden relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
          >
            <div className="mt-2">
              <div className="flex justify-center items-center mb-4">
                <span className="text-4xl">
                  <Image
                    src="/images/warn.png"
                    alt="warn"
                    width={60}
                    height={60}
                  />
                </span>
              </div>
              <h2 className="text-2xl font-bold text-center text-[#000] my-3">
                Change Status
              </h2>
              <div className="flex justify-center">
                <p className="text-center">
                  You proceed to change the
                  <br /> status
                  <br /> {"Click no if you don't want to"}
                </p>
              </div>
              <div className="mt-5 flex justify-center space-x-4">
                <button
                  className="w-[172px] h-14 bg-[#0000003B] font-semibold text-[#000] border-2 border-[#FFB200] px-12 py-2 rounded"
                  onClick={() => setModalType("")}
                >
                  No
                </button>
                <button
                  className="w-[172px] h-14 bg-[#009933] font-semibold text-white px-12 py-2 rounded-[5px]"
                  onClick={() => setModalType("")}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {modalType === "transaction" && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div
            className="w-[512px] h-[402px] bg-white p-10 rounded-lg shadow-lg  max-w-lg mx-auto overflow-hidden relative"
            // onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
          >
            <section className="rounded-xl py-5 px-3 w-full">
              <header className="flex flex-row justify-center items-center mt-3">
                <div>
                  <input
                    type="search"
                    placeholder="Search here..."
                    className="py-3 border rounded-lg shadow-xl px-2 mr-1 focus:outline-none focus:border-[#FFB200] min-w-[280px]"
                  />
                  <button className="py-3 px-3 bg-[#FFB200] font-semibold rounded-lg">
                    Search
                  </button>
                </div>
              </header>

              <table className="w-full text-sm rounded-lg mt-4 border border-[#FFB200]">
                <thead className="bg-[#FFB200]">
                  <tr>
                    <th className="py-6 w-[8%]">No.</th>
                    <th className="w-[12%]">Transaction ID</th>
                    <th className="w-[12%]">Project Name</th>
                    <th className="w-[12%]">Amount</th>
                    <th className="w-[12%]">Transaction Date</th>
                  </tr>
                </thead>
                <tbody className="text-center border border-[#FFB200]">
                  <tr className="odd:bg-[#FAEFD8] even:bg-white">
                    <td className="py-6 border-r border-r-[#FFB200]">
                      <span className="rounded px-2 py-1 bg-[#FFB200] font-semibold">
                        1
                      </span>
                    </td>
                    <td className="border-r border-r-[#FFB200]">4562</td>
                    <td className="border-r border-r-[#FFB200]">Web dev</td>
                    <td className="border-r border-r-[#FFB200]">110 USD</td>
                    <td className="border-r border-r-[#FFB200]">03-02-25</td>
                  </tr>
                </tbody>
              </table>
              <footer className="bg-white py-6 flex justify-between px-4 text-sm">
                <div>
                  <p className="font-bold">Showing 1 to 5 of 97 results</p>
                </div>
                <div className="flex items-center gap-x-2">
                  <FaArrowLeft className="text-[#FFB200]" />
                  <button className="rounded-full h-6 w-6 bg-[#FFB200] text-white flex items-center justify-center text-xs font-semibold">
                    1
                  </button>
                  <button className="rounded-full h-6 w-6 bg-[#FFF2D4] text-black font-semibold flex items-center justify-center text-xs">
                    2
                  </button>
                  <FaArrowRight className="text-[#FFB200]" />
                </div>
              </footer>
            </section>
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderOrder;
