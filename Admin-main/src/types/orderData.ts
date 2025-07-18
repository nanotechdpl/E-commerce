export interface OrderData {
  user_signatory: UserSignatory;
  admin_signatory: AdminSignatory;
  _id: string;
  full_name: string;
  orderId: string;
  project_requirement: string;
  email: string;
  project_type: string;
  payCurrency: string;
  serviceName?: string;
  priceOrBudget?: number;
  salaryOrBudget?: number;
  
  project_deadline: string;
  projectType: string;
  minimum_pay: number;
  project_details: string;
  accepted_terms: boolean;
  work_location: string;
  paid_amount: number;
  balance_amount: number;
  profit: number;
  orderStatus:
    | "pending"
    | "payment"
    | "waiting"
    | "working"
    | "stopped"
    | "completed"
    | "delivered"
    | "refund"
    | "cancelled";
  userid: string;
  orderid: string;
  project_files: any[];
  createdAt: string;
  __v: number;
}

/**
 { value: "pending", label: "Pending" },
  { value: "payment", label: "Payment" },
  { value: "waiting", label: "Waiting" },
  { value: "working", label: "Working" },
  { value: "stopped", label: "Stopped" },
  { value: "completed", label: "Completed" },
  { value: "delivered", label: "Delivery" },
  { value: "refund", label: "Refund" },
  { value: "cancelled", label: "Cancel" },
 */

export interface UserSignatory {
  signature_type: string;
  signature: string;
}

export interface AdminSignatory {
  signature_type: string;
  signature: string;
}
