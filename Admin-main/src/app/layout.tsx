"use client";

import Loader from "@/components/common/Loader";
  import { ToastContainer } from 'react-toastify';
import "@/css/satoshi.css";
import "@/css/style.css";
import '@ant-design/v5-patch-for-react-19';
import StoreProvider from "@/types/providers/StoreProvider";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import React, { useEffect, useState } from "react";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
   
    setLoading(false); 
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="">
          <StoreProvider>
            {loading ? <Loader /> : <AntdRegistry>{children}</AntdRegistry>}
          </StoreProvider>
        </div>
         <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
