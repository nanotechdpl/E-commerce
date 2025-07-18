"use client";
import { usePayment } from "@/app/payment/[paymentId]/paymentContext";

function HeaderPayment() {
  const { openModal } = usePayment();

  return (
    <div className="flex w-full items-center justify-between p-4 mb-2 bg-[#CCCCFF] rounded-full">
      {/* Button to open the "adminTable" modal */}
      <button
        onClick={() => openModal("adminTable")}
        className="py-2 px-6 rounded-lg text-black border"
      >
        Info
      </button>

      {/* Button to open the "confirmation" modal */}
      <button
        onClick={() => openModal("confirmation")}
        className="px-2 py-2 bg-[#FFB200] font-medium text-black rounded-md"
      >
        Delete Payment
      </button>

      {/* Placeholder for payment status */}
      <ul className="text-center text-[#000] px-40 text-lg font-semibold">
        Pending Page View
      </ul>

      {/* Dropdown to change payment status */}
      <ul>
        <select
          className="bg-[#fff] py-2 px-2 border border-[#FFB200] rounded-lg text-black"
          defaultValue="Access Type"
          onChange={(e) => openModal(e.target.value)}
        >
          <option value="Access Type" disabled>
            Status
          </option>
          <option value="pending">Pending</option>
          <option value="payment">Accepted</option>
          <option value="waiting">Spam</option>
        </select>
      </ul>

      {/* Save button */}
      <button
        onClick={() => openModal("enterPin")}
        className="h-10 w-24 rounded-md bg-[#FFB200] px-5 py-1.5 font-medium text-black"
      >
        Save
      </button>
    </div>
  );
}

export default HeaderPayment;
