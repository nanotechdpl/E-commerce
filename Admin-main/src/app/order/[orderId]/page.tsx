"use client";
import { useState } from "react";

import Line from "@/components/ui/Line";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { formatDate2, formatTime } from "../../../lib/formatDate";
import { useOrder } from "./orderContext";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

type ModalType =
  | "none"
  | "confirmation"
  | "transaction"
  | "changeStatus"
  | "adminTable";
export default function OrderDetailsPage() {
  const { orderData } = useOrder();
  // const [status, setStatus] = useState("Pending");

  // const handleChange = (value: string) => {
  //   setStatus(value);
  // };

  // const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = event.target.value;
  //   setStatus(value); // Update the state with the selected value
  //   console.log(value); // You can still log the selected value
  // };

  // const [showTransactionList, setShowTransactionList] = useState(false);

  // Handle button click to toggle visibility
  // const handleToggleTransactionList = () => {
  //   setShowTransactionList((prevState) => !prevState); // Toggles between true/false
  // };
  // State to track which modal is open
  const [modalType, setModalType] = useState<ModalType>("none");
  // Function to open specific modal
  // const openModal = (type: ModalType) => setModalType(type);

  // Function to close modal
  const closeModal = () => setModalType("none");

  return (
    <>
      {modalType !== "none" && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 mt-8"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg  max-w-lg mx-auto overflow-hidden relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
          >
            {/* Modal Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>

            {/* Modal Header */}
            <div className="flex justify-center items-center mb-4">
              <h2 className="text-xl font-bold">
                {/* {modalType === 'confirmation' && 'Confirmation'} */}
                {/* {modalType === 'changeStatus' && 'Change Status'} */}
                {modalType === "transaction" && "Transaction List"}
                {/* {modalType === 'adminTable' && 'Admin Table'} */}
              </h2>
            </div>

            {/* Modal Content */}
            {modalType === "confirmation" && (
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
                  {modalType === "confirmation" && "Confirmation"}
                </h2>
                <div className="flex justify-center">
                  <p>Do you want to delete the order?</p>
                </div>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    className="bg-[#FFFFFF] font-semibold text-[#000] border-2 border-[#FFB200] px-12 py-2 rounded"
                    onClick={closeModal}
                  >
                    No
                  </button>
                  <button
                    className="bg-[#FF3D00] font-semibold text-white px-12 py-2 rounded"
                    onClick={closeModal}
                  >
                    Yes
                  </button>
                </div>
              </div>
            )}

            {modalType === "changeStatus" && (
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
                  {modalType === "changeStatus" && "Change Status"}
                </h2>
                <div className="flex justify-center text-center">
                  <p>
                    You proceed to change the <br /> status <br />
                    Click no if you don`&apos;`t want to
                  </p>
                </div>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    className="bg-slate-400 text-white px-12 py-2 rounded"
                    onClick={closeModal}
                  >
                    No
                  </button>
                  <button
                    className="bg-[#009933] text-white px-12 py-2 rounded"
                    onClick={closeModal}
                  >
                    Yes
                  </button>
                </div>
              </div>
            )}
            {modalType === "transaction" && (
              <section className="rounded-xl py-5 px-3 w-full">
                <header className="flex justify-center items-center mt-3">
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
            )}

            {modalType === "adminTable" && (
              <div className="bg-white w-full rounded-lg">
                <div className="max-h-[80vh]">
                  <p className="text-[#000] my-2 text-xl font-bold">
                    {modalType === "adminTable" && "Changing status"}
                  </p>
                  <table className="table-auto w-full text-sm text-[#000]">
                    <thead>
                      <tr>
                        <th className="border px-4 whitespace-nowrap">
                          Admin Name
                        </th>
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
                          02-02-2024{" "}
                          <span className="text-xs ml-1">02:00 AM</span>
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Pending
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Cancel
                        </td>
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
                          03-02-2024{" "}
                          <span className="text-xs ml-1">02:00 AM</span>
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Payment
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Working
                        </td>
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
                          08-02-2024{" "}
                          <span className="text-xs ml-1">02:00 AM</span>
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Pending
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Cancel
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 whitespace-nowrap">Auto</td>
                        <td className="border px-4 whitespace-nowrap">
                          02-02-2024{" "}
                          <span className="text-xs ml-1">02:00 AM</span>
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Payment
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Working
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 whitespace-nowrap">Auto</td>
                        <td className="border px-4 whitespace-nowrap">
                          03-02-2024{" "}
                          <span className="text-xs ml-1">02:00 AM</span>
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Payment
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Delivery
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 whitespace-nowrap">Auto</td>
                        <td className="border px-4 whitespace-nowrap">
                          03-02-2024{" "}
                          <span className="text-xs ml-1">02:00 AM</span>
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Payment
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Delivery
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 whitespace-nowrap">Auto</td>
                        <td className="border px-4 whitespace-nowrap">
                          03-02-2024{" "}
                          <span className="text-xs ml-1">02:00 AM</span>
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Payment
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Delivery
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 whitespace-nowrap">Auto</td>
                        <td className="border px-4 whitespace-nowrap">
                          03-02-2024{" "}
                          <span className="text-xs ml-1">02:00 AM</span>
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Payment
                        </td>
                        <td className="border px-4 whitespace-nowrap">
                          Delivery
                        </td>
                      </tr>
                      {/* Add more rows as needed */}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conditionally render OrderForm or Image based on status */}

      <div className="max-w-4xl mx-auto p-3 bg-[#FFFFFF] rounded-md my-16">
        {/* <Image src="/images/order.png" alt="sign" width={850} height={800} /> */}
        {/* <div className="bg-white flex justify-center items-center w-full h-full"> */}
        <div className="bg-[#FFFFFF] rounded-lg p-8">
          <div className="flex flex-col items-center mb-2">
            <Line />
            <h1
              className={`${poppins.className} font-normal text-[40px] leading-[22.17px] text-black mt-4`}
            >
              {" "}
              {orderData?.projectName}
            </h1>
            {/* <p className="text-lg">Essential Details Of The Project</p> */}
            <p className="font-inter font-normal text-[16px] leading-[19.36px] text-black mt-6">
              order ID : {orderData?.orderNumber}
            </p>
            <p className="font-inter font-normal text-[16px] leading-[19.36px] text-black">
              order Date : {formatDate2(orderData?.dateOfOrder)}{" "}
              {formatTime(orderData?.dateOfOrder)}
            </p>
          </div>

          <div className="grid grid-cols-2 mt-6">
            {/* Project Info Section */}
            <div className="mb-4 text-sm text-left">
              <p>
                <span className="font-inter font-light text-[20px] leading-[28px] text-black">
                  Applicant&apos;s Full Name: {orderData?.applicantsName}
                </span>
              </p>
              <p>
                <span className="font-inter font-light text-[20px] leading-[28px] text-black">
                  Project Requirements: {orderData?.projectRequirement}
                </span>
              </p>
              <p>
                <span className="font-inter font-light text-[20px] leading-[28px] text-black">
                  Type of Project: {orderData?.projectType}
                </span>
              </p>
              <p>
                <span className="font-inter font-light text-[20px] leading-[28px] text-black">
                  Pay Currency: {orderData?.payCurrency}
                </span>
              </p>
              <p>
                <span className="font-inter font-light text-[20px] leading-[28px] text-black">
                  Budget: {orderData?.Budget}
                </span>
              </p>
              {orderData?.minimumPay > 0 && (
                <p>
                  <span className="font-inter font-light text-[20px] leading-[28px] text-black">
                    Minimum Pay: {orderData.minimumPay}
                  </span>
                </p>
              )}
              <p>
                <span className="font-inter font-light text-[20px] leading-[28px] text-black">
                  Project Deadline: {formatDate2(orderData?.projectDeliveryDay)}
                </span>{" "}
              </p>
              <p>
                <span className="font-inter font-light text-[20px] leading-[28px] text-black">
                  Reference Name: {orderData?.referenceName}
                </span>
              </p>
              <p>
                <span className="font-inter font-light text-[20px] leading-[28px] text-black mr-1">
                  Provide the project related files:{" "}
                  {orderData?.projectFiles && orderData?.projectFiles.length > 0
                    ? "Yes"
                    : "No"}
                </span>
              </p>
            </div>
            {/* <div>
            <p className="text-lg">Essential Details Of The Project</p>
            <p className="text-lg">order ID : 4644
            </p>
            <p className="text-lg">order Date : 02-02-2024(02:23 pm)</p>

          </div> */}
            <div className="flex justify-end">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg"
                alt="NASA logo"
                width={160}
                height={140}
                className="mb-4"
              />
            </div>
          </div>

          {/* Project Description */}

          <div className="text-left border-2 border-[#D9D9D9] rounded-lg flex flex-col p-4">
            <h2 className="font-inter font-extrabold text-[16px] leading-[19.36px] text-black mb-2">
              Give some details about the project:
            </h2>

            <p className="font-inter font-medium text-[16px] leading-[19.36px] text-black mb-2">
              {orderData?.projectDetails || "No project details provided yet."}
            </p>
          </div>

          <div className="flex justify-between gap-20">
            {/* Agreement Section */}
            <div className="mt-3 flex flex-col space-y-1 text-left">
              <div className="flex flex-row items-center">
                <input
                  type="checkbox"
                  id="accepted_terms"
                  className="w-[31px] h-[31px] bg-[#D9D9D91A] rounded-[4px] border-[2px] border-[#00000026] mr-2"
                  checked={!!orderData?.acceptedTerms}
                />
                <label
                  htmlFor="accepted_terms"
                  className="font-inter font-medium text-[16px] leading-[19.36px] text-black"
                >
                  I agree all Transcend & condition , privacy policy
                </label>
              </div>

              {/* <div>
              <input type="checkbox" id="confirm" className="mr-2" defaultChecked />
              <label htmlFor="confirm">I confirm that the information is correct.</label>
            </div>
            <div>
              <input type="checkbox" id="apply" className="mr-2" defaultChecked />
              <label htmlFor="apply">I am applying by agreeing to these terms.</label>
            </div>*/}
            </div>
          </div>

          {/* Signature Section */}
          <div className="mt-6 flex items-center space-x-4">
            <p className="font-inter font-normal text-[16px] leading-[19.36px] text-black text-center">
              Applicant signature:
            </p>
            <Image
              src={"/signature.png"}
              alt="sign"
              width={80}
              height={30}
              className=""
            />
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
}
