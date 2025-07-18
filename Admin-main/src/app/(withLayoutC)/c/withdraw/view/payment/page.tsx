"use client";
// src\app\(withLayoutC)\c\allpayments\view\[withdrawId]\page.tsx
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import { formatDate3 } from "../../../../../../lib/formatDate";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { bindActionCreators } from "@reduxjs/toolkit";
import { getSingleReturn } from "../../actions";

type PaymentDetailsPageProps = {
  handleCloseModal: () => void;
  userPayment: any;
};
type ModalType =
  | "none"
  | "confirmation"
  | "changeStatus"
  | "adminTable"
  | "ChangeStatusSuccess";

export default function PaymentDetailsPage({
  handleCloseModal,
  userPayment,
}: PaymentDetailsPageProps) {
  const [modalType, setModalType] = useState<ModalType>("none");
  const openModal = (type: ModalType) => setModalType(type);
  const closeModal = () => setModalType("none");
  const searchParams = useSearchParams()
  const navigation = useRouter()
  const dispatch = useDispatch();

  const refund: any = useSelector((state: RootState) => state.returns.returnsById)
  const actions = useMemo(() => bindActionCreators({ getSingleReturn }, dispatch), [dispatch]);
  const [isImageVisible, setIsImageVisible] = useState(true);
  const closeImageModal = () => {
    setIsImageVisible(false);
  };
  const [isOpen, setIsOpen] = useState(false);
  const toggleImageSize = () => {
    setIsOpen(!isOpen);
  };
  const refundId = searchParams.get("refundId") || "";
  useEffect(() => {
    if (!refundId) return
    actions.getSingleReturn(refundId)
  },[actions, refundId]);
  return (
    <>
      <div className="flex w-full items-center justify-between p-4 mb-2 bg-[#CCCCFF] rounded-full">
       <button
          onClick={() => openModal("adminTable")}
          className="rounded-full text-black "
        >
          <Image src={'/images/info.png'} width={40} height={40} alt="Info" />
        </button>

        <button
          onClick={() => openModal("confirmation")}
          className="px-2 py-2 bg-[#FFB200] font-medium text-black rounded-md"
        >
          Deleted payment
        </button>

        <ul className="text-center text-[#000] px-40 text-lg font-semibold">
          {status === "Pending"
            ? "Pending Page View"
            : status === "Payment"
              ? "Payment Page View"
              : status === "Waiting"
                ? "Waiting Page View"
                : status === "Working"
                  ? "Working Page View"
                  : status === "Completed"
                    ? "Completed Page View"
                    : status === "Delivery"
                      ? "Delivery Page View"
                      : status === "Cancel"
                        ? "Cancelled Page View"
                        : "Pending Page View"}
        </ul>

        {/* Form elements */}
        <ul>
          <select
            className="bg-transparent focus:outline-none py-2 px-2 border border-[#FFB200] rounded-lg text-black"
            //onChange={handleChange}
            defaultValue="Access Type" // Default selected value
          >
            <option value="Access Type" disabled>
              Status
            </option>
            <option value="Pending">Pending</option>
            <option value="Payment">Accepted</option>
            <option value="Waiting">Spam</option>
          </select>
        </ul>

        <button
          onClick={() => openModal("changeStatus")}
          className="h-10 w-24 rounded-md bg-[#FFB200] px-5 py-1.5 font-medium text-black"
        >
          Save
        </button>

        <button
          className="relative bottom-5 -right-2  text-gray-700 text-lg border border-[#231F20] rounded"
          onClick={() => navigation.back()}
        >
          <IoClose color="#231F20" />
        </button>
      </div>

      {modalType !== "none" && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg  max-w-lg mx-auto overflow-hidden relative"
            onClick={(e) => e.stopPropagation()} 
          >
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
                {/* {modalType === 'adminTable' && 'Admin Table'} */}
              </h2>
            </div>

            {/* Modal Content */}
            {modalType === "confirmation" && (
              <div>
                <div className="flex justify-center items-center mb-4">
                  <span className="text-4xl">
                    <Image
                      src="/images/warn2.png"
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
                  <p>Do you want to delete the payment?</p>
                </div>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    className="bg-[#FFFFFF] text-[#000] font-semibold border-2 border-[#FFB200] px-12 py-2 rounded"
                    onClick={closeModal}
                  >
                    No
                  </button>
                  <button
                    className="bg-[#FFB200] font-semibold text-[#000] px-12 py-2 rounded"
                    onClick={closeModal}
                  >
                    Yes
                  </button>
                </div>
              </div>
            )}

            {modalType === "changeStatus" && (
              <div>
                <div className="flex justify-start text-left">
                  <h2 className="text-lg font-semibold text-[#000] py-2">
                    Enter your secure PIN code
                  </h2>
                </div>
                <div className="mt-4 flex justify-center space-x-4">
                  <input
                    type="password"
                    className="border border-[#CCCCFF] px-1 rounded-lg"
                    value="Samirsamir"
                  />
                  <button
                    className="bg-[#FFB200] text-sm font-semibold text-[#000] px-12 py-2 rounded"
                    //onClick={closeModal}
                    onClick={() => {
                      closeModal();
                      openModal("ChangeStatusSuccess");
                    }}
                  >
                    Enter
                  </button>
                </div>
              </div>
            )}

            {modalType === "ChangeStatusSuccess" && (
              <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg text-center flex flex-col items-center">
                  <Image
                    src="/images/ordersuccess.png"
                    height={100}
                    width={100}
                    alt=""
                  />
                  <h2 className="mt-2 font-bold text-lg">Successful</h2>
                  <p className="mt-1 text-gr">Your status has been changed.</p>

                  <div className="flex mt-8 w-full">
                    <button
                      onClick={closeModal} // Close the modal }}
                      className="bg-[#FFB200] text-black font-semibold py-2 px-10 w-full rounded-lg"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}

            {modalType === "adminTable" && (
              <div className="bg-white w-full rounded-lg">
                <div className="max-h-[80vh]">
                  <p className="text-[#000] my-4 text-xl font-bold text-center">
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

      {/* <div className="w-full p-4 md:p-6 2xl:p-10">
        <PaymentReceipt back_url="/c/allpayments/" />
        </div> */}
      <div className="w-full p-4 md:p-6 2xl:p-10">
        <div className="relative rounded bg-white px-4 py-8">
          <div className="grid grid-cols-2">
            <h3 className="font-semibold text-2xl text-blue-600 text-left">
              Payment Reception
            </h3>
            <div className="font-semibold items-start text-[#FFB200] flex justify-center">
              <div className="text-left">
                <p>Payment ID: {refund?.returnNumber}</p>
                <p>Payment Date: {formatDate3(refund?.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white mt-4">
            <p className="font-semibold items-start text-left">
              Dear, {refund?.account_name}
            </p>
            <p className="font-semibold mb-4 items-start text-left">
              You have paid{" "}
              <span className="font-bold">{refund?.amount}</span>{" "}
              {userPayment?.Currency} to {refund?.bank_name}.{" "}
              <span className="text-[#5296D6]">
                Your payment status is {refund?.status}
              </span>
            </p>

            <div className="grid grid-cols-7">
              <div className="col-span-4 flex-1">
                <table className="w-full table-auto  text-left">
                  <tbody className="text-left">
                    <tr className="text-left">
                      <td>Payment method</td>
                      <td>:</td>
                      <td>{refund?.bank_wallet}</td>
                    </tr>
                    <tr>
                      <td>Account Holder Name</td>
                      <td>:</td>
                      <td>{refund?.account_name}</td>
                    </tr>
                    <tr>
                      <td>Account Name</td>
                      <td>:</td>
                      <td>{refund?.account_name}</td>
                    </tr>
                    <tr>
                      <td>Account Number</td>
                      <td>:</td>
                      <td>{refund?.account_number}</td>
                    </tr>
                    <tr>
                      <td>Transaction ID</td>
                      <td>:</td>
                      <td>{refund?.orderid}</td>
                    </tr>
                    <tr>
                      <td>Transaction Receipt</td>
                      <td>:</td>
                      <td>{refund?.transaction_receipt ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                      <td>Any Additional information</td>
                      <td>:</td>
                      <td>{refund?.additional_note}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {isImageVisible && (
                <div className="col-span-3 flex flex-1 justify-center items-center relative">
                  {/* <div className="bg-red overflow-hidden relative h-32"> */}
                  <Image
                    src="/images/image 12130.png"
                    onClick={toggleImageSize}
                    alt="spam"
                    className="border-8 border-[#FFB200] rounded-lg"
                    width={300}
                    height={33}
                  />
                  {isOpen && (
                    <div
                      onClick={toggleImageSize}
                      style={{
                        position: "fixed", // Ensure it's fixed to the viewport
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark background
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000, // Higher than most other elements
                      }}
                    >
                      <Image
                        src="/images/image 12130.png"
                        alt="Order successful"
                        width={400} // Adjust as needed
                        height={400} // Adjust as needed
                        style={{ objectFit: "contain" }} // Maintain aspect ratio
                      />
                    </div>
                  )}
                  <button
                    className="absolute -top-3 right-8 flex items-center justify-center w-5 h-5 text-sm text-gray-400 hover:text-gray-600 font-bold bg-white border border-gray-300 rounded shadow-md"
                    onClick={closeImageModal}
                  >
                    &times;
                  </button>
                  {/* </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
