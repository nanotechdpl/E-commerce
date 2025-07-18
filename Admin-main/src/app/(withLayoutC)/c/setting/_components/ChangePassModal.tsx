"use client";
import CustomForm from "@/components/Form/Form";
import CustomInput from "@/components/Form/Input";
import { Button, Modal } from "antd";
import { useState } from "react";
import SuccessPopUp from "./SuccessPopUp";

const ChangePassModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [direction, setDirection] = useState("changePass");
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setDirection("changePass");
    setIsModalOpen(false);
  };
  const onSubmitForm = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <Button className="bg-blue-500 text-white" onClick={showModal}>
        Change Password
      </Button>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={500}
        centered
      >
        {direction === "changePass" && (
          <div className=" space-y-5 text-center">
            <h1 className=" bg-blue-700  p-3 text-2xl text-white">
              Change Your Password
            </h1>
            <span>Please Enter Your New Password</span>
            <CustomForm onSubmit={onSubmitForm}>
              <CustomInput
                type="password"
                name="currentPassword"
                label="Current Password"
              />
              <CustomInput
                type="password"
                name="newPass"
                label="New Password"
              />
              <CustomInput
                type="password"
                name="repeatNewPass"
                label="Repeat New Password"
              />
              <button
                onClick={() => setDirection("success")}
                className="w-full bg-blue-500 px-3 py-2 text-white"
              >
                Change Password
              </button>
            </CustomForm>
            <p className="cursor-pointer text-blue-400" onClick={handleCancel}>
              Cancel
            </p>
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

export default ChangePassModal;
