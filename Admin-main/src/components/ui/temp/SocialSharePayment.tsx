/* eslint-disable @next/next/no-img-element */
"use client";
import axiosInstance from "@/redux/axios";
import { uploadFile } from "@/utils/uploadFile";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { env } from "../../../../config/env";
import instance from "@/api/axios";

interface PaymentIcon {
  _id: string;
  icon: string;
}

interface SocialLink {
  id: string;
  icon: string;
  link: string;
}

const SocialSharePayment: React.FC = () => {
  const [paymentIcons, setPaymentIcons] = useState<PaymentIcon[]>([]);

  const [socialUrl, setSocialUrl] = useState<string>("");
  const [previewPaymentIcon, setPreviewPaymentIcon] = useState<string | null>(
    null
  );
  const [icon, setIcon] = useState<string | null>(null);
  const [selectedSocialType, setSelectedSocialType] = useState<string>("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  const [sumitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = () => {
    const file = fileInputRef.current?.click();
    console.log(file);
  };

  const handlePaymentFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
       const pic = await uploadFile(file);
      setIcon(pic);
      setPreviewPaymentIcon(pic);
    }
  };

  useEffect(() => {
    const fetchPaymentIcons = async () => {
      try {
        const res = await instance.get(`/admin/payment-icon`);
        setPaymentIcons(res.data.data);
      } catch (error) {
        console.error("Error fetching payment icons:", error);
      }
    };
    const fetchSocialIcons = async () => {
      try {
        const res = await instance.get(`/admin/home/social-icons`);
        console.log(res.data.data);

        setSocialLinks(res.data.data);
      } catch (error) {
        console.error("Error fetching payment icons:", error);
      }
    };
    fetchSocialIcons();
    fetchPaymentIcons();
  }, []);

  const handleSavePaymentIcon = async () => {
    try {
      setIsSubmitting(true);
      const res = await instance.post(`/admin/payment-icon`, {
        icon,
      });
      setPaymentIcons((prev) => [...prev, res.data.data]);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);

      console.log(error);
    }
  };

  const handleDeletePaymentIcon = (id: string) => {
    setPaymentIcons(paymentIcons.filter((icon) => icon._id !== id));
  };

  const handleAddSocialLink = async () => {
    if (!selectedSocialType || !socialUrl) {
      alert("Please select a social type and enter a URL.");
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await instance.post("/admin/home/social-icons", {
        icon: selectedSocialType,
        link: socialUrl,
      });
      setSocialLinks((prev) => [...prev, res.data.data]);
      setIsSubmitting(false);
      console.log(res);
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
    }
  };

  const handleDeleteSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Payment Icon Section */}
        <h2 className="text-xl font-medium text-black mb-4">payment icon</h2>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleSelectFile}
            className="px-4 py-2 border border-[#ffa500] rounded-md bg-transparent text-black"
          >
            Select File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePaymentFileChange}
          />

          {/* Preview of selected payment icon */}
          {previewPaymentIcon && (
            <div className="w-12 h-12 flex items-center justify-center">
              <img
                src={previewPaymentIcon || ""}
                alt="Payment icon preview"
                className="h-8 object-contain"
              />
            </div>
          )}

          <button
            onClick={handleSavePaymentIcon}
            className="px-6 py-2 bg-[#ffc107] rounded-md text-black font-medium"
          >
            Save
          </button>
        </div>

        {/* Payment Icons Grid */}
        {paymentIcons.length > 0 && (
          <div className="bg-white rounded-xl p-4 mb-8">
            <div className="grid grid-cols-5 gap-4">
              {paymentIcons.map((icon) => (
                <div
                  key={icon._id}
                  className="relative bg-[#f5f5fa] rounded-md p-2 flex items-center justify-center h-16"
                >
                  <img
                    src={icon.icon || ""}
                    alt="Payment icon"
                    className="h-8 object-contain"
                  />
                  <button
                    onClick={() => handleDeletePaymentIcon(icon._id)}
                    className="absolute top-1 right-1"
                  >
                    <BiTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Social Media Section */}
        <h2 className="text-xl font-medium text-black mb-4">social media</h2>
        <div className="flex mb-6 w-[40%]">
          <select
            value={selectedSocialType}
            onChange={(e) => setSelectedSocialType(e.target.value)}
            className="px-4 py-2 rounded-l-md border-r border-gray-300 bg-white"
          >
            <option value="">Select</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="facebook">Facebook</option>
          </select>
          <input
            type="text"
            value={socialUrl}
            onChange={(e) => setSocialUrl(e.target.value)}
            placeholder="Url"
            className=" flex-1 px-4 py-2 border-l border-gray-300 bg-white"
          />
          <button
            onClick={handleAddSocialLink}
            className="px-6 py-2 bg-[#ffc107] rounded-r-md text-black font-medium"
          >
            Add
          </button>
        </div>

        {/* Social Links Grid */}
        {socialLinks.length > 0 && (
          <div className="bg-white rounded-xl p-4">
            <div className="grid grid-cols-5 gap-4">
              {socialLinks.map((link) => (
                <div
                  key={link.id}
                  className="relative bg-[#f5f5fa] rounded-md p-4 flex items-center justify-center h-16"
                >
                  <img
                    src={link.link || ""}
                    alt="Social link icon"
                    className="h-8 object-contain"
                  />{" "}
                  <button
                    onClick={() => handleDeleteSocialLink(link.id)}
                    className="absolute top-1 right-1"
                  >
                    <BiTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialSharePayment;
