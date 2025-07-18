import React from "react";

type WithdrawItem = {
  name: string;
  bank: string;
  amount: string;
  time: string;
};

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdraws: WithdrawItem[];
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  withdraws,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed text-black -mt-4 inset-28 z-50 flex items-center justify-end">
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
          <h2 className="text-lg font-bold">New Withdraw</h2>
          <span className="text-gray-600 mr-4">New 59</span>
        </div>

        {/* Withdraw list */}
        <div className="space-y-3">
          {withdraws.map((withdraw, index) => (
            <div
              key={index}
              className="p-3 bg-white rounded-lg border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{withdraw.name}</p>
                  <p className="text-sm text-gray-500">{withdraw.bank}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {withdraw.amount}
                  </p>
                  <p className="text-sm text-gray-500">{withdraw.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 text-right">
          <button className="text-gray-600 text-sm">see All Withdraw</button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
