"use client";

import { Button, Input, Modal, Select } from "antd";
import { Option } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BiCloudUpload } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
const AddBank = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currencies, setCurrencies] = useState<string[]>(["USD", "EUR"]);
  const [newCurrency, setNewCurrency] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddCurrency = () => {
    if (newCurrency && !currencies.includes(newCurrency)) {
      setCurrencies([...currencies, newCurrency]);
      setNewCurrency("");
    }
  };

  const [text, setText] = useState("");

  const handleChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleRemoveCurrency = (currency: string) => {
    setCurrencies(currencies.filter((cur) => cur !== currency));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="">
      <Button
        onClick={showModal}
        style={{ background: "#FFB200", color: "#000000" }}
        type="primary"
        size={"middle"}
      >
        Add Bank Wallet
      </Button>
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={800}
        centered
      >
        <div className="w-full bg-[#ccccff] p-4 rounded-md">
          {/* Header Section */}
          <div className="flex items-center space-x-4 mb-6">
            <Input
              type="text"
              placeholder="Payment Method Name"
              className="rounded-full w-80 py-2"
            />
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer flex items-center space-x-2">
                <BiCloudUpload size={18} />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleImageUpload(e, setLogo)}
                />
                Logo
              </label>
              {logo && <Image src={logo} alt="Logo Preview" width={50} />}
            </div>
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer flex items-center space-x-2">
                <BiCloudUpload size={18} />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleImageUpload(e, setQrCode)}
                />
                QR Code
              </label>
              {qrCode && (
                <Image src={qrCode} alt="QR Code Preview" width={50} />
              )}
            </div>
            <div className="flex justify-center align-center">
              <h5>Tax Rate</h5>
              <Input
                type="text"
                placeholder="00%"
                className="w-20 text-center text-black  bg-[#fff]"
              />
            </div>
            <button className="rounded p-2 bg-green-7000 text-white">
              Save
            </button>
          </div>

          {/* Main Content Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Account Info */}
            <div className="border p-4 text-black rounded-md bg-white ">
              <h5 className="mb-2">Account Info</h5>
              <textarea
                className="w-full h-40 rounded-md p-2 border border-gray-300 text-black  bg-[#fff]  focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter account information..."
                value={text}
                onChange={handleChangeText}
              ></textarea>
            </div>

            {/* Currency Support */}
            <div className="">
              <div className="flex justify-between text-black">
                <h5>Currency Support</h5>
                <div className="">
                  <Select
                    value={newCurrency}
                    onChange={(value) => setNewCurrency(value)}
                    style={{ width: "150px" }}
                  >
                    <Option values="USD">USD</Option>
                    <Option values="EUR">EUR</Option>
                    <Option values="GBP">GBP</Option>
                  </Select>
                  <Button
                    onClick={handleAddCurrency}
                    style={{ background: "#FFB200", color: "#000000" }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="border p-4 rounded-md text-black bg-white ">
                <div className="flex flex-wrap items-start gap-2 ">
                  {currencies.map((currency, index) => (
                    <span
                      key={index}
                      className="flex justify-start bg-gray-200 rounded-full px-3 py-1 h-40"
                    >
                      {currency}
                      <IoCloseOutline
                        onClick={() => handleRemoveCurrency(currency)}
                        className="ml-2 text-red-500 cursor-pointer"
                        color="red"
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddBank;
