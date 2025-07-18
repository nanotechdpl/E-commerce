"use client";
import { PaymentsData as paymentsData } from "@/constants/paymentData";
import { IPayment } from "@/types/payment";
import React, { createContext, useContext, useEffect, useState } from "react";

interface PaymentContextProps {
  paymentData: IPayment | null;
  loading: boolean;
  error: any;
  modalType: string; // Current modal type
  openModal: (type: string) => void; // Function to open modal
  closeModal: () => void; // Function to close modal
}

const PaymentContext = createContext<PaymentContextProps | undefined>(
  undefined
);

export const PaymentProvider: React.FC<{
  children: React.ReactNode;
  paymentId: string;
}> = ({ children, paymentId }) => {
  const [paymentData, setPayment] = useState<IPayment | null>(null);
  const [loading] = useState(true);
  const [error] = useState<any>(null);
  const [modalType, setModalType] = useState<string>("none"); // Modal state

  useEffect(() => {
    if (!paymentId) return;

    const fetchPaymentData = async () => {
      const payment = paymentsData.find((od) => od.id === Number(paymentId));
      setPayment(payment || null);
    };

    fetchPaymentData();
  }, [paymentId]);

  const openModal = (type: string) => setModalType(type); // Open modal
  const closeModal = () => setModalType("none"); // Close modal
  if (modalType !== "enterPin") localStorage.setItem("type", modalType);

  return (
    <PaymentContext.Provider
      value={{ paymentData, loading, error, modalType, openModal, closeModal }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};
