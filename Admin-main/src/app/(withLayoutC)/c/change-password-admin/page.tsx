"use client"
import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/fetures/auth/authSlice";
import TextInput from "../components/TextInput";
import Image from "next/image";
function ChangePasswordAdmin() {
  return (
    <div className=" flex flex-col items-start justify-center bg-[#FFFFFF99] rounded-3xl p-10">

      <h1 className="text-2xl font-black mb-2 text-black ">
      Password change
      </h1>


      <div className="w-full flex items-center justify-center">
        <ChangeOldPassword />
      </div>

    </div>
  );
}

const ChangeOldPasswordFormValidationSchema = z
  .object({
    currentpassword: z.string().min(1, "Current password is required"),
    newpassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmpassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newpassword === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmpassword"],
  });

type PasswordFormValues = {
  currentpassword: string;
  newpassword: string;
  confirmpassword: string;
};

function ChangeOldPassword() {
  const currentUser: any = useSelector(useCurrentUser);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    values: PasswordFormValues,
    { resetForm }: FormikHelpers<PasswordFormValues>
  ) => {
    // Clear previous messages
    setErrMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      // API call to change password
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/factory-app/auth-admin/update-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: values.currentpassword,
            newPassword: values.newpassword,
            email: currentUser.email,
          }),
        }
      );
      console.log("res:", response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      // Show success message
      setSuccessMsg("Password changed successfully!");
      resetForm();
    } catch (error) {
      setErrMsg(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" w-full  flex items-center justify-center py-4">
      <Formik
        initialValues={{
          currentpassword: "",
          newpassword: "",
          confirmpassword: "",
        }}
        validationSchema={toFormikValidationSchema(
          ChangeOldPasswordFormValidationSchema
        )}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className=" w-full flex flex-col gap-8">
            {errMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {errMsg}
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                {successMsg}
              </div>
            )}

            {/* Inputs */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center rounded-2xl border border-gray-300 px-4 py-2 bg-white focus-within:border-yellow-500">
                <Image
                  src={"/icons/lock.svg"}
                  alt="Icon"
                  width={25}
                  height={25}
                  className="mr-3"
                />
                <TextInput
                  name="currentpassword"
                  placeholder="Old Password"
                  type="password"
                  className="w-full "
                  label={""}
                />
              </div>
              <div className="flex items-center rounded-2xl border border-gray-300 px-4 py-2 bg-white focus-within:border-yellow-500">
                <Image
                  src={"/icons/lock.svg"}
                  alt="Icon"
                  width={25}
                  height={25}
                  className="mr-3"
                />
                <TextInput
                  name="newpassword"
                  placeholder="New Password"
                  type="password"
                  className="w-full "
                  label={""}
                />
              </div>
              <div className="flex items-center rounded-2xl border border-gray-300 px-4 py-2 bg-white focus-within:border-yellow-500">
                <Image
                  src={"/icons/lock.svg"}
                  alt="Icon"
                  width={25}
                  height={25}
                  className="mr-3"
                />
                <TextInput
                  name="confirmpassword"
                  placeholder="Confirm Password" type="password"
                  className="w-full "
                  label={""}
                />
              </div>
              {/* <small>Passwords should be at least 8 characters long.</small> */}
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-500 text-black px-4 py-2 text-lg font-semibold rounded-xl shadow-md hover:bg-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Continue"}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePasswordAdmin;
