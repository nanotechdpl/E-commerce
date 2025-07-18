"use client";
import Image from "next/image";
import { use, useEffect, useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import PaymentDescription from "../_components/PaymentDescription";
import PaymentOptions from "../_components/PaymentOptions";
import PaymentReception from "../_components/PaymentReception";
import DeleteConfirmationModal from "./_components/DeleteConfirmationModal";
import SecurePinModal from "./_components/SecurePinModal";
import StatusChangeModal from "./_components/StatusChangeModal";
import { usePayment } from "./paymentContext";
import { bindActionCreators } from "@reduxjs/toolkit";
import { getSinglePayment } from "@/app/(withLayoutC)/c/allpayments/actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { NextPage } from "next";

type PagePropsTypes = {
  params: Promise<{ paymentId: string }>;
};

const PaymentDetailsPage: NextPage<PagePropsTypes> = (props) => {
  const { params } = props;
  const { paymentId } = use(params);
  const {  modalType, closeModal } = usePayment();

  console.log("modal type", modalType);

  const singlePayment: any = useSelector(
    (state: RootState) => state.payment?.singlePayment
  );
  console.log(singlePayment);

  const [isImageVisible, setIsImageVisible] = useState(true);
  // Function to handle closing the modal (hiding the image)
  const closeImageModal = () => {
    setIsImageVisible(false);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleImageSize = () => {
    setIsOpen(!isOpen);
  };
  const dispatch = useDispatch();

  const actions = useMemo(
    () => bindActionCreators({ getSinglePayment }, dispatch),
    [dispatch]
  );

  useEffect(() => {
    if (paymentId) return;
    actions.getSinglePayment(paymentId);
  }, [actions, paymentId]);

  return (
    <>
      <div className="w-3/4 flex items-center justify-center  md:p-6 2xl:p-10 mx-auto">
        <div className="relative w-fit rounded-lg bg-white px-8 py-8">
          <PaymentReception paymentData={singlePayment?.payment} />

          <div>
            <PaymentDescription paymentData={singlePayment?.payment} />

            <div className="flex gap-4">
              <PaymentOptions paymentData={singlePayment?.payment} />

              {isImageVisible && (
                <div className="col-span-3 flex flex-1 justify-center items-center relative">
              
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
                        position: "fixed", 
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.8)", 
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000, 
                      }}
                    >
                      <Image
                        src="/images/image 12130.png"
                        alt="Order successful"
                        width={400} 
                        height={400} 
                        style={{ objectFit: "contain" }} 
                      />
                    </div>
                  )}
                  <button
                    onClick={closeImageModal}
                    className="relative bottom-20 -right-2  text-gray-700 text-lg border border-[#231F20] rounded"
                  >
                    <IoClose color="#231F20" />
                  </button>
                </div>
              )}
              {modalType === "adminTable" && (
                <StatusChangeModal onClose={closeModal} />
              )}
              {modalType === "confirmation" && (
                <DeleteConfirmationModal
                  onClose={closeModal}
                  onConfirm={closeModal}
                />
              )}

              {modalType === "enterPin" && (
                <SecurePinModal
                  onClose={closeModal}
                  id={singlePayment?.payment?._id}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


export default PaymentDetailsPage