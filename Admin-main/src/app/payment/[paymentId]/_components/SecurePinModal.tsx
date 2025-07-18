"use client";

import { useState } from "react";
import SuccessfulModal from "./SuccessfulModal";
import { updateSinglePayment } from "@/app/(withLayoutC)/c/allpayments/actions";

export default function SecurePinModal({
  onClose,
  id,
}: {
  id: string;
  onClose: (data: boolean) => void;
}) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const status = localStorage.getItem("type");

  const handleUpdate = async () => {
    await updateSinglePayment(id, status!);
    setShowSuccessModal(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-lg">
        <button
          className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600"
          onClick={() => onClose(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <h1 className="text-2xl font-medium mb-6">
            Enter your secure PIN code
          </h1>

          <div className="flex gap-4">
            <input
              defaultValue={"5555555"}
              type="password"
              className="flex-1 px-4 py-2 text-lg border-2 border-purple-100 rounded-xl outline-none focus:border-purple-200 focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50"
              maxLength={10}
            />

            <button
              onClick={handleUpdate}
              className="px-8 py-2 bg-amber-400 hover:bg-amber-500 text-black font-medium rounded-xl transition-colors"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
      {showSuccessModal && <SuccessfulModal onClose={onClose} />}
    </div>
  );
}
