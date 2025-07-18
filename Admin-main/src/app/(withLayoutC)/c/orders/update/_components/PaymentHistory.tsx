"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface PaymentHistoryModalProps {
  onClose: () => void;
}

export default function PaymentHistory({ onClose }: PaymentHistoryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data
  const payments = [
    {
      no: 1,
      paymentId: "P0001",
      accountName: "Indian Bank",
      amount: "110 usd",
      paymentDay: "UTC:03-02-25, 02:05 PM",
    },
    {
      no: 2,
      paymentId: "P0001",
      accountName: "Indian Bank",
      amount: "110 usd",
      paymentDay: "UTC:03-02-25, 02:05 PM",
    },
    {
      no: 3,
      paymentId: "P0001",
      accountName: "Indian Bank",
      amount: "120 usd",
      paymentDay: "UTC:03-02-25, 02:05 PM",
    },
    {
      no: 4,
      paymentId: "P0001",
      accountName: "Indian Bank",
      amount: "140 usd",
      paymentDay: "UTC:03-02-25, 02:05 PM",
    },
    {
      no: 5,
      paymentId: "P0001",
      accountName: "Indian Bank",
      amount: "140 usd",
      paymentDay: "UTC:03-02-25, 02:05 PM",
    },
  ];

  const filteredPayments = payments.filter((payment) =>
    Object.values(payment).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-[90%] max-w-6xl max-h-[90vh] bg-[#D5D6EA] rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="bg-[#D5D6EA] rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl text-[#231F20] font-bold font-poppins">
                Payment history
              </h1>
              <div className="flex ">
                <input
                  type="text"
                  placeholder="search"
                  className="px-4 py-2 border border-gray-200 rounded-sm  w-[400px] focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="px-6 py-2 bg-np text-black text-lg font-normal hover:bg-yellow-500 transition-colors">
                  Search
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-np text-black">
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      No.
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Account Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Payment Day
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-[#FAEFD8] text-black" : "bg-[#fff] text-black"}
                    >
                      <td className="px-6 py-4 text-sm border-r border-np"> <span className="flex justify-center items-center bg-np w-13 h-8">{payment.no}</span></td>
                      <td className="px-6 py-4 text-sm border-r border-np">{payment.paymentId}</td>
                      <td className="px-6 py-4 text-sm border-r border-np">
                        {payment.accountName}
                      </td>
                      <td className="px-6 py-4 text-sm border-r border-np">{payment.amount}</td>
                      <td className="px-6 py-4 text-sm border-r border-np">
                        {payment.paymentDay}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p className="mb-1 text-sm text-black font-semibold font-poppins">Showing 1 to 5 of 67 Results</p>
              <button className="w-[122px] h-[38px] bg-np text-black rounded-md hover:np transition-colors text-[13px] font-semibold">
                More Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
