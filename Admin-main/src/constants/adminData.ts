import { IAdmin } from "@/types/admin";

export const AdminData: IAdmin[] = [
  {
    id: "admin123",
    name: "John Doe",
    userName: "johndoe",
    email: "johndoe@example.com",
    accessList: ["user_management", "content_editing"],
    active: true,
  },
  {
    id: "admin456",
    name: "Jane Smith",
    userName: "janesmith",
    email: "janesmith@example.com",
    accessList: ["user_management", "reporting", "dashboard_access"],
    active: true,
  },
  {
    id: "admin789",
    name: "Michael Johnson",
    userName: "michaelj",
    email: "michaelj@example.com",
    accessList: ["content_editing", "billing_management"],
    active: true,
  },
  {
    id: "admin101",
    name: "Emily Davis",
    userName: "emilyd",
    email: "emilyd@example.com",
    accessList: ["user_management", "reporting"],
    active: false,
  },
  {
    id: "admin202",
    name: "Christopher Lee",
    userName: "chrisl",
    email: "chrisl@example.com",
    accessList: ["dashboard_access", "billing_management"],
    active: true,
  },
];
