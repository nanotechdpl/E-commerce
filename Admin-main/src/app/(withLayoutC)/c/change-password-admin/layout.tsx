// src\app\(withLayoutC)\c\change-password-admin\layout.tsx

import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-fit max-w-[500px] mx-auto sm:py-20 relative">
      {/* <div className="w-full flex sm:flex items-center justify-center h-[27rem]">
        <div className="hidden sm:block"></div>
        <div className="bg-[#FFFFFF99] h-[30rem] w-[28rem] rounded-none sm:rounded-[8px] 2xl:py-[4.625rem] sm:px-6 py-2"> */}
          {children}
        {/* </div>
      </div> */}
    </section>
  );
}
