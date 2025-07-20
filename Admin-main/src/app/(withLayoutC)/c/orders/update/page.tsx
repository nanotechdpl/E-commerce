"use client";

import { Inter } from "next/font/google";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import ChangeStatusModal from "./_components/ChangeStatusModal";
import DeleteConfirmationModal from "./_components/DeleteConfirmationModal";
import {  useSearchParams } from "next/navigation";
import PaymentHistory from "./_components/PaymentHistory";
import StatusChangeModal from "./_components/StatusChangeModal";
import UpdatePageHeader from "./_components/UpdatePageHeader";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store/store";
import { getSingleOrder } from "../actions";
import axiosInstance from "@/redux/axios";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

interface ProjectFormData {
  priceOrBudget?: string;
  expectedEndDate?: string;
  description?: string;
  salaryOrBudget?: string;

}

export default function PendingPage() {
  const searchParams = useSearchParams();
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [isAccessDropdownOpen, setIsAccessDropdownOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const orders: any = useSelector((state: RootState) => state.orders?.orders);
  const order_id = searchParams.get("orderId") || null;
  const singleOrder: any =
    orders?.data?.find((order) => order?.orderId === order_id) || null;
  console.log("singleOrder", singleOrder);
  // console.log("orderId", order);
  const [formData, setFormData] = useState<ProjectFormData>({
    priceOrBudget: singleOrder && (singleOrder?.priceOrBudget || singleOrder?.salaryOrBudget),
      expectedEndDate:
        singleOrder && singleOrder?.expectedEndDate
          ? new Date(singleOrder.expectedEndDate).toLocaleDateString()
          : "",
      description: singleOrder && singleOrder?.description,
  });
  const dispatch = useDispatch();

  console.log(singleOrder);
  const actions = useMemo(
    () => bindActionCreators({ getSingleOrder }, dispatch),
    [dispatch]
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const orderId = searchParams.get("orderId") || null;

  useEffect(() => {
    if (!orderId) return;
    actions.getSingleOrder(orderId);
    setFormData({
      priceOrBudget: singleOrder && (singleOrder?.priceOrBudget || singleOrder?.salaryOrBudget),
      expectedEndDate:
        singleOrder && singleOrder?.expectedEndDate
          ? new Date(singleOrder.expectedEndDate).toLocaleDateString()
          : "",
      description: singleOrder && singleOrder?.description,
    });
  }, [actions, orderId, singleOrder]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic here
    console.log("File uploaded:", e.target.files);
  };

  const handleChangeStatusModal = () => {
    setShowStatusChangeModal(false);
  };

  const handleDeleteShowModal = () => {
    setShowDeleteConfirmation(false);
  };

  const handleChangeStatus = () => {
    setShowChangeStatus(false);
  };

  const handlePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const handleSave = () => {
    axiosInstance
      .post("/admin/update/order/status", {
        orderid: orderId,
        status: "payment",
        pin: "123456",
      })
      .then((res) => {
        setShowChangeStatus(false);
        console.log(res);
        debugger;
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={`bg-gray-100 ${inter.className}`}>
      {showStatusChangeModal && (
        <StatusChangeModal onClose={handleChangeStatusModal} />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          onClose={handleDeleteShowModal}
          onConfirm={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}

      {showChangeStatus && (
        <ChangeStatusModal
          onClose={handleChangeStatus}
          onConfirm={handleSave}
        />
      )}

      {showPaymentModal && <PaymentHistory onClose={handlePaymentModal} />}

      <div className="max-w-5xl mx-auto p-4">
        <UpdatePageHeader
          isAccessDropdownOpen={isAccessDropdownOpen}
          setIsAccessDropdownOpen={setIsAccessDropdownOpen}
          handleDeleteShowModal={setShowDeleteConfirmation}
          handleChangeStatusModal={setShowStatusChangeModal}
          handlePaymentModal={setShowPaymentModal}
          setShowStatusChangeModal={setShowChangeStatus}
        />
        <div className="bg-white text-black p-8 rounded shadow">
          <h2 className="text-center text-2xl font-semibold mb-2">
            {singleOrder?.serviceName}
          </h2>
          <p className=" text-gray-500 mb-4">
            <b>Applicant&apos;s Full Name:{" "}</b>{singleOrder?.fullName || "N/A"} <br />
           <b>OrderId{" "}</b>{singleOrder?.orderId || "N/A"} <br />
            <b>Pay Currency: </b> {singleOrder?.payCurrency || "N/A"} <br />
           <b> Order Date : </b>
            {singleOrder?.createdAt
              ? new Date(singleOrder?.createdAt).toLocaleDateString()
              : "N/A"}
            <br />
            <b>Service Type: </b> {singleOrder?.serviceType || "N/A"}
            <br />
            <b>Order Status: </b> {singleOrder?.orderStatus || "N/A"}
            <br />
            {singleOrder?.priorityLevel && (
              <>
              <b>Priority Level: </b>  {singleOrder?.priorityLevel || "N/A"}
              </>
            )}
            <br />
            {singleOrder?.referenceName && (
             <>
             <b> Reference Name:</b> {singleOrder?.referenceName || "N/A"}
             </>
            )}
            <br />
            {
              singleOrder?.provideDocument && (
                <>
                  <b>Provide Document:{" "}</b>
                  <Link className="text-blue-600" href={singleOrder?.provideDocument}>Document</Link>
                </>
              )

            }
            <br />
           <b> Email: </b> {singleOrder?.email || "N/A"}
            <br />
           <b> Phone: </b>{singleOrder?.phone || "N/A"}
            <br />
            <b>Nationality: </b>{singleOrder?.nationality || "N/A"}
            <br />
            <b>Address: </b>
            {singleOrder?.permanentAddress
              ? `${singleOrder.permanentAddress.city || ""}, ${
                  singleOrder.permanentAddress.stateOrProvince || ""
                }, ${singleOrder.permanentAddress.country || ""}, ${
                  singleOrder.permanentAddress.ziporPostalCode || ""
                }`
              : "N/A"}
            <br />
            {singleOrder?.workPlace && (
              <span>
               <b> Work Place: </b>{singleOrder.workPlace.city || ""},{" "}
                {singleOrder.workPlace.stateOrProvince || ""},{" "}
                {singleOrder.workPlace.country || ""},{" "}
                {singleOrder.workPlace.ziporPostalCode || ""}
              </span>
            )}
          </p>

          <form className="space-y-4">
            

              {
                singleOrder?.priceOrBudget && ( <div>
                <label className="block text-gray-700">Price/Budget</label>
                <input
                  type="text"
                  name="priceOrBudget"
                  value={formData?.priceOrBudget}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>)
              }

              {
                singleOrder?.salaryOrBudget && ( <div>
                <label className="block text-gray-700">Salary/Budget</label>
                <input
                  type="text"
                  name="salaryOrBudget"
                  value={formData?.salaryOrBudget}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>)
              }


              {
                singleOrder?.expectedEndDate && (
                  <div>
                    <label className="block text-gray-700">
                      Expected End Date
                    </label>
                    <input
                      type="date"
                      name="expectedEndDate"
                      value={formData.expectedEndDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                )
              }
              {/* <div>
                <label className="block text-gray-700">
                  Provide the project related files
                </label>
                <label className="w-full border border-gray-300 rounded px-3 py-2 flex items-center justify-center cursor-pointer">
                  <i className="fas fa-upload mr-2"></i>
                  Upload file
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div> */}

             

            <div>
              <label className="block text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2 placeholder-text-black"
               
              />
            </div>
            
            <div>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer">Update</button>
            </div>

           
          </form>
        </div>
      </div>
    </div>
  );
}
