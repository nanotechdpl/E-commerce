import React, { useRef, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import { RxCross2, RxCrossCircled } from "react-icons/rx";
import Select from "react-select";
import { Poppins } from "next/font/google";
import dynamic from "next/dynamic";
import Image from "next/image";
import { amenities, propertyType } from "@/utils/const";
import { RealEstate } from "@/redux/fetures/service/realEstateSlice";
import { Loader2 } from "lucide-react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});



interface RealEstateFormProps {
  formData: RealEstate;
  realEstateData: any[];
  onClose: () => void;
  onSave: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: (index: number) => void;
  onFormChange: (field: string, value: any) => void;
  loading: boolean;
}

const RealEstateForm: React.FC<RealEstateFormProps> = ({
  formData,
  realEstateData,
  onClose,
  onSave,
  onImageChange,
  onDeleteImage,
  onFormChange,
  loading,
}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const editorRef = useRef(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    formData.photo
  );

  const handleClick = () => hiddenFileInput.current?.click();

  const handleImageChangeWithPreview = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      onImageChange(e);
    }
  };

  const handleDeleteImageWithPreview = (index: number) => {
    setImagePreview(null);
    onDeleteImage(index);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[968px] bg-[#ccccff] p-8 rounded-lg shadow-lg mt-8">
        <div className="flex justify-end">
          <button
            className="relative -top-4 -right-2 text-gray-700 text-lg"
            onClick={onClose}
          >
            <RxCrossCircled fontSize={30} />
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-row items-center">
            <button
              className={`${poppins.className} font-semibold text-base bg-[#ffb200] w-25 h-16 rounded-[8px] disabled:cursor-not-allowed flex items-center justify-center gap-1  text-[#000000]`}
              onClick={handleClick}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : null}
              {loading ? "Uploading..." : "Photo"}
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChangeWithPreview}
              ref={hiddenFileInput}
            />
            <div className="flex flex-row gap-3 ml-4">
              {(imagePreview || formData.photo) && (
                <div className="relative w-[101px] h-20 bg-[#CCCCFF33] rounded shadow-xl">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover mt-3 mx-auto"
                      width={62}
                      height={50}
                    />
                  ) : formData.photo ? (
                    <Image
                      src={formData.photo}
                      width={62}
                      height={50}
                      alt="Preview"
                      className="object-cover mt-3 mx-auto"
                    />
                  ) : null}
                  <button
                    onClick={() => handleDeleteImageWithPreview(0)}
                    className="absolute top-0 right-0 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <BsTrash3 color="red" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            className="bg-[#ffb200] w-44 h-[45px] disabled:cursor-not-allowed rounded-lg text-[#000000] flex items-center justify-center"
            onClick={onSave}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : null}
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="flex space-x-6">
          <div className="flex flex-col w-[690px]">
            <div className="bg-white mt-6 p-2 rounded-[10px] border border-[#000000]">
              <label
                className={`${poppins.className} font-normal text-[16px] leading-[31px] text-[#00000099]`}
              >
                Description
              </label>
              <JoditEditor
                ref={editorRef}
                value={formData.description}
                config={{ height: 250 }}
                onBlur={(newContent) => onFormChange("description", newContent)}
              />
            </div>
          </div>
          <div className="w-[355px] flex gap-1 flex-col items-center">
            <span className="flex flex-col">
              <label
                className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#000000]`}
              >
                Property Type
              </label>
              <select
                className="rounded-[5px] w-[250px] border border-[#000000] bg-white p-2 outline-none cursor-pointer"
                value={formData.type}
                onChange={(e) => onFormChange("type", e.target.value)}
              >
                <option value="">Select Type</option>
                {propertyType.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </span>
            <span className="flex flex-col">
              <label
                className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#000000]`}
              >
                Property Status
              </label>
              <select
                className="rounded-[5px] w-[250px] border border-[#000000] bg-white p-2 outline-none cursor-pointer"
                value={formData.propertyStatus}
                onChange={(e) => onFormChange("propertyStatus", e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
                <option value="mortgage">Mortgage</option>
              </select>
            </span>
            <span className="flex flex-col">
              <label
                className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#000000]`}
              >
                Property Address
              </label>
              <input
                type="text"
                className="rounded-[5px] w-[250px] border border-[#000000] bg-white p-2 outline-none cursor-pointer"
                value={formData.address}
                onChange={(e) => onFormChange("address", e.target.value)}
                placeholder="Enter property address"
              />
            </span>
            <span className="flex flex-col">
              <label
                className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#000000]`}
              >
                Size/Square Feet
              </label>
              <input
                type="text"
                className="rounded-[5px] w-[250px] border border-[#000000] bg-white p-2 outline-none cursor-pointer"
                value={formData.sizeOrSquareFeet}
                onChange={(e) =>
                  onFormChange("sizeOrSquareFeet", e.target.value)
                }
                placeholder="Enter size or square feet"
              />
            </span>
            <span className="flex flex-col">
              <label
                className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#000000]`}
              >
                Beds
              </label>
              <input
                type="text"
                className="rounded-[5px] w-[250px] border border-[#000000] bg-white p-2 outline-none cursor-pointer"
                value={formData.beds}
                onChange={(e) => onFormChange("beds", e.target.value)}
                placeholder="Enter number of beds"
              />
            </span>
            <span className="flex flex-col">
              <label
                className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#000000]`}
              >
                Baths rooms
              </label>
              <input
                type="text"
                className="rounded-[5px] w-[250px] border border-[#000000] bg-white p-2 outline-none cursor-pointer"
                value={formData.bathRoom}
                onChange={(e) => onFormChange("bathRoom", e.target.value)}
                placeholder="Enter number of baths"
              />
            </span>
            <span className="flex flex-col">
              <label
                className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#000000]`}
              >
                Kithen
              </label>
              <input
                type="text"
                className="rounded-[5px] w-[250px] border border-[#000000] bg-white p-2 outline-none cursor-pointer"
                value={formData.kitchen}
                onChange={(e) => onFormChange("kitchen", e.target.value)}
                placeholder="Enter number of kitchens"
              />
            </span>
            <span className="flex flex-col">
              <label
                className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#000000]`}
              >
                Price/Budget
              </label>
              <input
                type="text"
                className="rounded-[5px] w-[250px] border border-[#000000] bg-white p-2 outline-none cursor-pointer"
                value={formData.priceOrBudget}
                onChange={(e) => onFormChange("priceOrBudget", e.target.value)}
                placeholder="Enter price or budget"
              />
            </span>
            <span className="flex flex-col">
              <label
                className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#000000]`}
              >
                Features
              </label>
              <Select
                isMulti
                options={amenities.map((type) => ({
                  value: type.value,
                  label: type.label,
                }))}
                value={
                  Array.isArray(formData.features)
                    ? amenities
                        .filter((type) =>
                          formData.features?.includes(type.value)
                        )
                        .map((type) => ({
                          value: type.value,
                          label: type.label,
                        }))
                    : []
                }
                onChange={(selected) =>
                  onFormChange(
                    "features",
                    selected ? selected.map((item) => item.value) : []
                  )
                }
                className="w-[250px]"
                classNamePrefix="react-select"
                placeholder="Select Features"
                menuPlacement="top" // <-- Add this line
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateForm;
