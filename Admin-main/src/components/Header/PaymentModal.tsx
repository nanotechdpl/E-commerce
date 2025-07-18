import React from "react";

type PaymentItem = {
  name: string;
  bank: string;
  balance: string;
  time: string;
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payments: PaymentItem[];
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  payments,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed text-black z-50 right-1 top-20 md:right-5">
      <div className="bg-white rounded-lg shadow-lg w-80 p-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-4 mt-2">
          <h2 className="text-lg font-bold">New Payment</h2>
          <span className="text-gray-600 mr-4">New 59</span>
        </div>

        {/* Payment list */}
        <div className="space-y-3">
          {payments.map((payment, index) => (
            <div
              key={index}
              className="p-3 bg-white rounded-lg border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{payment.name}</p>
                  <p className="text-sm text-gray-500">{payment.bank}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {payment.balance}
                  </p>
                  <p className="text-sm text-gray-500">{payment.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 text-right">
          <button className="text-gray-600 text-sm">see All Payment</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
