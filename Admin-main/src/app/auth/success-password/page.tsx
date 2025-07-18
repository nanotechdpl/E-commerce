import Image from "next/image";
import Link from "next/link";
import React from "react";
import success from "@/../public/images/password-recover.png";

function Success() {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <Image alt="success" src={success} height={200} width={200} />
      </div>
      <h1 className="text-2xl font-extrabold lg:text-2xl 2xl:text-[40px] 2xl:leading-[97.52px] mb-[13px]">
        Password Change!
      </h1>
      <p className="sm:text-[12px] 2xl:text-[18px]">
        You have successfully changed the password and now you are ready to go.
      </p>
      <Link
        href="/auth/signin"
        className="bg-[#0077B6] text-white rounded-[30px] 2xl:px-[5.813rem] 2xl:py-[1.688rem] 2xl:text-2xl text-xl px-10 py-4 2xl:leading-[3.429rem] font-extrabold mt-10 inline-block"
      >
        Continue
      </Link>
    </div>
  );
}

export default Success;
