

import React, { useEffect, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { TiArrowUnsorted } from "react-icons/ti";
// import DateTimeSearch from "./DateTimeSearch";
import { Poppins } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { uploadFile } from "@/utils/uploadFile";
import Image from "next/image";

import { toast } from "react-toastify";
import {
   setBlogs, addBlog, updateBlog, deleteBlog, Blog
} from "@/redux/fetures/service/blogSlice";
import instance from "@/api/axios";
import { PiToggleRight } from "react-icons/pi";
import DateTimeSearch from "@/components/ui/MergedComponents/NewCategoryComponents/DateTimeSearch";
import CreateBlogForm from "./CreateBlogForm";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const CreateBlog = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState<string>("");
  const [totalData, setTotalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const blog = useSelector(
    (state: RootState) => state.blog.blogs
  );
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<Blog>({
    photo: "",
    title: "",
    description: "",
    tag: "",
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

  const handleCloseModal = () => {
    setModalTitle(null);
    setFormData({
      photo: "",
      title: "",
      description: "",
      tag: "",
      isDeleted: false,
    });
    setIsEdit(false);
  };

  const updatedStatus = async ({
    id,
    status,
  }: {
    id: string;
    status: string;
  }): Promise<void> => {
    try {
      const res = await instance.put(`/blog/status/${id}`, {
        status,
      });
      if (res.data && res.data.success) {
        // Update the visa in Redux store
        dispatch(updateBlog(res.data.data));
        toast.success("Blog status updated successfully!");
      } else {
        toast.error(res.data?.message || "Failed to update Blog status");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Error updating Blgo status"
      );
    }
  };

    const handleSave = async () => {
    if (
      !formData.title ||
      !formData.photo ||
      !formData.description
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    setLoading(true);
    if (isEdit) {
      try {
        const res = await instance.put(
          `/blog${formData._id}`,
          formData
        );
        
        if (res.data && res.data.success) {
           dispatch(updateBlog(res.data.data));
          setFormData({
            photo: "",
            title: "",
            isDeleted: false,
            description: "",
            tag: "",
          });
          setIsEdit(false);
          setModalTitle(null);
          toast.success("Blog updated successfully!");
        }
      } catch (error) {
        toast.error("Error updating visa");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await instance.post("/blog", formData);
        if (res.data && res.data.success) {
         dispatch(addBlog(res.data));
          setFormData({
            photo: "",
            title: "",
            isDeleted: false,
            description: "",
            tag: "",
          });
          setIsEdit(false);
          setModalTitle(null);
          toast.success("Blog created successfully!");
        }
      } catch (error) {
        toast.error("Error creating visa");
      } finally {
        setLoading(false);
      }
    }
  };



  const handleEdit = (id:string) => {
    const row = blog.find((blog) => blog._id === id);
    if (row) {
      setFormData(row);
      setIsEdit(true);
      handleOpenModal("Edit");
    }
  };

  const handleSortRows = (): void => {};

  const handleDeleteRow = async (id: string) => {
    try {
      const res = await instance.delete(`/blog/${id}`);
      if (res.data && res.data.success) {
        dispatch(deleteBlog(id));
        toast.success("Blog deleted successfully!");
      }
    } catch (error) {
      toast.error("Error deleting Blog");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get(
          `/blog?query=${query}&limit=${limit}`
        );

        if (res.data && res.data.success) {
          dispatch(setBlogs(res.data.data));
          console.log(res.data, "res.data");
          setTotalData(res.data.totalData);
        }
      } catch (error) {
        console.log("Error fetching data", error);
        toast.error("Error fetching data");
      }
    })();
  }, [query, limit, dispatch]);

  return (
    <div className="p-2">
      {/* Table */}
      <div className="overflow-x-auto  mt-4">
        <DateTimeSearch
          title="Create Blog"
          onOpenModal={handleOpenModal}
          setQuery={setQuery}
        />
        <div className="rounded-t-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFB200] rounded-t-lg text-black font-semibold">
                <th
                  className={`px-2 py-4 text-center  border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  No.
                </th>
                <th
                  className={`px-2 py-4 text-center  border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Photo
                </th>
                <th
                  className={`px-2 py-4 text-center  border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Title
                </th>
                <th
                  className={`px-2 py-4 text-center  border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Tag
                </th>

                <th
                  className={`px-2 py-4 text-center  ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {blog?.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-[#FAEFD8]" : "bg-[#fff]"
                  } md:text-base text-sm`}
                >
                  <td className="p-3 text-center border-r border-black/20 border-opacity-50">
                    <div className="w-[26.1px] rounded-md h-[26.1px] bg-[#FFB200] mx-auto">
                      <span
                        className={`${poppins.className} font-bold text-[13.43px] leading-[20.15px] text-[#000000]`}
                      >
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center mx-auto border-r border-black/20 border-opacity-50">
                    <Image
                      src={
                        row?.photo && row.photo.startsWith("http")
                          ? row.photo
                          : "/placeholder.png" // Use a valid placeholder image in your public folder
                      }
                      width={70}
                      height={50}
                      alt="image"
                      className="rounded-md w-[70px] h-[70px] object-fill"
                    />
                  </td>
                  <td
                    className={`p-3 text-left border-r border-black/20 border-opacity-50 ${poppins.className} font-medium text-[14.13px] leading-[21.2px] text-[#000000]`}
                  >
                    {row?.title}
                  </td>
                 
                  <td
                    className={`p-3 text-left border-r border-black/20 border-opacity-50 ${poppins.className} font-medium text-[14.13px] leading-[21.2px] text-[#000000]`}
                  >
                    {row?.tag}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalTitle && (
        <CreateBlogForm
          formData={formData}
          blog={blog}
         onClose={handleCloseModal}
          onSave={handleSave}
          onImageChange={handleImageChange}
          onDeleteImage={handleDeleteImage}
          onFormChange={(field, value) =>
            setFormData((prev) => ({ ...prev, [field]: value }))
          }
          loading={loading}
        />
      )}

      <div className="flex flex-col w-full items-center justify-center my-7 gap-5">
        <p className="font-inter font-semibold text-base leading-[19.36px] text-black-4">
          Showing {blog?.length || 0} of {totalData} results
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

export default CreateBlog;
