import { Poppins } from "next/font/google";
import Link from "next/link";
import ChatInterface from "../ChatInterface";
import { OrderData } from "@/types/orderData";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

// Demo data for the table
const demoOrders: OrderData[] = [
  {
    _id: "1",
    orderid: "ORD-2024-001",
    full_name: "E-commerce Website",
    budget: 5000,
    paid_amount: 2500,
    status: "working",
    user_signatory: {
      signature_type: "digital",
      signature: "user_signature_1"
    },
    admin_signatory: {
      signature_type: "digital",
      signature: "admin_signature_1"
    },
    orderNumber: "001",
    project_requirement: "Build a modern e-commerce platform",
    createdAt: new Date().toISOString(),
    project_type: "web development",
    pay_currency: "USD",
    project_deadline: "30 days",
    reference_name: "John Smith",
    minimum_pay: 2000,
    project_details: "Modern e-commerce platform with payment integration",
    accepted_terms: true,
    work_location: "Remote",
    balance_amount: 2500,
    profit: 1000,
    userid: "user123",
    project_files: [],
    __v: 0
  },
  {
    _id: "2",
    orderid: "ORD-2024-002",
    full_name: "Mobile App Development",
    budget: 8000,
    paid_amount: 8000,
    status: "completed",
    user_signatory: {
      signature_type: "digital",
      signature: "user_signature_2"
    },
    admin_signatory: {
      signature_type: "digital",
      signature: "admin_signature_2"
    },
    orderNumber: "002",
    project_requirement: "Develop a mobile app for iOS and Android",
    createdAt: new Date().toISOString(),
    project_type: "mobile development",
    pay_currency: "USD",
    project_deadline: "45 days",
    reference_name: "Jane Wilson",
    minimum_pay: 3000,
    project_details: "Cross-platform mobile application",
    accepted_terms: true,
    work_location: "Remote",
    balance_amount: 0,
    profit: 2000,
    userid: "user456",
    project_files: [],
    __v: 0
  },
  {
    _id: "3",
    orderid: "ORD-2024-003",
    full_name: "WordPress Blog",
    budget: 1500,
    paid_amount: 0,
    status: "pending",
    user_signatory: {
      signature_type: "digital",
      signature: "user_signature_3"
    },
    admin_signatory: {
      signature_type: "digital",
      signature: "admin_signature_3"
    },
    orderNumber: "003",
    project_requirement: "Create a WordPress blog with custom theme",
    createdAt: new Date().toISOString(),
    project_type: "wordpress",
    pay_currency: "USD",
    project_deadline: "15 days",
    reference_name: "Mike Brown",
    minimum_pay: 500,
    project_details: "Custom WordPress blog development",
    accepted_terms: true,
    work_location: "Remote",
    balance_amount: 1500,
    profit: 300,
    userid: "user789",
    project_files: [],
    __v: 0
  },
  {
    _id: "4",
    orderid: "ORD-2024-004",
    full_name: "CRM System",
    budget: 12000,
    paid_amount: 6000,
    status: "waiting",
    user_signatory: {
      signature_type: "digital",
      signature: "user_signature_4"
    },
    admin_signatory: {
      signature_type: "digital",
      signature: "admin_signature_4"
    },
    orderNumber: "004",
    project_requirement: "Build a custom CRM system",
    createdAt: new Date().toISOString(),
    project_type: "web application",
    pay_currency: "USD",
    project_deadline: "60 days",
    reference_name: "Sarah Davis",
    minimum_pay: 4000,
    project_details: "Custom CRM system with reporting",
    accepted_terms: true,
    work_location: "Remote",
    balance_amount: 6000,
    profit: 2400,
    userid: "user101",
    project_files: [],
    __v: 0
  },
  {
    _id: "5",
    orderid: "ORD-2024-005",
    full_name: "UI/UX Design",
    budget: 3000,
    paid_amount: 1000,
    status: "payment",
    user_signatory: {
      signature_type: "digital",
      signature: "user_signature_5"
    },
    admin_signatory: {
      signature_type: "digital",
      signature: "admin_signature_5"
    },
    orderNumber: "005",
    project_requirement: "Design modern UI/UX for web application",
    createdAt: new Date().toISOString(),
    project_type: "design",
    pay_currency: "USD",
    project_deadline: "20 days",
    reference_name: "Alex Lee",
    minimum_pay: 1000,
    project_details: "Modern UI/UX design with prototypes",
    accepted_terms: true,
    work_location: "Remote",
    balance_amount: 2000,
    profit: 600,
    userid: "user202",
    project_files: [],
    __v: 0
  }
];

const OrderTable = ({ orders = demoOrders }: { orders?: OrderData[] }) => {
  // ... existing code ...
} 