"use client";

import Image from "next/image";
import { SetStateAction } from "react";

// import { Poppins } from "next/font/google";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["600"],
// });

const CallPopUp = ({ setIsCallPopUp }: { setIsCallPopUp: React.Dispatch<SetStateAction<boolean>>; }) => {

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="relative flex min-h-[300px] min-w-[250px] flex-col items-center justify-between bg-[#ECEEF1] rounded-xl p-5 z-30 mb-12">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src="/images/user.png"
            height={60}
            width={60}
            alt="user"
            className="rounded-full"
          />
          <h2 className="text-xl font-semibold">Richard Poon</h2>
          <h3>Web App</h3>
          {/* <h4>02:02:01</h4> */}
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-[28.59px] h-[28.59px] rounded-full bg-[#2A56EBE5] border-[0.17px] border-[#ECEEF1]">
            <Image
              src={"/icons/mic.png"}
              height={11.74}
              width={8.51}
              alt="mic"
              className="object-contain"
            />
          </div>
          {/* <Image src={recordImg} height={40} width={40} alt="user" /> */}
          <Image
            onClick={() => setIsCallPopUp(false)}
            src={"/icons/end-call.png"}
            height={28.59}
            width={28.59}
            alt="end-call"
            className="object-contain"
          />
          <div className="w-[28.59px] h-[28.59px] rounded-full bg-[#2A56EBE5] border-[0.17px] border-[#ECEEF1]">
            <Image
              src={"/icons/speaker.png"}
              height={11.74}
              width={8.51}
              alt="user"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallPopUp;
