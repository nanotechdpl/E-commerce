"use client";

import { useEffect, useState } from "react";
import OTPForm from "./components/otp-form";

function Verification() {
  const [email, setEmail] = useState("");
  const [value, setValue] = useState<string>("")

  useEffect(() => {
    const emailFromStorage = localStorage.getItem("email") || "";
    setValue(emailFromStorage);
    console.log(value);
    setEmail(emailFromStorage);
  }, [value]);

  return (
    <section className="text-center">
      <div
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] sm:w-[60%] sm:h-[60%] md:w-[70%] md:h-[70%] lg:w-[729px] lg:h-[729px] lg:top-[-70px] lg:left-[-290px] rounded-full z-0 opacity-50 lg:opacity-100"
        style={{
          background:
            "linear-gradient(147.77deg, #DE9F0C 40.22%, #FFC72C 78.06%)",
        }}
      ></div>
      <div
        className="absolute bottom-[10%] left-[20%] w-[20%] h-[20%] md:w-[25%] md:h-[25%] lg:w-[192px] lg:h-[193px] lg:bottom-[200px] lg:left-[250px] rounded-full z-0 opacity-50 lg:opacity-100 hidden sm:block"
        style={{
          background:
            "linear-gradient(147.77deg, #DE9F0C 34.81%, #FFB200 85.62%)",
        }}
      ></div>
      <div
        className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] md:w-[35%] md:h-[35%] lg:w-[354px] lg:h-[354px] lg:bottom-[-40px] lg:left-[-80px] rounded-full z-0 opacity-50 lg:opacity-100"
        style={{
          background:
            "linear-gradient(147.77deg, #DE9F0C 38.78%, #FFB200 85.62%)",
        }}
      ></div>
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] md:w-[45%] md:h-[45%] lg:w-[354px] lg:h-[354px] lg:bottom-[-150px] lg:right-[-150px] rounded-full z-0 opacity-50 lg:opacity-100"
        style={{
          background:
            "linear-gradient(147.77deg, #DE9F0C 38.78%, #FFB200 85.62%)",
        }}
      ></div>
      <header className="mb-10 text-black p-2 text-left">
        <h1 className="text-xl text-left font-extrabold lg:text-4xl 2xl:text-[40px] 2xl:leading-[54px] mb-[13px]">
          Verification!
        </h1>
        <p className="text-sm text-left">
          We have sent a 4 digit verification code on{" "}
          <span className="font-bold text-left flex justify-center items-center gap-x-2">
            ( {email} )
          </span>
        </p>
      </header>

      <main>
        <OTPForm email={email} />
      </main>
    </section>
  );
}

export default Verification;
