interface UpdatePageHeaderProps {
  setShowStatusChangeModal: React.Dispatch<React.SetStateAction<boolean>>;
  isAccessDropdownOpen: boolean;
  setIsAccessDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeStatusModal: (data: boolean) => void;
  handleDeleteShowModal: (data: boolean) => void;
  handlePaymentModal: (data: boolean) => void;
}
const UpdatePageHeader = ({
  setShowStatusChangeModal,
  isAccessDropdownOpen,
  setIsAccessDropdownOpen,
  handleChangeStatusModal,
  handleDeleteShowModal,
  handlePaymentModal,
}: UpdatePageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8 z-999">
      <div className="flex space-x-2">
        <button
          className="border-2 rounded-lg text-black px-4 py-2 "
          onClick={() => handleChangeStatusModal(true)}
        >
          info
        </button>
        <button
          className="bg-red rounded-lg text-white px-4 py-2 "
          onClick={() => handleDeleteShowModal(true)}
        >
          Deleted Orders
        </button>
        <button
          className="bg-gray rounded-lg text-gray-700 px-4 py-2 "
          onClick={() => handlePaymentModal(true)}
        >
          Transaction List
        </button>
      </div>

      <h1 className="text-2xl text-black font-semibold">Pending Page</h1>

      <div className="flex space-x-2 items-center">
        <div className="relative">
          <button
            className="bg-[#ffb200] text-black px-4 py-2  flex items-center rounded-lg"
            onClick={() => setIsAccessDropdownOpen(!isAccessDropdownOpen)}
          >
            Access type
            <i className="fas fa-caret-down ml-2"></i>
          </button>
          {isAccessDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
              <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                EveryOne
              </button>
              <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                Only me
              </button>
            </div>
          )}
        </div>
        <select className="bg-transparent border-2 text-black px-4 py-2 rounded-lg" defaultValue="">
          <option value="" disabled>
            Status
          </option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Payment</option>
          <option value="Active">Waiting</option>
          <option value="Dormant">Working</option>
          <option value="Dissolved">Complete</option>
          <option value="delivery">Delivery</option>
          <option value="cancel">Cancel</option>
        </select>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
          onClick={() => setShowStatusChangeModal(true)}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default UpdatePageHeader;
