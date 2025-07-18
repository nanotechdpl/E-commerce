import type { ImageRes } from "@/app/(withLayoutC)/c/home/actions";
import { Poppins } from "next/font/google";
import Image from "next/image";
import type React from "react";
import { useRef, useState } from "react";
import { BsCloudUpload, BsTrash3 } from "react-icons/bs";
import { env } from "../../../../config/env";
import instance from "@/api/axios";
import { uploadFile } from "@/utils/uploadFile";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

const SupportIcon: React.FC = () => {
  const [mapImage, setMapImage] = useState<File | null>(null);
  const [supportLogo, setSupportLogo] = useState<File | null>(null);
  const [loadingMap, setLoadingMap] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);

  const mapFileInput = useRef<HTMLInputElement>(null);
  const logoFileInput = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{ link: string; isMap: boolean }>({
    link: "",
    isMap: false,
  });

  const handleMapFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
       
        setLoadingMap(true);
        const pic = await uploadFile(file);
         setMapImage(file);
        formData.link = pic || "";
        formData.isMap = true;
      }
    } catch (error) {
      setLoadingMap(false);
      toast.error("Error uploading map");
    } finally {
      setLoadingMap(false);
    }
  };

  const handleLogoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setSupportLogo(file);
        setLoadingLogo(true);
        const pic = await uploadFile(file);
        formData.link = pic || "";
        formData.isMap = false;
      }
    } catch (error) {
      setLoadingLogo(false);
      toast.error("Error uploading logo");
    } finally {
      setLoadingLogo(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await instance.post("/admin/home/support-icons", formData);
      if (res.data.data.isMap) {
        toast.success("Map image saved successfully");
        setMapImage(null);
        
      }
      if (!res.data.data.isMap) {
        toast.success("Logo image saved successfully");
        setSupportLogo(null);
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMapImage = () => setMapImage(null);
  const handleDeleteSupportLogo = () => setSupportLogo(null);

  const handleMapSelectClick = () => {
    mapFileInput.current?.click();
  };

  const handleLogoSelectClick = () => {
    logoFileInput.current?.click();
  };

  return (
    <div className="w-[1033px] mt-4 bg-white rounded-[32px] min-h-[702px] flex flex-col items-center justify-center mx-auto">
      {/* Map Section */}
      <div className="mb-10 w-full max-w-2xl">
        <h2
          className={`${poppins.className} font-normal text-xl text-center text-[#000000] mb-2`}
        >
          Map
        </h2>
        <div className="flex justify-center">
          <div className="flex items-center justify-between w-[50%]">
            <div className="flex flex-col">
              <div
                className="relative flex items-center justify-center w-26 h-20 bg-[#CCCCFF33] shadow-md rounded-lg cursor-pointer"
                onClick={handleMapSelectClick}
              >
                {mapImage ? (
                  <>
                    <Image
                      width={100}
                      height={100}
                      src={URL.createObjectURL(mapImage) || "/placeholder.svg"}
                      alt="Map Preview"
                      className="rounded-lg object-cover w-full h-full"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMapImage();
                      }}
                      className="absolute top-2 right-2 bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <BsTrash3 size={14} />
                    </button>
                  </>
                ) : (
                  <BsCloudUpload size={40} className="text-gray-400" />
                )}
              </div>
              <p
                className={`${poppins.className} font-semibold text-base text-center text-[#0F0000] mt-2`}
              >
                Select photo
              </p>
            </div>

            <input
              type="file"
              ref={mapFileInput}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleMapFileChange}
            />

            <div className="flex">
              <button
                onClick={handleSubmit}
                className={`${poppins.className} font-normal text-[16px] leading-[24.8px] bg-[#FFB200] text-[#000000] w-[95px] h-[48px] rounded-[8px]`}
                disabled={loadingMap}
              >
                {loadingMap ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : null}
                {loadingMap ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Support Logos Section */}
      <div className="mb-10 w-full max-w-2xl">
        <h2
          className={`${poppins.className} font-normal text-xl text-center text-[#000000] mb-2`}
        >
          Company Support Logo
        </h2>
        <div className="flex justify-center">
          <div className="flex items-center justify-between w-[50%]">
            <div className="flex flex-col">
              <div
                className="relative flex items-center justify-center w-26 h-20 bg-[#CCCCFF33] shadow-md rounded-lg cursor-pointer"
                onClick={handleLogoSelectClick}
              >
                {supportLogo ? (
                  <>
                    <Image
                      width={100}
                      height={100}
                      src={
                        URL.createObjectURL(supportLogo) || "/placeholder.svg"
                      }
                      alt="Support Logo Preview"
                      className="rounded-lg object-cover w-full h-full"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSupportLogo();
                      }}
                      className="absolute top-2 right-2 bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <BsTrash3 size={14} />
                    </button>
                  </>
                ) : (
                  <BsCloudUpload size={40} className="text-gray-400" />
                )}
              </div>
              <p
                className={`${poppins.className} font-semibold text-base text-center text-[#0F0000] mt-2`}
              >
                Select photo
              </p>
            </div>

            <input
              type="file"
              ref={logoFileInput}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleLogoFileChange}
            />

            <div className="flex">
              <button
                onClick={handleSubmit}
                className={`${poppins.className} font-normal text-[16px] leading-[24.8px] bg-[#FFB200] text-[#000000] w-[95px] h-[48px] rounded-[8px]`}
                disabled={loadingLogo}
              >
                {loadingLogo ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : null}
                {loadingLogo ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportIcon;
