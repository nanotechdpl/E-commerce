import React, { useRef, useState } from 'react';
import { BsTrash3 } from "react-icons/bs";
import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

interface FormData {
  photo: string | null;
  serviceType: string;
  title: string;
}

interface OrderFormProps {
  isVisible: boolean;
  formData: FormData;
  editingRow: number | null;
  onClose: () => void;
  onSave: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFormChange: (field: keyof FormData, value: any) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  isVisible,
  formData,
  editingRow,
  onClose,
  onSave,
  onImageChange,
  onFormChange,
}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(formData.photo);

  const handleClick = () => hiddenFileInput.current?.click();

  const handleLocalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      onImageChange(e);
    }
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    onFormChange('photo', null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
      <div className="bg-[#ccccff] relative p-10 rounded shadow-lg w-100%">
        <div className="flex justify-end">
          <button
            className="absolute top-2 right-4 text-gray-700 text-lg"
            onClick={onClose}
          >
            ✖
          </button>
        </div>
        <div className="mb-4 flex justify-between">
          <div className="flex flex-row items-center">
            <button
              className={`${poppins.className} font-semibold text-base bg-transparent w-20 h-10 rounded-lg text-[#000000] border border-[#FFB200]`}
              onClick={handleClick}
            >
              Photo
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleLocalImageChange}
              ref={hiddenFileInput}
            />
            {(imagePreview || formData.photo) && (
              <div className="relative flex w-24 h-18 items-center justify-center flex-row  ml-4 shadow-[4px_4px_10px_0] shadow-[#00000040]">
                <Image
                  src={imagePreview || formData.photo || ""}
                  width={50}
                  height={56}
                  alt="Preview"
                  className="mt-2 object-cover"
                />
                <button
                  onClick={handleDeleteImage}
                  className="absolute top-0 right-0 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <BsTrash3 color="red" />
                </button>
              </div>
            )}
          </div>
          <button
            className="bg-[#ffb200] w-44 h-[45px] rounded-lg text-[#000000]"
            onClick={onSave}
          >
            {editingRow !== null ? "Edit" : "Save"}
          </button>
        </div>
        <div className="flex flex-col w-150">
          <div className="flex flex-col">
            <label
              className={`${poppins.className} font-medium text-[18px] leading-[28px] text-[#00000099]`}
            >
              Service Type
            </label>
            <select
              className="rounded w-full h-12 px-3 outline-none border border-[#000000] bg-white"
              onChange={(e) => onFormChange('serviceType', e.target.value)}
              value={formData.serviceType}
            >
              <option value="" disabled>
                Select service type
              </option>
              <option value="technical">Technical</option>
              <option value="construction">Construction</option>
              <option value="visa">Visa</option>
              <option value="travelling">Travelling</option>
              <option value="export">Export</option>
              <option value="hiring">Hiring</option>
              <option value="business">Business</option>
              <option value="others">Others</option>
            </select>
          </div>

          <span className="flex flex-col">
            <label
              className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#00000099]`}
            >
              Title
            </label>
            <input
              type="text"
              className="pl-3 rounded-[5px] w-full h-14 bg-white outline-none border border-[#000000]"
              value={formData.title}
              onChange={(e) => onFormChange('title', e.target.value)}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderForm; 