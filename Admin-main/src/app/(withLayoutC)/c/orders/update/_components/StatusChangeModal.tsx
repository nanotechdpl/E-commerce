"use client";

import { X } from "lucide-react";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

interface StatusChangeItem {
  adminName: string;
  date: string;
  from: string;
  to: string;
}

const StatusChangeModal = ({ onClose }: { onClose: () => void }) => {
  const statusChanges: StatusChangeItem[] = [
    {
      adminName: "jack",
      date: "02-02-2024 02:00 AM",
      from: "pending",
      to: "cancel",
    },
    {
      adminName: "jack",
      date: "03-02-2024 02:00 AM",
      from: "cancel",
      to: "pending",
    },
    {
      adminName: "jack",
      date: "03-02-2024 02:00 AM",
      from: "pending",
      to: "payment",
    },
    {
      adminName: "Auto",
      date: "02-02-2024 02:00 AM",
      from: "payment",
      to: "waiting",
    },
    {
      adminName: "Mas",
      date: "02-03-2024 20:32 am",
      from: "waiting",
      to: "working",
    },
    {
      adminName: "Mas",
      date: "02-03-2024 20:32 am",
      from: "working",
      to: "complete",
    },
    {
      adminName: "Auto",
      date: "02-03-2024 20:32 am",
      from: "complete",
      to: "delivery",
    },
    {
      adminName: "sanse",
      date: "02-03-2024 20:32 am",
      from: "delivery",
      to: "waiting",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Changing status</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Admin name</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">From</th>
                <th className="text-left p-2">To</th>
              </tr>
            </thead>
            <tbody>
              {statusChanges.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 flex items-center">
                    <Image
                      src="/icons/profile.svg"
                      alt="Admin"
                      width={24}
                      height={24}
                      className="rounded-full mr-2"
                    />
                    {item.adminName}
                  </td>
                  <td className="p-2">{item.date}</td>
                  <td className="p-2">{item.from}</td>
                  <td className="p-2">{item.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeModal;
