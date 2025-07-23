"use client";
import CustomForm from "@/components/Form/Form";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { Button, Image, Modal } from "antd";
import { useState } from "react";
import FullHeightTreeSelect from "../CustomTree";
import { treeData } from "./data";
import { env } from "../../../../../../config/env";
import { uploadFile } from "@/utils/uploadFile";
import { toast } from "react-toastify";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import instance from "@/api/axios";

const AddSubAdminModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [signUpCode, setSignUpCode] = useState("");
  const [role, setRole] = useState("sub-admin");

  // Controlled form fields
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const dispatch = useAppDispatch();

  const generateSignUpURL = () => {
    const baseURL = env.NEXT_PUBLIC_API_URL;
    const uniqueCode = Math.random().toString(36).substring(2, 15);
    return `${baseURL}?code=${uniqueCode}`;
  };

  // Helper to flatten all keys in treeData for main-admin
  const flattenTreeKeys = (nodes: any[]): string[] =>
    nodes.flatMap((node) =>
      node.children ? [node.key, ...flattenTreeKeys(node.children)] : [node.key]
    );

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);

      const { name, email, password, rePassword } = formFields;
      // Validate required fields
      console.log("formFields", formFields);
      if (!name || !email || !password) {
        toast.error("Name, Email, and Password are required.");
        setLoading(false);
        return;
      }

      if (password !== rePassword) {
        toast.error("Passwords do not match.");
        setLoading(false);
        return;
      }

      // If main-admin, auto-select all permissions
      let permissions = selectedPermissions;
      if (role === "main-admin") {
        permissions = flattenTreeKeys(treeData);
      }
      if (permissions.length === 0) {
        toast.error("Please select at least one permission.");
        setLoading(false);
        return;
      }

      const adminData = {
        name,
        email,
        password,
        profileImage: fileList,
        login_url: signUpCode,
        permissions,
        role,
        active: false,
      };

      console.log("adminData", adminData);

      const response = await instance.post("/admins", adminData);

      if (response.data && response.data.success) {
        toast.success("Admin created successfully!");
        closeModal();
      } else {
        toast.error("Failed to create admin");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error creating admin");
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFileList("");
    setSelectedPermissions([]);
    setSignUpCode("");
    setRole("sub-admin");
    setFormFields({
      name: "",
      email: "",
      password: "",
      rePassword: "",
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setLoading(true);
        const pic = await uploadFile(file);
        setFileList(pic);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Button
        onClick={showModal}
        style={{ background: "#ffb200", color: "black", fontWeight: "400" }}
        type="primary"
        size={"middle"}
        className=" !font-bold !p-3 !text-right"
      >
        Create Admin
      </Button>
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={600}
        centered
        style={{
          backgroundColor: "#ccccff",
          borderRadius: "8px",
          padding: "4px",
        }}
        className="bg-[#ccccff]"
      >
        <form className="w-full bg-[#ccccff]" onSubmit={onSubmit}>
          <div className="p-6">
            <p className="mb-5 text-center text-xl font-semibold">
              Add Admin
            </p>
            <div className="grid grid-cols-1 gap-4">
              {/* Photo Upload */}
              <div className="flex items-center">
                <div className="bg-[#FFB200] font-semibold text-black w-[30%] p-2 text-center rounded-l-xl">
                  Photo
                </div>
                <div className="flex-grow p-2 rounded-r-xl flex flex-col items-start space-y-2">
                  <div className="flex items-center space-x-4">
                    {fileList ? (
                      <Image
                        src={fileList}
                        alt="Uploaded Preview"
                        width={50}
                        height={50}
                        className="rounded-full w-[50px] h-[50px] object-center object-fill"
                      />
                    ) : (
                      <label htmlFor="upload">
                        {loading ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <FaCloudUploadAlt
                            className="text-gray-500 cursor-pointer"
                            size={20}
                          />
                        )}
                      </label>
                    )}
                    <input
                      type="file"
                      id="upload"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              {[
                {
                  label: "Name",
                  type: "text",
                  name: "name",
                  placeholder: "Rizwan",
                },
                {
                  label: "Gmail",
                  type: "email",
                  name: "email",
                  placeholder: "rizwan@gmail.com",
                },
                {
                  label: "Password",
                  type: "password",
                  name: "password",
                  placeholder: "12345678",
                },
                {
                  label: "Re-Password",
                  type: "password",
                  name: "rePassword",
                  placeholder: "12345678",
                },
              ].map((field, index) => (
                <div key={field.name + index} className="flex items-center">
                  <div className="bg-[#FFB200] font-semibold text-black w-[30%] p-2 text-center rounded-l-xl">
                    {field.label}
                  </div>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formFields[field.name as keyof typeof formFields]}
                    onChange={handleFieldChange}
                    className="bg-white flex-grow p-2 rounded-r-xl outline-none"
                  />
                </div>
              ))}

              {/* Role Selector */}
              <div className="flex items-center">
                <div className="bg-[#FFB200] font-semibold text-black w-[30%] p-2 text-center rounded-l-xl">
                  Role
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-white flex-grow p-2 rounded-r-xl outline-none"
                >
                  <option value="sub-admin">Sub Admin</option>
                  <option value="main-admin">Main Admin</option>
                </select>
              </div>

              {/* Login URL */}
              <div className="flex items-center relative">
                <div className="bg-[#FFB200] font-semibold text-black w-[30%] p-2 text-center rounded-l-xl">
                  Login URL
                </div>
                <div className="bg-white flex-grow p-2 rounded-r-xl flex items-center justify-between">
                  <input
                    type="text"
                    name="signUpCode"
                    value={signUpCode}
                    onChange={(e) => setSignUpCode(e.target.value)}
                    className="flex-grow outline-none"
                    placeholder="rizwan@gmail.com"
                  />
                  <Button
                    size="small"
                    onClick={() => setSignUpCode(generateSignUpURL())}
                    className="ml-2 bg-[#FFB200]"
                  >
                    URL Generate
                  </Button>
                </div>
                <Image
                  src="/image 7726.png"
                  alt="share"
                  width={20}
                  height={20}
                  className="absolute -right-4"
                />
              </div>

              {/* Access */}
              <div className="flex items-center">
                <div className="bg-[#FFB200] font-semibold text-black w-[30%] h-[3rem] p-3 text-center rounded-l-2xl">
                  Access
                </div>
                <div className="flex-grow p-2 rounded-r-2xl bg-white h-[3rem]">
                  <FullHeightTreeSelect
                    setSelectedPermissions={setSelectedPermissions}
                    treeData={treeData}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-center mt-4 p-1">
                <Button
                  type="primary"
                  htmlType="submit"
                  className=" bg-[#FFB200] h-[110%] text-black font-bold rounded-xl"
                  loading={loading}
                >
                  Create Admin
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddSubAdminModal;