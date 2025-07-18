"use client";
import CustomForm from "@/components/Form/Form";
import CustomInput from "@/components/Form/Input";
import { Button, Divider, Modal } from "antd";
import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import SuccessPopUp from "./SuccessPopUp";

interface FormData {
  gmail: string;
  password: string;
  confirmPass: string;
}
interface IAdmin  {
  id: number;
  gmail: string;
  isActive: boolean;
}
const AccountChangeModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [direction, setDirection] = useState("verify");
  const [error, setError] = useState("");
  const [admins, setAdmins] = useState<IAdmin[]>([
    {
      id: 1,
      gmail: "sayed@gmail.com",
      isActive: false,
    },
    {
      id: 2,
      gmail: "almun@gmail.com",
      isActive: false,
    },
  ]);
  const showModal = () => {
    setIsModalOpen(true);
    setError("");
  };

  const handleCancel = () => {
    setDirection("verify");
    setIsModalOpen(false);
  };
  const onSubmitForm = (data: FormData) => {
    if (!data.gmail || !data.password || !data.confirmPass) {
      setError("Please Fill Up Required Field!");
      return;
    }
    if (data.password !== data.confirmPass) {
      setError("Password did not matched!");
      return;
    }
    setError("");
    setAdmins([...admins, { ...data, id: admins.length + 1, isActive: false }]);
    setDirection("success");
  };

  const handleSetActive = (checked: boolean, id: number) => {
    const targetAdmin = admins.find((admin) => admin.id === id);
    const restAdmin = admins.filter((admin) => admin.id !== id);

    setAdmins([
      ...restAdmin,
      {
        ...(targetAdmin as IAdmin),
        isActive: checked,
        id: 0,
        gmail: "",
      },
    ]);
  };

  return (
    <>
      <Button className="bg-blue-500 text-white" onClick={showModal}>
        Account Change
      </Button>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
      >
        {direction === "verify" && (
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
          <div className="pt-5">
            <div className="">
              <label htmlFor="url">Admin Login Url</label>
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 bg-yellow-200 p-2 text-black outline-1"
                  type="text"
                  name="url"
                  id="url"
                  placeholder="Enter Admin Url"
                />
                <button className="rounded bg-blue-500 p-3  uppercase text-white">
                  save
                </button>
              </div>
            </div>
            {/*  */}
            <Divider />
            <div>
              <h2 className="font-semibold">Add Admin</h2>
              <CustomForm onSubmit={onSubmitForm}>
                <CustomInput label="gmail" name="gmail" type="input" />
                <CustomInput label="password" name="password" type="password" />
                <CustomInput
                  label="confirmPass"
                  name="confirmPass"
                  type="password"
                />
                {error && <p className="mb-3 text-red">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-blue-500 px-3 py-2 text-white"
                >
                  ADD
                </button>
              </CustomForm>
            </div>

            <Divider />
            <div className="space-y-4">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center gap-2">
                  <h2 className="flex-1 rounded bg-blue-800 px-3 py-2 text-xl font-semibold text-white">
                    {admin.gmail}
                  </h2>
                  <div className="flex w-[20%] items-center gap-1">
                    <label className="flex cursor-pointer select-none items-center">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={admin.isActive}
                          onChange={(e) =>
                            handleSetActive(e.target.checked, admin.id)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`box block h-8 w-14 rounded-full ${
                            admin.isActive ? "bg-green-500" : "bg-slate-400"
                          }`}
                        ></div>
                        <div
                          className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center  rounded-full bg-white  transition ${
                            admin.isActive ? "translate-x-full" : ""
                          }`}
                        ></div>
                      </div>
                    </label>
                    <MdDelete size={30} className="text-rose-500" />
                  </div>
                </div>
              ))}
            </div>
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

export default AccountChangeModal;
