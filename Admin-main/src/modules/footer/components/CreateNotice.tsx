import { Input, Select } from "antd";
import { Poppins } from "next/font/google";
import React, { useEffect, useState } from "react";
import { BsArrowDown, BsTrash3 } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { FaCloudUploadAlt, FaRegFilePdf } from "react-icons/fa";
import { RxSwitch } from "react-icons/rx";
import { TiArrowUnsorted } from "react-icons/ti";
// import DateTimeSearch from "./DateTimeSearch";
import axiosInstance from "@/redux/axios";
import { uploadFile } from "@/utils/uploadFile";
// import { env } from "../../../../../config/env";
import {
  Notice,
  setNotices,
  addNotice,
  updateNotice,
  deleteNotice,
} from "@/redux/fetures/service/noticeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { toast } from "react-toastify";
import instance from "@/api/axios";
import DateTimeSearch from "@/components/ui/MergedComponents/NewCategoryComponents/DateTimeSearch";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { PiToggleRight } from "react-icons/pi";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const { Option } = Select;

const CreateNotice: React.FC = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState<string>("");
  const [totalData, setTotalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const notices = useSelector((state: RootState) => state.notice.notices);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState<Notice>({
    title: "",
    photo: "",
    date: "",
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

  const handleOpenModal = (title: string) => setModalTitle(title);

  function convertDateFormat(timestamp: string) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear() + 1; // Adding 1 year as per your output example

    return `${day}-${month}-${year}`;
  }

  const handleEdit = (id: string) => {
    const row = notices.find((notice) => notice._id === id);
    if (row) {
      setFormData(row);
      setIsEdit(true);
      handleOpenModal("Edit");
    }
  };

  const handleDeleteRow = async (id: string) => {
    try {
      const res = await instance.delete(`/notice/${id}`);
      if (res.data && res.data.success) {
        dispatch(deleteNotice(id));
        toast.success("Notice deleted successfully!");
      }
    } catch (error) {
      toast.error("Error deleting Notice");
    }
  };

   const updatedStatus = async ({
    id,
    visible,
  }: {
    id: string;
    visible: string;
  }): Promise<void> => {
    try {
      const res = await instance.put(`/notice/visible/${id}`, {
        visible,
      });
      if (res.data && res.data.success) {
        // Update the visa in Redux store
        dispatch(updateNotice(res.data.data));
        toast.success("Notice status updated successfully!");
      } else {
        toast.error(res.data?.message || "Failed to update Notice status");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Error updating Notice status"
      );
    }
  };


 

  const handleAddOrEditNotice = async () => {
    setLoading(true);
    if (isEdit) {
      try {
        const res = await instance.put(
          `/notice/${formData._id}`,
          formData
        );
        if (res.data && res.data.success) {
          dispatch(updateNotice(res.data));
          setFormData({
            title: "",
            photo: "",
            date: "",
            isDeleted: false,
          });
          toast.success("Notice updated successfully!");
        }
      } catch (error) {
        toast.error("Error updating notice");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const { title, photo, date } = formData;
        if (!title || !photo || !date) {
          toast.error("Please fill in all required fields (title, photo, date)");
          setLoading(false);
          return;
        }
        const res = await instance.post(`/notice`, formData);
        if (res.data && res.data.success) {
          dispatch(addNotice(res.data));
          toast.success("Notice added successfully!");
          setFormData({
            title: "",
            photo: "",
            date: "",
            isDeleted: false,
          });
        }
      } catch (error) {
        toast.error("Error adding notice");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSortRows = (id: number): void => {};

  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get(
          `/notice?query=${query}&limit=${limit}`
        );

        console.log("/notice", res);

        if (res.data && res.data.success) {
          dispatch(setNotices(res.data.data));
          console.log(res.data, "res.data");
          setTotalData(res.data.totalData);
        }
      } catch (error) {
        console.log("Error fetching Notice", error);
        toast.error("Error fetching Notice");
      }
    })();
  }, [query, limit, dispatch]);

  return (
    <>
      <div className="p-1">
        <div className="p-3 rounded-md overflow-x-auto">
          <DateTimeSearch onOpenModal={handleOpenModal} setQuery={setQuery} />
          <div className="rounded-t-lg overflow-hidden">
            <table className="w-full rounded-t-lg text-center border-collapse">
              <thead>
                <tr className="bg-[#FFB200] text-black font-semibold">
                  <th
                    className={`p-4 text-center border-r border-black border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                  >
                    No
                  </th>
                  <th
                    className={`p-4 text-center border-r border-black border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                  >
                    Notice Title
                  </th>
                  <th
                    className={`p-4 text-center border-r border-black border-opacity-50 whitespace-nowrap ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                  >
                    Updated Date
                  </th>
                  <th
                    className={`p-4 text-center border-r border-black border-opacity-50 whitespace-nowrap ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                  >
                    Documents
                  </th>
                  <th
                    className={`p-4 text-center whitespace-nowrap ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#ffe5b4]">
                  <td className="p-3 border-r border-black border-opacity-50"></td>
                  <td className="p-3 border-r border-black border-opacity-50">
                    <Input
                      placeholder="Title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="text-center placeholder-black"
                    />
                  </td>
                  <td className="p-3 border-r border-black border-opacity-50">
                    <input
                      type="date"
                      value={
                        formData.date
                          ? new Date(formData.date).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      className="px-4 py-2 rounded border border-gray-300 bg-white text-center w-full"
                      placeholder="MM / DD / YYYY"
                    />
                  </td>
          
                  <td className="p-3 border-r border-black border-opacity-50">
                    <div className="flex items-center justify-center">
                      {formData?.photo ? (
                        <Image
                          src={formData?.photo}
                          alt={formData?.title || "Notice Image"}
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
                            <FaCloudUploadAlt
                              className="text-gray-500 cursor-pointer"
                              size={20}
                            />
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
                    </div>
                  </td>
                  <td className="p-3">
  <button
    className="bg-orange-500 cursor-pointer text-black text-center rounded-[5px] w-22 h-6 mt-3"
    onClick={handleAddOrEditNotice}
  >
    {isEdit ? (
      <>
        {loading && <Loader2 className="animate-spin mr-2" size={20} />}
        {loading ? "Edit..." : "Edit"}
      </>
    ) : (
      <>
        {loading && <Loader2 className="animate-spin mr-2" size={20} />}
        {loading ? "Add..." : "Add"}
      </>
    )}
  </button>
</td>
                </tr>
                {notices?.map((notice, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-[#fff]" : "bg-[#FAEFD8]"
                    } md:text-base text-sm`}
                  >
                    <td className="p-3 text-center border-r border-black border-opacity-50">
                      <div className="w-[33.36px] h-[26.1px] bg-[#FFB200] mx-auto">
                        <span
                          className={`${poppins.className} font-bold text-[13.43px] leading-[20.15px] text-[#000000]`}
                        >
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`p-3 text-center border-r border-black border-opacity-50 ${poppins.className} font-normal text-[14.13px] leading-[21.2px] text-[#000000]`}
                    >
                      {notice.title}
                    </td>
                    <td
                      className={`p-3 text-center border-r border-black border-opacity-50 ${poppins.className} font-normal text-[14.13px] leading-[21.2px] text-[#000000]`}
                    >
                      {convertDateFormat(notice.date)}
                    </td>
                  
                    <td className="p-3 border-r border-black border-opacity-50">
                      <div className="flex justify-center gap-2">
                        <Image
                          src={notice.photo || "/default-notice.png"}
                          alt={notice.title || "Notice Image"}
                          width={50}
                          height={50}
                          className="rounded-full w-[50px] h-[50px] object-center object-fill"
                        />
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
                                              {notice.visible === "active" ? (
                                                <>
                                                  <button
                                                    onClick={() =>
                                                      updatedStatus({
                                                        id: notice._id || "",
                                                        visible: "inactive",
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
                                                        id: notice._id || "",
                                                        visible: "active",
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
                                                onClick={() => handleEdit(notice._id!)}
                                              >
                                                <CiEdit size={20} />
                                              </button>
                                              <button
                                                className="text-red-600 cursor-pointer"
                                                onClick={() => handleDeleteRow(notice._id!)}
                                              >
                                                <BsTrash3 size={20} />
                                              </button>
                                            </div>
                                          </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
         <div className="flex flex-col w-full items-center justify-center my-7 gap-5">
          <p className="font-inter font-semibold text-base leading-[19.36px] text-black-4">
            Showing {notices?.length || 0} of {totalData} results
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
    </>
  );
};

export default CreateNotice;
