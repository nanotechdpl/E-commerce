import { AlertTriangle } from "lucide-react";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

const DeleteConfirmationModal = ({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Confirmation</h2>
          <p className="text-gray-600 mb-6">Do you want to delete the order?</p>
          <div className="flex space-x-4 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-yellow-400 text-black rounded-lg hover:bg-gray-50"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 bg-rose-600"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
