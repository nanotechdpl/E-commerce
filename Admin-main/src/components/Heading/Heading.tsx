import React, { useState } from "react";

interface HeadingProps {
  title: string;
  status: string;
  onStatusChange: (newStatus: string) => void;
  onInfoClick: () => void;
}

const Heading: React.FC<HeadingProps> = ({
  title,
  status,
  onStatusChange,
  onInfoClick,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex items-center">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="mr-4 px-3 py-1 bg-gray-200 rounded-md"
        >
          {status}
        </button>
        {dropdownOpen && (
          <ul className="absolute bg-white shadow-lg rounded-md mt-1">
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onStatusChange("Pending Page View")}
            >
              Pending Page View
            </li>
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onStatusChange("Payment Page View")}
            >
              Payment Page View
            </li>
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onStatusChange("Complete Page View")}
            >
              Complete Page View
            </li>
          </ul>
        )}
        <button
          onClick={onInfoClick}
          className="px-3 py-1 bg-gray-200 rounded-md"
        >
          i
        </button>
      </div>
    </div>
  );
};

export default Heading;
