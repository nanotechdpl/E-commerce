"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function OTPForm({ email }: { email: string }) {
  const router = useRouter();
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [num3, setNum3] = useState("");
  const [num4, setNum4] = useState("");
  const [num5, setNum5] = useState("");
  const [num6, setNum6] = useState("");
  // const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(120); // Countdown starts from 120 seconds

  // Countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Resend OTP handler
  const handleResend = () => {
    setTimer(120); // Reset timer
    // setErrMsg(""); // Clear error message
    // Logic to resend OTP can be added here
    console.log("Resending OTP...");
  };

  const handleSubmit = async (e:React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const otp = num1 + num2 + num3 + num4 + num5 + num6;
    console.log("Entered OTP:", otp);

    try {
      localStorage.setItem("otp", otp);
      setIsSubmitting(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admins/verify-forgot-password-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.status && data.status === 200) {
        router.push("/auth/change-password");
        setIsSubmitting(false);
      }
      setIsSubmitting(false);
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
      // setErrMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-center gap-2 mb-6">
        {[setNum1, setNum2, setNum3, setNum4, setNum5, setNum6].map(
          (setNum, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="w-12 h-12 border-2 border-gray-300 rounded-2xl text-center text-xl font-bold focus:border-blue-500 focus:outline-none"
              onChange={(e) => setNum(e.target.value)}
            />
          )
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          type="button"
          onClick={handleResend}
          disabled={timer > 0}
          className={`text-sm font-bold ${
            timer > 0
              ? "text-[#ffb200] cursor-not-allowed"
              : "text-yellow-500 hover:underline"
          }`}
        >
          Resend
        </button>
        <span className="text-sm text-gray-600">{`${Math.floor(
          timer / 60
        )}:${String(timer % 60).padStart(2, "0")}`}</span>
      </div>

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full text-3xl py-3 bg-yellow-500 text-black font-bold rounded-2xl hover:bg-yellow-600 transition duration-300"
      >
        {isSubmitting ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}

export default OTPForm;
