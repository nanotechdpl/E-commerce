import Link from "next/link";
import React from "react";

function Success() {
  return (
    <div className="flex flex-col items-center justify-center self-center">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold lg:text-2xl 2xl:text-[40px] 2xl:leading-[97.52px] mb-[13px]">
          Login Successfully!
        </h1>
        <p className="sm:text-[10px] 2xl:text-[18px]">
          You have successfully login your details and now you are ready to go.
        </p>
        <Link
          href="/c/dashboard"
          className="bg-[#0077B6] text-white rounded-[30px] 2xl:px-[5.813rem] 2xl:py-[0.86rem] 2xl:text-2xl text-xl px-10 py-4 2xl:leading-[3.429rem] font-extrabold mt-10 inline-block"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}

export default Success;
