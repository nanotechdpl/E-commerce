"use client";
import ICTable from "@/components/ui/ICTable";
import {
  removeAdmin,
  statusChange,
  updateAdmin,
  type Admin,
} from "@/redux/fetures/admin/adminSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { Button, Image, Input, Switch, message } from "antd";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import AddSubAdminModal from "./_components/AddSubAdmin";
import { RootState } from "@/redux/store/store";
import { changeStatus, getAllAdmin } from "./action";
import { uploadFile } from "@/utils/uploadFile";
import { toast } from "react-toastify";

const AdminListPage = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [hideSensitive, setHideSensitive] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<Admin>>({});
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const adminDatas = useAppSelector(
    (state: RootState) => state?.admin?.allAdmins
  );
  useAppSelector((state: RootState) => console.log(state?.admin));

  const handleStatusChange = async (id: string, active: boolean) => {
    changeStatus(id, active);
    dispatch(statusChange({ id, active }));
  };

  const handleDeleteAdmin = (id: string) => {
    dispatch(removeAdmin({ id }));
    message.open({
      type: "success",
      content: "Admin deleted successfully",
    });
  };

  const handleEdit = (data: Admin) => {
    setEditingId(data.sl);
    setEditedData({ ...data });
  };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setLoading(true);
          const pic = await uploadFile(file);
          // formData.photo = pic;
        }
      } catch (error) {
        setLoading(false);
        toast.error("Error uploading image");
      } finally {
        setLoading(false);
      }
    };

  const handleSave = (id: string) => {
    dispatch(updateAdmin({ id, data: editedData }));
    setEditingId(null);
    message.open({
      type: "success",
      content: "Admin updated successfully",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleChange = (field: keyof Admin, value: string) => {
    setEditedData((prev: Partial<Admin>) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    dispatch(getAllAdmin());
  }, [dispatch]);

  const columns = [
    {
      title: "No",
      dataIndex: "sl",
      render: (text: string) => (
        <div className="bg-[#FFB200] px-2 font-bold">{text}</div>
      ),
    },
    {
      title: "Photo",
      dataIndex: "photo",
      render: (text: string, record: Admin) => (
        <Image
          src={text || "/placeholder.svg"}
          alt="admin photo"
          width={50}
          height={50}
          style={{ objectFit: "contain" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: Admin) =>
        editingId === record.sl ? (
          <Input
            value={editedData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        ) : (
          text
        ),
    },

    {
      title: "Gmail",
      dataIndex: "email",
      render: (text: string, record: Admin) =>
        editingId === record.sl ? (
          <Input
            value={editedData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        ) : hideSensitive ? (
          "*****@*****.com"
        ) : (
          text
        ),
    },
    {
      title: "Login URL",
      dataIndex: "url",
      render: (text: string, record: Admin) =>
        editingId === record.sl ? (
          <Input
            value={editedData.url || ""}
            onChange={(e) => handleChange("url", e.target.value)}
          />
        ) : hideSensitive ? (
          "***"
        ) : (
          text
        ),
    },
   
    {
      title: "Access",
      dataIndex: "accessList",
    },
    {
      title: "Action",
      render: (data: Admin) => {
        return (
          <div className="flex items-center justify-around">
            <Switch
              style={{
                background: data?.active ? "green" : "gray",
                marginRight: "2px",
              }}
              size="small"
              checked={data.active}
              onChange={(checked) => handleStatusChange(data.email, checked)}
            />
            {editingId === data.sl ? (
              <>
                <Button onClick={() => handleSave(data.sl)}>Save</Button>
                <Button onClick={handleCancelEdit}>Cancel</Button>
              </>
            ) : (
              <CiEdit
                className="cursor-pointer"
                size={24}
                onClick={() => handleEdit(data)}
              />
            )}
            <RiDeleteBin5Line
              size={18}
              className="cursor-pointer"
              color="red"
              onClick={() => handleDeleteAdmin(data.sl)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 2xl:p-10 text-center">
      <div className="flex item-center justify-end  mb-3 text-black gap-3">
        <AddSubAdminModal />
      </div>

      <div className="overflow-x-auto rounded-t-lg">
        <table className="table-auto w-full rounded border-collapse">
          <thead className="bg-[#FFB200] text-sm rounded-full">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="text-[#231F20] font-semibold px-2 py-4"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center text-black">
            {adminDatas?.map((admin: Admin, rowIndex: number) => (
              <tr key={rowIndex} className="odd:bg-[#FAEFD8] even:bg-white">
                <td className="py-3 border-r border-r-[#FFB200]">
                  <div className="font-bold text-black text-[9.72px] leading-[22.58px] w-[22.48px] h-[22.28px] bg-[#FFB200] mx-auto">
                    {rowIndex + 1}
                  </div>
                </td>
                <td className="py-3 border-r border-r-[#FFB200]">
                  <Image
                    src={admin.profileImage || "/placeholder.svg"}
                    alt="admin photo"
                    width={50}
                    height={50}
                    style={{ objectFit: "contain" }}
                    className="mx-auto rounded-full"
                  />
                </td>
                <td className="py-3 text-xs border-r border-r-[#FFB200]">
                  {editingId === admin.sl ? (
                    <Input
                      value={editedData.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  ) : (
                    admin.name
                  )}
                </td>
                <td className="py-3 text-xs border-r border-r-[#FFB200]">
                  {editingId === admin.sl ? (
                    <Input
                      value={editedData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  ) : hideSensitive ? (
                    "*****@*****.com"
                  ) : (
                    admin.email
                  )}
                </td>
                <td className="py-3 text-xs border-r border-r-[#FFB200]">
                  {editingId === admin.sl ? (
                    <Input
                      value={editedData.url || ""}
                      onChange={(e) => handleChange("url", e.target.value)}
                    />
                  ) : hideSensitive ? (
                    "***"
                  ) : (
                    admin.url
                  )}
                </td>
                <td className="py-3 text-xs border-r border-r-[#FFB200]">
                  <ul className="list-disc list-inside">
                    {admin.permissions?.length > 0 ? admin?.permissions?.map((item, index) => <li key={index}>{item}</li>):""}

                  </ul>
                  
                </td>
                <td className="py-3 text-xs px-4">
                  <div className="flex items-center justify-around gap-2">
                    <Switch
                      style={{
                        background: admin?.active ? "green" : "gray",
                      }}
                      size="small"
                      checked={admin.active}
                      onChange={(checked) => handleStatusChange(admin.email, checked)}
                    />
                    {editingId === admin.sl ? (
                      <>
                        <Button onClick={() => handleSave(admin.sl)}>Save</Button>
                        <Button onClick={handleCancelEdit}>Cancel</Button>
                      </>
                    ) : (
                      <CiEdit
                        className="cursor-pointer"
                        size={24}
                        onClick={() => handleEdit(admin)}
                      />
                    )}
                    <RiDeleteBin5Line
                      size={18}
                      className="cursor-pointer"
                      color="red"
                      onClick={() => handleDeleteAdmin(admin.sl)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-4">
        <p className="text-md mb-2 text-black font-bold">
          Showing 1 To {adminDatas?.length || 0} of {adminDatas?.length || 0} Results
        </p>
        {/* <button className="px-4 py-2 border bg-[#FFB200] rounded-full text-black hover:bg-black hover:text-white transition-colors">
          Load More
        </button> */}
        <div className="rounded-[10px] w-[10rem] mx-auto border-[0.89px] border-white bg-[#FFB200] text-[#231F20] font-inter font-semibold text-[13px] leading-[15.73px] py-2 px-4">
          <span>More Results</span>
          <select name="" id="" className="ml-4">
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

export default AdminListPage;
