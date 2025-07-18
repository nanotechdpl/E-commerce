import Image from "next/image";
import React from "react";

const buttonStylered = "bg-rose-700 text-white p-2 rounded-md m-1";

const buttonStyleGreen = "bg-green-700 text-white p-2 rounded-md m-1";
interface planProps {
  id: number;
  value: any;
  sendData: (id: number) => void;
}
const Plan: React.FC<planProps> = ({ id, value, sendData }) => {
  return (
    <>
      <div className="border-gray-200 flex items-center border-b py-3">
        <div className="flex-none">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png"
            width={30}
            height={30}
            className="mt-3"
            alt="Facebook Logo"
          />
        </div>

        <div className="flex-grow">
          <li className="text-dark my-2 p-2 shadow">{value}</li>
        </div>

        <div className="flex-none">
          <button
            className={buttonStyleGreen}
            onClick={() => {
              sendData(id);
            }}
          >
            Delete
          </button>
          <button
            className={buttonStylered}
            onClick={() => {
              sendData(id);
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </>
  );
};

export default Plan;
