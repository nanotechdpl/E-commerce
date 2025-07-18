"use client";
import { updateBank } from "@/redux/fetures/bank/bankSlice";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { Col, Modal, Row } from "antd";
import { useState } from "react";

import CustomForm from "@/components/Form/Form";
import CustomInput from "@/components/Form/Input";
import { CiEdit } from "react-icons/ci";

const UpdateBank = ({ updateData }: { updateData: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: any) => {
    const { id, active } = updateData;
    const updateBankData = {
      id,
      ...data,
      active,
    };
    dispatch(updateBank(updateBankData));
    closeModal();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <CiEdit className="cursor-pointer" onClick={showModal} size={24} />
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={600}
        centered
      >
        <CustomForm className="w-full" onSubmit={onSubmit}>
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "5px",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <p className="mb-5 text-center text-xl font-semibold">
              Update Bank Wallet
            </p>
            <Row gutter={{ xl: 24 }}>
              <Col span={12} style={{ marginBottom: "10px" }}>
                <CustomInput
                  type="text"
                  name="bankName"
                  label="Bank Name"
                  defaultValue={updateData.bankName}
                />
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                <CustomInput
                  type="text"
                  name="bankLogo"
                  label="Bank Logo URL"
                  defaultValue={updateData.bankLogo}
                />
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                <CustomInput
                  type="text"
                  name="qrCode"
                  label="QR Code URL"
                  defaultValue={updateData.qrCode}
                />
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                <CustomInput
                  type="text"
                  name="accountInfo"
                  label="Account Info"
                  defaultValue={updateData.accountInfo}
                />
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                <CustomInput
                  type="text"
                  name="taxInfo"
                  label="Tax Info"
                  defaultValue={updateData.taxInfo}
                />
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                <CustomInput
                  type="text"
                  name="currency"
                  label="Currency Support"
                  defaultValue={updateData.currency}
                />
              </Col>
            </Row>
          </div>
        </CustomForm>
      </Modal>
    </div>
  );
};

export default UpdateBank;
