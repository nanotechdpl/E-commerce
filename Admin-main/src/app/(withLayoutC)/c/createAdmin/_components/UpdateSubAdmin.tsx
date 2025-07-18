"use client";
import CustomForm from "@/components/Form/Form";
import CustomInput from "@/components/Form/Input";
import { updateAdmin } from "@/redux/fetures/admin/adminSlice";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Upload } from "antd";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import FullHeightTreeSelect from "../CustomTree";
import { treeData } from "./data";

const UpdateAdminModal = ({ updateData }: { updateData: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: any) => {
    const { password, ...remainingData } = data;
    const { id, active } = updateData;
    const updateAdminData = {
      id,
      ...remainingData,
      selectedPermissions,
      active,
    };
    dispatch(updateAdmin(updateAdminData));
    closeModal();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  return (
    <div>
      <CiEdit className="cursor-pointer" onClick={showModal} size={24} />
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={680}
        centered
      >
        <CustomForm className="w-full bg-[#ccccff]" onSubmit={onSubmit}>
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "5px",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <p className="mb-5 text-center text-xl font-semibold">
              Update Sub Admin
            </p>
            <Row gutter={{ xl: 24 }}>
              <Col
                className="gutter-row"
                span={24}
                style={{ marginBottom: "10px" }}
              >
                <Upload
                  listType="picture"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={() => false} // Prevent auto-upload
                >
                  <Button icon={<UploadOutlined />}>Upload Photo</Button>
                </Upload>
              </Col>
              <Col
                className="gutter-row whitespace-nowrap"
                span={12}
                style={{ marginBottom: "10px" }}
              >
                <CustomInput
                  type="text"
                  name="name"
                  label="Name"
                  defaultValue={updateData.name}
                />
              </Col>
              <Col
                className="gutter-row whitespace-nowrap"
                span={12}
                style={{ marginBottom: "10px" }}
              >
                <CustomInput
                  type="text"
                  name="userName"
                  label="User Name"
                  defaultValue={updateData.userName}
                />
              </Col>
              <Col
                className="gutter-row"
                span={12}
                style={{ marginBottom: "10px" }}
              >
                <CustomInput
                  type="text"
                  name="email"
                  label="Email"
                  defaultValue={updateData.email}
                />
              </Col>
              <Col
                className="gutter-row"
                span={12}
                style={{ marginBottom: "10px" }}
              >
                <CustomInput
                  type="url"
                  name="url"
                  label="URL"
                  defaultValue={updateData.url}
                />
              </Col>
              <Col
                className="gutter-row"
                span={12}
                style={{ marginBottom: "10px" }}
              >
                <CustomInput type="password" name="password" label="Password" />
              </Col>
              <Col
                className="gutter-row"
                span={12}
                style={{ marginTop: "30px" }}
              >
                <FullHeightTreeSelect
                  // name="accessList"
                  // label="Access"
                  setSelectedPermissions={setSelectedPermissions}
                  treeData={treeData}
                />
              </Col>
              <Col className="gutter-row" span={24}>
                <Button htmlType="submit" type="primary">
                  Update
                </Button>
              </Col>
            </Row>
          </div>
        </CustomForm>
      </Modal>
    </div>
  );
};

export default UpdateAdminModal;
