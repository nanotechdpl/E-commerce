"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button, Col, Row, message } from "antd";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CustomForm from "@/components/Form/Form";
import CustomInput from "@/components/Form/Input";
import { AxiosError } from "axios";
import { createAdminUser } from "../../allUsers/actions";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

interface AdminFormValues {
  name: string;
  userName: string;
  email: string;
  password: string;
  loginUrl: string;
  pincode: string;
  language: string;
  access: number;
}

const AddNewAdminPage = () => {
  const dispatch = useDispatch();
  const actions = useMemo(
    () => bindActionCreators({ createAdminUser }, dispatch),
    [dispatch]
  );

  const onSubmit = async (values: AdminFormValues) => {
    console.log("Form Values:", values);

    const {
      name,
      userName,
      email,
      password,
      loginUrl,
      pincode,
      language,
      access,
    } = values;

    const payload = {
      username: userName,
      name,
      email: email,
      password,
      login_url: loginUrl,
      pincode,
      language,
      access,
    };
    console.log("payload", payload);

    try {
      const response = actions.createAdminUser(payload);
      message.success("User created successfully!");
      console.log("response", response);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error response data:", error.response?.data);
        message.error(
          error.response?.data.message ||
            "An error occurred while creating the admin"
        );
      } else {
        console.error("Error message:", (error as Error).message);
        message.error(
          (error as Error).message ||
            "An error occurred while creating the admin"
        );
      }
    }
  };

  return (
    <div className="w-full p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Create Sub-Admin" />

      <div className="-mt-2 mb-4 flex items-center justify-end gap-3">
        <Link href={"/c/createAdmin"}>
          <Button
            style={{ background: "#FFB200" }}
            type="primary"
            size={"middle"}
          >
            Back
          </Button>
        </Link>
      </div>
      <div>
        <CustomForm<AdminFormValues> className="w-full" onSubmit={onSubmit}>
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "5px",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <p style={{ fontSize: "18px", marginBottom: "10px" }}>
              User Information
            </p>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col
                className="gutter-row"
                span={8}
                style={{ marginBottom: "10px" }}
              >
                <CustomInput type="text" name="name" label="Name" />
              </Col>
              <Col
                className="gutter-row"
                span={8}
                style={{ marginBottom: "10px" }}
              >
                <CustomInput
                  type="text"
                  name="userName"
                  label="User Name"
                  placeholder="Enter your username"
                />
              </Col>
              <Col
                className="gutter-row"
                span={8}
                style={{ marginBottom: "10px" }}
              >
                <CustomInput
                  type="text"
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                />
              </Col>
              <Col
                className="gutter-row"
                span={8}
                style={{ marginBottom: "10px" }}
              >
                <CustomInput
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                />
              </Col>
              <Col
                className="gutter-row"
                span={8}
                style={{ marginBottom: "10px" }}
              >
                <CustomInput
                  type="text"
                  name="loginUrl"
                  label="Login Url"
                  placeholder="Enter your login URL"
                />
              </Col>
              <Col
                className="gutter-row"
                span={8}
                style={{ marginBottom: "10px" }}
              >
                <CustomInput
                  type="text"
                  name="pincode"
                  label="Pincode"
                  placeholder="Enter your pincode"
                />
              </Col>
              <Col
                className="gutter-row"
                span={8}
                style={{ marginBottom: "10px" }}
              >
                <CustomInput
                  type="text"
                  name="language"
                  label="Language"
                  placeholder="Enter preferred language"
                />
              </Col>
              <Col
                className="gutter-row"
                span={8}
                style={{ marginBottom: "10px" }}
              >
                <CustomInput
                  type="number"
                  name="access"
                  label="Access Level"
                  placeholder="Enter access level (0 or 1)"
                />
              </Col>
            </Row>
          </div>
          <Button htmlType="submit" type="primary">
            Create
          </Button>
        </CustomForm>
      </div>
    </div>
  );
};

export default AddNewAdminPage;
