"use client";
import CustomForm from "@/components/Form/Form";
import CustomInput from "@/components/Form/Input";
import { Button, Modal } from "antd";
import { useState } from "react";
import SuccessPopUp from "./SuccessPopUp";

const ForgotPassModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [direction, setDirection] = useState("forgotPassword");
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setDirection("forgotPassword");
    setIsModalOpen(false);
  };
  const onSubmitForm = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <Button className="bg-blue-500 text-white" onClick={showModal}>
        Forget Password
      </Button>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={500}
        centered
      >
        {direction === "forgotPassword" && (
          <div>
            <div className="space-y-3 bg-slate-300 p-10 text-center">
              <h2 className="text-xl font-semibold">Verify it is you</h2>
              <p>
                We have sent a verification code in your email <br />{" "}
                n*****@*******.com
              </p>
              <p>Enter the code from the email in the field below</p>
              <form className="mx-auto w-1/2">
                <input
                  type="text"
                  name="code"
                  className="w-full p-2 outline-none"
                />
                <Button
                  onClick={() => setDirection("newPassword")}
                  className="mx-auto mt-3"
                >
                  Verify
                </Button>
              </form>
            </div>
            <div className="mt-3 text-center">
              <p>
                Did not recive an email?
                <br />
                <span className="cursor-pointer text-blue-400">Try Again </span>
                Or
                <span className="cursor-pointer text-blue-400"> Cancel</span>
              </p>
            </div>
          </div>
        )}
        {direction === "newPassword" && (
          <div>
            <CustomForm onSubmit={onSubmitForm}>
              <CustomInput type="password" name="password" label="Password" />
              <CustomInput
                type="password"
                name="ConfirmPassword"
                label="Confirm Password"
              />
              <button
                onClick={() => setDirection("success")}
                className="w-full bg-blue-500 px-3 py-2 text-white"
              >
                Submit
              </button>
            </CustomForm>
          </div>
        )}
        {direction === "success" && (
          <SuccessPopUp
            title="Your Password Has Been Changed!"
            onClick={handleCancel}
          />
        )}
      </Modal>
    </>
  );
};

export default ForgotPassModal;
