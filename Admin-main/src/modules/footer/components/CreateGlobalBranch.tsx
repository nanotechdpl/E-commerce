import React, { JSX, useCallback, useEffect, useRef, useState } from "react";
import { CiCircleMinus, CiEdit } from "react-icons/ci";
// import Modal from "../modal/Modal";
// import GlobalLocations from "../temp/GlobalLocations";
// import DateTimeSearch from "./NewCategoryComponents/DateTimeSearch";

import { Poppins } from "next/font/google";
import Image from "next/image";
import { TiArrowUnsorted } from "react-icons/ti";
import { RxSwitch } from "react-icons/rx";
import { BsTrash3 } from "react-icons/bs";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa6";
import { Button, Input, Select } from "antd";


import instance from "@/api/axios";
import { uploadFile } from "@/utils/uploadFile";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import {
  addBranch,
  deleteBranch,
  setBranches,
  updateBranch,
  Branch,
} from "@/redux/fetures/footer/branchSlice";
import { set } from "zod";
import { toast } from "react-toastify";
import { PiToggleRight } from "react-icons/pi";
import { Loader2 } from "lucide-react";
import DateTimeSearch from "@/components/ui/MergedComponents/NewCategoryComponents/DateTimeSearch";
import { FaCloudUploadAlt } from "react-icons/fa";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const { Option } = Select;
// Define missing functions and types
interface SocialLink {
  icon: JSX.Element;
  name: string;
  url: string;
}

