"use client";
import React from "react";

import { useParams } from "next/navigation";
import HeaderPayment from "../../components/HeaderPayment";
import { PaymentProvider } from "./[paymentId]/paymentContext";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { paymentId } = useParams();
  const orderIdString = Array.isArray(paymentId) ? paymentId[0] : paymentId;
  return (
    <>
      <PaymentProvider paymentId={orderIdString ?? ""}>
        {/* <!-- ===== Page Wrapper Start ===== --> */}
        <div className="flex h-screen overflow-hidden">
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#CCCCFF]">
            {/* <!-- ===== Header Start ===== --> */}
            <HeaderPayment />
            {/* <!-- ===== Header End ===== --> */}

            {/* <!-- ===== Main Content Start ===== --> */}

            <main className="bg-[#CCCCFF]">{children}</main>

            {/* <!-- ===== Main Content End ===== --> */}
          </div>
          {/* <!-- ===== Content Area End ===== --> */}
        </div>
      </PaymentProvider>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
