"use client";
import Image from "next/image";
import sucImg from "/public/images/check.png";

const SuccessPopUp = ({ title, onClick }: { title: string; onClick?: any }) => {
  return (
    <div className="space-y-4 text-center">
      <Image
        src={sucImg}
        height={100}
        width={100}
        className="mx-auto"
        alt="success"
      />
      <h2 className="text-xl font-semibold">Success!</h2>
      <p>{title}</p>
      <button
        onClick={onClick}
        className="w-full  bg-green-500 px-3 py-2 font-semibold text-white"
      >
        Done
      </button>
    </div>
  );
};

export default SuccessPopUp;
