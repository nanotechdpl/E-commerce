import React, { useRef, useState } from "react";
import Image from "next/image";
import { BsCloudUpload, BsTrash3 } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { Poppins } from "next/font/google";
import { env } from "../../../../config/env";
import axiosInstance from "@/redux/axios";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500"],
});

interface FormData {
  files: File[];
  title: string;
  tag: string;
}

const MAX_UPLOAD_LIMIT = 3;

const BannerLogoPage: React.FC = () => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    files: [],
    title: "",
    tag: "",
  });

  const handleFileInputClick = () => hiddenFileInput.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files);
      const updatedFiles = [...formData.files, ...uploadedFiles];
      if (updatedFiles.length > MAX_UPLOAD_LIMIT) {
        alert(`You can upload a maximum of ${MAX_UPLOAD_LIMIT} files.`);
        return;
      }
      setFormData((prev) => ({ ...prev, files: updatedFiles }));
    }
  };

  const handleDeleteFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    console.log("Form Data Submitted banner data:", formData);
    axiosInstance
      .post(
        `${env.NEXT_PUBLIC_API_URL}/api/v1/factory-app/home/banner/add`,
        formData
      )
      .then((res) => {
        console.log("Response:", res.data);
        alert("Form data saved successfully!");
      });
  };

  return (
    <div
      className={`${poppins.className} flex items-center justify-center min-h-screen bg-gray-50 p-4`}
    >
      <div className="w-full max-w-3xl   bg-white rounded-lg shadow-lg p-6">
        {/* Main Banner Section */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Website Banner
          </h2>
          <p className="text-gray-600 mb-6">
            <span className="font-semibold">Select</span> Banner{" "}
            <span className="font-semibold">Image/Video</span>
          </p>
          <div
            className="relative w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={handleFileInputClick}
          >
            {formData.files.length > 0 ? (
              <>
                {formData.files[0].type.startsWith("image/") ? (
                  <Image
                    src={URL.createObjectURL(formData.files[0])}
                    alt="Banner Preview"
                    className="rounded-lg object-cover"
                    layout="fill"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(formData.files[0])}
                    className="rounded-lg object-cover"
                    controls
                    width="100%"
                    height="100%"
                  />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(0);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <BsTrash3 size={16} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <BsCloudUpload size={40} />
                <p className="mt-2 text-sm">Upload Image/Video</p>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={hiddenFileInput}
            style={{ display: "none" }}
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Form Section */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Title
            </label>
            <textarea
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FFB200] focus:border-transparent"
              rows={3}
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Tag
            </label>
            <textarea
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FFB200] focus:border-transparent"
              rows={5}
              value={formData.tag}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tag: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Additional Files Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Select Menu Banner Image/Video
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formData.files.slice(1).map((file, index) => (
              <div
                key={index}
                className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden"
              >
                {file.type.startsWith("image/") ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`File ${index + 1}`}
                    className="rounded-lg object-cover"
                    layout="fill"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    className="rounded-lg object-cover"
                    controls
                    width="100%"
                    height="100%"
                  />
                )}
                <button
                  onClick={() => handleDeleteFile(index + 1)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <IoClose size={14} />
                </button>
              </div>
            ))}
            {/* {formData.files.length < MAX_UPLOAD_LIMIT && (
              <div
                className="flex items-center justify-center bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={handleFileInputClick}
              >
                <ImageUploadIcon />
              </div>
            )} */}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            className="bg-[#FFB200] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#FFC233] transition-colors"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerLogoPage;
