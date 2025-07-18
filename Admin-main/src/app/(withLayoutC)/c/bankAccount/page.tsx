"use client";
import ICTable from "@/components/ui/ICTable";
import {
  removeBank,
  statusChange,
  updateBank,
} from "@/redux/fetures/bank/bankSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { IBank } from "@/types/bank";
import { Button, Image, Input, Select, Switch, message } from "antd";
import Link from "next/link";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import AddBank from "./_components/AddBank";
import Date from "./_components/Date";

const { Option } = Select;

const BankListPage = () => {
  // const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  // const [sortBy, setSortBy] = useState<string>("");
  // const [sortOrder, setSortOrder] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null); // Track which row is being edited
  const [editedData, setEditedData] = useState<Partial<IBank>>({}); // Store edited data

  const dispatch = useAppDispatch();
  const bankDatas = useAppSelector((state) => state.bank);

  const handleStatusChange = (id: string, active: boolean) => {
    dispatch(statusChange({ id, active }));
  };

  const handleDeleteBank = (id: string) => {
    dispatch(removeBank({ id }));
    message.open({
      type: "success",
      content: "Bank deleted successfully",
    });
  };

  const handleEdit = (data: IBank) => {
    setEditingId(data.sl); // Set the row ID being edited
    setEditedData(data); // Populate editedData with the current row's data
  };

  const handleSave = (id: string) => {
    dispatch(updateBank({ id, data: editedData }));
    setEditingId(null);
    setEditedData({});
    message.open({
      type: "success",
      content: "Bank updated successfully",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleChange = (field: keyof IBank, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value })); // Update editedData when input fields change
  };

  const columns = [
    { title: "No.", dataIndex: "sl" },
    {
      title: "Bank and Wallet Name",
      dataIndex: "bankName",
      render: (text: string, record: IBank) =>
        editingId === record.sl ? (
          <Input
            value={editedData.bankName || ""}
            onChange={(e) => handleChange("bankName", e.target.value)}
          />
        ) : (
          text
        ),
    },
    {
      title: "Bank and Wallet Logo",
      dataIndex: "bankLogo",
      render: (text: string, record: IBank) =>
        editingId === record.sl ? (
          <Input
            value={editedData.bankLogo || ""}
            onChange={(e) => handleChange("bankLogo", e.target.value)}
          />
        ) : (
          <Image
            src={text}
            alt="Bank Logo"
            width={50}
            height={50}
            style={{ objectFit: "contain" }}
          />
        ),
    },
    {
      title: "Bank and Wallet QR Code",
      dataIndex: "qrCode",
      render: (text: string, record: IBank) =>
        editingId === record.sl ? (
          <Input
            value={editedData.qrCode || ""}
            onChange={(e) => handleChange("qrCode", e.target.value)}
          />
        ) : (
          <Image
            src={text}
            alt="QR Code"
            width={50}
            height={50}
            style={{ objectFit: "contain" }}
          />
        ),
    },
    {
      title: "Bank and Wallet Account Info",
      dataIndex: "accountInfo",
      render: (text: string, record: IBank) =>
        editingId === record.sl ? (
          <Input
            value={editedData.accountInfo || ""}
            onChange={(e) => handleChange("accountInfo", e.target.value)}
          />
        ) : (
          text
        ),
    },
    {
      title: "Tax Rate",
      dataIndex: "taxInfo",
      render: (text: string, record: IBank) =>
        editingId === record.sl ? (
          <Input
            value={editedData.taxInfo || ""}
            onChange={(e) => handleChange("taxInfo", e.target.value)}
          />
        ) : (
          text
        ),
    },
    {
      title: "Currency Support",
      dataIndex: "currency",
      render: (text: string, record: IBank) =>
        editingId === record.sl ? (
          <Select
            value={editedData.currency || ""}
            onChange={(value) => handleChange("currency", value)}
            style={{ width: "100%" }}
          >
            <Option value="USD">USD</Option>
            <Option value="EUR">EUR</Option>
            <Option value="BDT">BDT</Option>
          </Select>
        ) : (
          text
        ),
    },
    {
      title: "See",
      render: (data: IBank) => {
        return (
          <div className="flex items-center justify-around">
            <Switch
              style={{
                // Property 'active' does not exist on type 'IBank'
                background: data?.active ? "green" : "gray",
                marginRight: "2px",
              }}
              size="small"
              checked={data.active}
              onChange={(checked) => handleStatusChange(data.sl, checked)}
            />
            {editingId === data.sl ? (
              <>
                <Button onClick={() => handleSave(data.sl)}>Save</Button>
                <Button onClick={handleCancel}>Cancel</Button>
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
              onClick={() => handleDeleteBank(data.sl)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 2xl:p-10">
      <div className="flex item-center  mb-3 text-black justify-between gap-3">
        <Date />
        <Link href={"/c/createAdmin"}>
          <Button
            size={"middle"}
            className="text-black bg-transparent border border-[#ffb200] "
          >
            Admin
          </Button>
        </Link>
        <AddBank />
      </div>

      <ICTable
        loading={false}
        columns={columns}
        dataSource={bankDatas}
        pageSize={size}
      />
      <div className="text-center mt-4">
        <p className="text-md mb-2 text-black font-bold">
          Showing 1 To 5 of 97 Results
        </p>
        <button className="px-4 py-2 border bg-[#FFB200] rounded-full text-black hover:bg-black hover:text-white transition-colors">
          More Results
        </button>
      </div>
    </div>
  );
};

export default BankListPage;