const CreateGlobalBranch: React.FC = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState<string>("");
  const [totalData, setTotalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const branch = useSelector((state: RootState) => state.branch.branches);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState<Branch>({
    name: "",
    photo: "",
    address: "",
    call: "",
    email: "",
    links: [],
    isDeleted: false,
  });

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setLoading(true);
        const pic = await uploadFile(file);
        formData.photo = pic;
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = () => {
    setFormData((prev) => ({
      ...prev,
      photo: null,
    }));
  };

  const handleOpenModal = (title: string) => setModalTitle(title);

  const [socialInput, setSocialInput] = useState<SocialLink>({
    icon: <FaFacebook />,
    name: "Facebook",
    url: "",
  });

  const handleEdit = (id: string) => {
    const row = branch.find((branch) => branch._id === id);
    if (row) {
      setFormData(row);
      setIsEdit(true);
      handleOpenModal("Edit");
    }
  };

  const handleDeleteRow = async (id: string) => {
    try {
      const res = await instance.delete(`/admin/global-location/${id}`);
      if (res.data && res.data.success) {
        dispatch(deleteBranch(id));
        toast.success("Branch deleted successfully!");
      }
    } catch (error) {
      toast.error("Error deleting branch");
    }
  };

  const availableIcons: { name: string; icon: JSX.Element }[] = [
    { name: "Facebook", icon: <FaFacebook /> },
    { name: "Twitter", icon: <FaTwitter /> },
    { name: "Instagram", icon: <FaInstagram /> },
    { name: "LinkedIn", icon: <FaLinkedin /> },
  ];

  const handleAddSocialLink = (): void => {
    if (!socialInput.url) {
      handleShowModal("Please provide a valid URL.");
      return;
    }
    // Only keep name and url for backend
    setFormData((prev: any) => ({
      ...prev,
      links: [...prev.links, { name: socialInput.name, url: socialInput.url }],
    }));
    setSocialInput({ icon: <FaFacebook />, name: "Facebook", url: "" });
  };

  const handleShowModal = (title: string) => {
    setModalTitle(title);
  };

  const updatedStatus = async ({
    id,
    status,
  }: {
    id: string;
    status: string;
  }): Promise<void> => {
    try {
      const res = await instance.put(`/admin/global-location/status/${id}`, {
        status,
      });
      if (res.data && res.data.success) {
        // Update the visa in Redux store
        dispatch(updateBranch(res.data.data));
        toast.success("Branch status updated successfully!");
      } else {
        toast.error(res.data?.message || "Failed to update Branch status");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Error updating Branch status"
      );
    }
  };

  const handleAddOrEditRow = async () => {
    setLoading(true);
    if (isEdit) {
      try {
        const res = await instance.put(`/admin/global-location/${formData._id}`, formData);

        console.log("edit res: ", res);
        if (res.data && res.data.success) {
          dispatch(updateBranch(res.data.data));
          setFormData({
            name: "",
            photo: "",
            address: "",
            call: "",
            email: "",
            links: [],
            isDeleted: false,
          });
          setIsEdit(false);
          toast.success("Branch updated successfully");
        }
      } catch (error) {
        toast.error("Error updating Branch");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        console.log("formData: ", formData);
        const res = await instance.post("/admin/global-location", formData);
        console.log("add res: ", res);
        dispatch(setBranches(res.data.data)); 
        setFormData({
          name: "",
          photo: "",
          address: "",
          call: "",
          email: "",
          links: [],
          isDeleted: false,
        });
        toast.success("Branch added successfully");
      } catch (error) {
        toast.error("Error adding Branch");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get(
          `/admin/global-location?query=${query}&limit=${limit}`
        );

        console.log("/admin/global-location", res);

        if (res.data && res.data.success) {
          dispatch(setBranches(res.data.data));
          console.log(res.data, "res.data");
          setTotalData(res.data.totalData);
        }
      } catch (error) {
        console.log("Error fetching Branch", error);
        toast.error("Error fetching Branch");
      }
    })();
  }, [query, limit, dispatch]);

  const handleSortRows = (): void => {};

  return (
    <div className="p-4 mt-[0rem]">
        <div className="p-3 rounded-md overflow-x-auto">
          <DateTimeSearch onOpenModal={handleOpenModal} setQuery={setQuery} />
          <div className="rounded-t-lg  overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#FFB200] text-black font-semibold">
                  <th
                    className={`px-2 py-4 text-center border-r border-black border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                  >
                    No.
                  </th>
                  <th
                    className={`px-2 py-4 text-center border-r border-black border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                  >
                    Photo
                  </th>
                  <th
                    className={`px-2 py-4 text-center border-r border-black border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                  >
                    Name
                  </th>
                  <th
                    className={`px-2 py-4 text-center border-r border-black border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                  >
                    Email
                  </th>
                  <th
                    className={`px-2 py-4 text-center border-r border-black border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                  >
                    Call
                  </th>
                  <th
                    className={`px-2 py-4 text-center border-r border-black border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                  >
                    Address
                  </th>
                  <th
                    className={`px-2 py-4 text-center border-r border-black border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                  >
                    Social Links
                  </th>
                  <th
                    className={`px-2 py-4 text-center ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#FAEFD8]">
                  <td className="p-3 text-center border-r border-black border-opacity-50">
                    #
                  </td>
                  <td className="p-3 text-center border-r border-black border-opacity-50">
                    {formData?.photo ? (
                      <Image
                        src={formData?.photo}
                        alt="Uploaded Preview"
                        width={50}
                        height={50}
                        className="rounded-full w-[50px] h-[50px] object-center object-fill"
                      />
                    ) : (
                      <label htmlFor="upload">
                       {
                        loading ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <FaCloudUploadAlt className="text-gray-500" size={20} />
                        )
                       }
                      </label>
                    )}
                    <input
                      type="file"
                      id="upload"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </td>
                  <td className="p-3 border-r border-black border-opacity-50">
                    <Input
                      value={formData?.name}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Name"
                    />
                  </td>
                  <td className="p-3 border-r border-black border-opacity-50">
                    <Input
                      value={formData?.email}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Email"
                    />
                  </td>
                  <td className="p-3 border-r border-black border-opacity-50">
                    <Input
                      value={formData?.call}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          call: e.target.value,
                        }))
                      }
                      placeholder="Call"
                    />
                  </td>
                  <td className="p-3 border-r border-black border-opacity-50">
                    <Input
                      value={formData?.address}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Address"
                    />
                  </td>
                  <td className="p-3 text-center border-r border-black border-opacity-50">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center gap-2">
                        {formData?.links?.map((link: any, index: number) => (
                          <div
                            key={index}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          >
                            {link?.name && link?.icon}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center flex-1 gap-1 justify-center">
                        <Select
                          value={socialInput?.name}
                          onChange={(value) =>
                            setSocialInput((prev) => ({
                              ...prev,
                              name: value,
                              icon: availableIcons?.find(
                                (i) => i.name === value
                              )?.icon ?? <FaFacebook />,
                            }))
                          }
                          placeholder="Select Icon"
                          className="rounded-md"
                        >
                           {availableIcons?.map((icon) => (
                            <Option key={icon.name} value={icon?.name}>
                              {icon?.name}
                            </Option>
                          ))}
                        </Select>
                        <Input
                          value={socialInput.url}
                          onChange={(e) =>
                            setSocialInput((prev) => ({
                              ...prev,
                              url: e.target.value,
                            }))
                          }
                          placeholder="URL"
                          className="w-2/3"
                        />
                        <Button
                          onClick={handleAddSocialLink}
                          className="bg-[#ffb200] text-black"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center border-r ">
                    <button
                      className="bg-orange-500 cursor-pointer disabled:cursor-not-allowed text-black text-center rounded-[5px] w-19 h-6"
                      onClick={handleAddOrEditRow}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin mr-2" size={20} />
                      ) : null}
                      {loading ? "Add..." : "Add"}
                    </button>
                  </td>
                </tr>
                {branch && branch?.length > 0 ? (
                  branch?.map((row: any, index: any) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-[#fff]" : "bg-[#FAEFD8]"
                      } md:text-base text-sm`}
                    >
                      <td className="p-3 border-r border-black border-opacity-50 text-center">
                        <div className="w-[33.36px] h-[26.1px] bg-[#FFB200] mx-auto">
                          <span
                            className={`${poppins.className} font-bold text-[13.43px] leading-[20.15px] text-[#000000]`}
                          >
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 border-r border-black border-opacity-50 text-center">
                        <Image
                          src={row.photo}
                          alt={row.name}
                          width={50}
                          height={50}
                          className="rounded-full w-[50px] h-[50px] object-center object-fill"
                        />
                      </td>
                      <td
                        className={`p-3 text-center border-r border-black border-opacity-50 ${poppins.className} font-normal text-[15px] leading-[22.5px] text-[#000000]`}
                      >
                        {row.name}
                      </td>
                      <td
                        className={`p-3 text-center border-r border-black border-opacity-50 ${poppins.className} font-normal text-[15px] leading-[22.5px] text-[#000000]`}
                      >
                        {row.email}
                      </td>
                      <td
                        className={`p-3 text-center border-r border-black border-opacity-50 ${poppins.className} font-normal text-[15px] leading-[22.5px] text-[#000000]`}
                      >
                        {row.call}
                      </td>
                      <td
                        className={`p-3 text-center border-r border-black border-opacity-50 ${poppins.className} font-normal text-[15px] leading-[22.5px] text-[#000000]`}
                      >
                        {row.address}
                      </td>
                      <td className="p-3 text-center border-r border-black border-opacity-50">
                        <div className="flex items-center justify-center gap-2">
                          {row?.links.map((link: any, i: any) => (
                            <div
                              key={i}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                            >
                              {link.icon === "facebool" ? (
                                <FaFacebook color="#FFB200" />
                              ) : link.icon === "instagram" ? (
                                <FaInstagram color="#FFB200" />
                              ) : link.icon === "twitter" ? (
                                <FaTwitter color="#FFB200" />
                              ) : (
                                <FaLinkedin color="#FFB200" />
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center border-r border-black/20 border-opacity-50">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={handleSortRows}
                            className="text-yellow-600"
                          >
                            <TiArrowUnsorted size={20} />
                          </button>
                          {row.status === "active" ? (
                            <>
                              <button
                                onClick={() =>
                                  updatedStatus({
                                    id: row._id || "",
                                    status: "inactive",
                                  })
                                }
                                className="flex items-center cursor-pointer"
                              >
                                <PiToggleRight
                                  size={20}
                                  className="text-green-500"
                                />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  updatedStatus({
                                    id: row._id || "",
                                    status: "active",
                                  })
                                }
                                className="flex items-center cursor-pointer"
                              >
                                <PiToggleRight
                                  size={20}
                                  className="text-red-500 rotate-180"
                                />
                              </button>
                            </>
                          )}
                          <button
                            className="text-blue-600 cursor-pointer"
                            onClick={() => handleEdit(row._id!)}
                          >
                            <CiEdit size={20} />
                          </button>
                          <button
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleDeleteRow(row._id!)}
                          >
                            <BsTrash3 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>No Data Fount</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col w-full items-center justify-center my-7 gap-5">
          <p className="font-inter font-semibold text-base leading-[19.36px] text-black-4">
            Showing {branch?.length || 0} of {totalData} results
          </p>
          <div className="rounded-[10px] border-[0.89px] border-white bg-[#FFB200] text-[#231F20] font-inter font-semibold text-[13px] leading-[15.73px] py-2 px-4">
            <span>More Results</span>
            <select
              onChange={(e) => setLimit(e.target.value)}
              name=""
              id=""
              className="ml-4"
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
              <option value="96">96</option>
            </select>
          </div>
        </div>
      </div>
  );
};


export default CreateGlobalBranch;

