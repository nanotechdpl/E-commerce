import { Check } from "lucide-react";

const SuccessfulModal = ({ onClose }: { onClose: (data: boolean) => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Successful</h2>
          <p className="text-gray-600 mb-6">Your status has been changed.</p>
          <button
            className="w-full px-4 py-2 bg-yellow-400 rounded-lg"
            onClick={() => onClose(true)}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessfulModal;
