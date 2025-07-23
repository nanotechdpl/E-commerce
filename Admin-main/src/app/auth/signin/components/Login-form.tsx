"use client";

import icon2 from "@/../public/icons/Group.png";
import icon1 from "@/../public/icons/message.png";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import TextInput from "../../../(withLayoutC)/c/components/TextInput";
import { SignInFormValidationSchema } from "../lib/validate";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { authenticateUser } from "@/redux/fetures/auth/authSlice";
import instance from "@/api/axios";

function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useAppDispatch();
  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    setErrMsg("");

    try {
      const response = await instance.post("/admins/login", {
        email: values.email,
        password: values.password,
      });

      const data = await response.data;
      console.log("🚀 ~ handleSubmit ~ data:", data);
      if (response.status === 200) {
        localStorage.setItem("token", data.admin.token);
        localStorage.setItem("userId", data.admin.id);
        localStorage.setItem("user", JSON.stringify(data.admin));
        dispatch(authenticateUser(data.admin));
        router.push("/c/dashboard");
      } else {
        // Handle error message from the backend

        setErrMsg(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.log("Error logging in:", error);
      const err = error as any;
      if (err.response && err.response.data && err.response.data.message) {
        setErrMsg(err.response.data.message);
      } else {
        setErrMsg("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        rememberMe: false,
      }}
      validationSchema={toFormikValidationSchema(SignInFormValidationSchema)}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit }) => (
        <Form className="w-full" onSubmit={handleSubmit}>
          {errMsg && (
            <p
              className="text-center mb-2 text-red-500"
              role="alert"
              aria-live="assertive"
            >
              {errMsg}
            </p>
          )}

          <div className="flex w-[350px] flex-col gap-y-8 2xl:gap-y-[2.063rem]">
            <div className="flex items-center rounded-2xl border border-gray-300 px-4 py-2 bg-white focus-within:border-yellow-500">
              <Image
                src={icon1}
                alt="Email Icon"
                width={30}
                height={30}
                className="mr-3"
              />
              <TextInput
                id="email"
                name="email"
                placeholder="username"
                type="email"
                className="w-full focus:outline-none"
                label={""}
              />
            </div>
            <div className="flex items-center rounded-2xl border border-gray-300 px-4 py-2 bg-white focus-within:border-yellow-500">
              <Image
                src={icon2}
                alt="Password Icon"
                width={20}
                height={20}
                className="mr-3"
              />
              <TextInput
                name="password"
                type="password"
                placeholder="password"
                aria-label="Password"
                className="w-full bg-lime-50 focus:outline-none"
                label={""}
              />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm ">
            <Field name="rememberMe">
              {({ field }: any) => (
                <div className="flex gap-x-1">
                  <input
                    type="checkbox"
                    id="recall"
                    {...field} // This connects the checkbox to Formik
                    checked={field.value} // Ensure the checked state is reflected
                  />
                  <label htmlFor="recall">Remember Me</label>
                </div>
              )}
            </Field>

            <Link href="/auth/forget-password" className="text-[#ffb200]">
              Forgot Password?
            </Link>
          </div>

          <div className="flex flex-col rounded-full justify-center mt-[0.625rem] mb-[1.25rem] ">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full z-10 text-black bg-[#ffb200] hover:bg-yellow-500 rounded-2xl 2xl:px-[5.813rem] 2xl:py-[0.46rem] 2xl:text-2xl text-xl px-1 py-2 2xl:leading-[2rem] font-extrabold mt-10 inline-block transition duration-300 ${
                isSubmitting ? "text-sm opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default LoginForm;
