import { DashboardOrders, DashboardPayments, DashboardReturns, DashboardAgencies } from "@/redux/fetures/dashboard/dashboardSlice";
import { IAgency } from "@/types/agency";
import { User, UserPaymentType } from "../redux/fetures/admin/userSlice";

export const demoOrders: DashboardOrders = {
    totaluserorder: 10,
    totalpendingorders: 3,
    totalorderpayment: 2,
    totalwaitingorders: 1,
    totalworkingorders: 2,
    totalcompleteorders: 1,
    totaldeliveredorders: 1,
    totalcancelorders: 0,
    userorders: [
      {
        _id: "1",
        full_name: "John Doe",
        orderNumber: "ORD-001",
        project_requirement: "normal",
        project_type: "personal",
        pay_currency: "USD",
        budget: 5000,
        project_deadline: "2024-12-31",
        reference_name: "Jane Smith",
        minimum_pay: 100,
        project_details: "Website development project",
        accepted_terms: true,
        work_location: "Remote",
        paid_amount: 2000,
        balance_amount: 3000,
        profit: 500,
        status: "pending",
        userid: "user1",
        orderid: "order1",
        project_files: [],
        createdAt: "2024-01-01",
        __v: 0,
        user_signatory: {
          signature_type: "digital",
          signature: "signature1"
        },
        admin_signatory: {
          signature_type: "digital",
          signature: "admin1"
        }
      },
      {
        _id: "2",
        full_name: "Alice Johnson",
        orderNumber: "ORD-002",
        project_requirement: "medium",
        project_type: "company",
        pay_currency: "EUR",
        budget: 8000,
        project_deadline: "2024-11-30",
        reference_name: "Bob Wilson",
        minimum_pay: 150,
        project_details: "Mobile app development",
        accepted_terms: true,
        work_location: "Hybrid",
        paid_amount: 4000,
        balance_amount: 4000,
        profit: 800,
        status: "working",
        userid: "user2",
        orderid: "order2",
        project_files: [],
        createdAt: "2024-01-15",
        __v: 0,
        user_signatory: {
          signature_type: "digital",
          signature: "signature2"
        },
        admin_signatory: {
          signature_type: "digital",
          signature: "admin2"
        }
      },
      {
        _id: "3",
        full_name: "Mike Brown",
        orderNumber: "ORD-003",
        project_requirement: "emergency",
        project_type: "government",
        pay_currency: "GBP",
        budget: 12000,
        project_deadline: "2024-10-31",
        reference_name: "Sarah Davis",
        minimum_pay: 200,
        project_details: "Security system upgrade",
        accepted_terms: true,
        work_location: "On-site",
        paid_amount: 6000,
        balance_amount: 6000,
        profit: 1200,
        status: "payment",
        userid: "user3",
        orderid: "order3",
        project_files: [],
        createdAt: "2024-01-20",
        __v: 0,
        user_signatory: {
          signature_type: "digital",
          signature: "signature3"
        },
        admin_signatory: {
          signature_type: "digital",
          signature: "admin3"
        }
      }
    ]
  };


 
export const demoPayments: DashboardPayments = {
  totalsumpayment: 25000,
  totaluserpayment: 15,
  totalpendingpayment: 5,
  totalacceptedpayment: 7,
  totalspampayment: 3,
  userpayment: [
    {
      sl: 1,
      id: 1,
      ProjectName: "Website Development",
      paymentType: "Bank Transfer",
      paymentID: "PAY-001",
      paymentMethod: "SBI Bank",
      accountName: "John Doe",
      accountNumber: "1234567890",
      payAmount: 5000,
      amount: 5000,
      paymentDay: "2024-03-15",
      acocuntHolderName: "John Doe",
      account_name: "John Doe",
      transactionId: "TRX-001",
      transactionReceipt: "receipt1.pdf",
      additionalNote: "Initial payment for website development",
      Currency: "USD",
      createdAt: "2024-03-15",
      Name: "John Doe",
      status: "accepted"
    },
    {
      sl: 2,
      id: 2,
      ProjectName: "Mobile App Development",
      paymentType: "Bank Wallet",
      paymentID: "PAY-002",
      paymentMethod: "PayPal",
      accountName: "Alice Johnson",
      accountNumber: "0987654321",
      payAmount: 8000,
      amount: 8000,
      paymentDay: "2024-03-16",
      acocuntHolderName: "Alice Johnson",
      account_name: "Alice Johnson",
      transactionId: "TRX-002",
      transactionReceipt: "receipt2.pdf",
      additionalNote: "Payment for mobile app development phase 1",
      Currency: "EUR",
      Name: "Alice Johnson",
      status: "pending",
      createdAt: "2024-03-16"
    },
    {
      sl: 3,
      id: 3,
      ProjectName: "UI/UX Design",
      paymentType: "Bank Transfer",
      paymentID: "PAY-003",
      paymentMethod: "Chase Bank",
      accountName: "Mike Brown",
      accountNumber: "1122334455",
      payAmount: 3000,
      amount: 3000,
      paymentDay: "2024-03-17",
      acocuntHolderName: "Mike Brown",
      account_name: "Mike Brown",
      transactionId: "TRX-003",
      transactionReceipt: "receipt3.pdf",
      additionalNote: "Design system payment",
      Currency: "GBP",
      Name: "Mike Brown",
      status: "spam",
      createdAt: "2024-03-17"
    },
    {
      sl: 4,
      id: 4,
      ProjectName: "Backend Development",
      paymentType: "Bank Wallet",
      paymentID: "PAY-004",
      paymentMethod: "Wise",
      accountName: "Sarah Davis",
      accountNumber: "5544332211",
      payAmount: 7000,
      amount: 7000,
      paymentDay: "2024-03-18",
      acocuntHolderName: "Sarah Davis",
      account_name: "Sarah Davis",
      transactionId: "TRX-004",
      transactionReceipt: "receipt4.pdf",
      additionalNote: "Backend API development payment",
      Currency: "USD",
      Name: "Sarah Davis",
      status: "accepted",
      createdAt: "2024-03-18"
    },
    {
      sl: 5,
      id: 5,
      ProjectName: "Database Setup",
      paymentType: "Bank Transfer",
      paymentID: "PAY-005",
      paymentMethod: "Bank of America",
      accountName: "Robert Wilson",
      accountNumber: "6677889900",
      payAmount: 2000,
      amount: 2000,
      paymentDay: "2024-03-19",
      acocuntHolderName: "Robert Wilson",
      account_name: "Robert Wilson",
      transactionId: "TRX-005",
      transactionReceipt: "receipt5.pdf",
      additionalNote: "Database configuration payment",
      Currency: "USD",
      Name: "Robert Wilson",
      status: "pending",
      createdAt: "2024-03-19"
    }
  ]
};

export const demoReturns: DashboardReturns = {
  totaluserrefund: 25,
  totalsumrefund: 75000,
  totalpendingrefund: 8,
  totalsedningrefund: 12,
  totalIneligibleRefund: 5,
  userrefund: [
    {
      _id: "REF001",
      account_name: "John Smith",
      bank_name: "Chase Bank",
      account_number: "1234567890",
      routing_number: "987654321",
      code: "CHASE",
      transaction_receipt: "receipt1.pdf",
      additional_note: "Refund for project cancellation",
      reason: "Project cancelled by client",
      amount: 5000,
      bank_wallet: "Chase Bank",
      currency: "USD",
      status: "pending",
      orderid: "ORD001",
      userid: "USER001",
      createdAt: "2024-03-15T10:30:00Z",
      returnNumber: "RET001",
      __v: 0
    },
    {
      _id: "REF002",
      account_name: "Sarah Johnson",
      bank_name: "Bank of America",
      account_number: "0987654321",
      routing_number: "123456789",
      code: "BOA",
      transaction_receipt: "receipt2.pdf",
      additional_note: "Refund for service not provided",
      reason: "Service not delivered",
      amount: 3000,
      bank_wallet: "Bank of America",
      currency: "USD",
      status: "sending",
      orderid: "ORD002",
      userid: "USER002",
      createdAt: "2024-03-16T14:20:00Z",
      returnNumber: "RET002",
      __v: 0
    },
    {
      _id: "REF003",
      account_name: "Michael Brown",
      bank_name: "Wells Fargo",
      account_number: "1122334455",
      routing_number: "5544332211",
      code: "WF",
      transaction_receipt: "receipt3.pdf",
      additional_note: "Refund for quality issues",
      reason: "Quality not meeting standards",
      amount: 2500,
      bank_wallet: "Wells Fargo",
      currency: "USD",
      status: "ineligible",
      orderid: "ORD003",
      userid: "USER003",
      createdAt: "2024-03-17T09:15:00Z",
      returnNumber: "RET003",
      __v: 0
    },
    {
      _id: "REF004",
      account_name: "Emily Davis",
      bank_name: "Citibank",
      account_number: "5544332211",
      routing_number: "1122334455",
      code: "CITI",
      transaction_receipt: "receipt4.pdf",
      additional_note: "Refund for delayed delivery",
      reason: "Delivery delay",
      amount: 4000,
      bank_wallet: "Citibank",
      currency: "USD",
      status: "sending",
      orderid: "ORD004",
      userid: "USER004",
      createdAt: "2024-03-18T11:45:00Z",
      returnNumber: "RET004",
      __v: 0
    },
    {
      _id: "REF005",
      account_name: "David Wilson",
      bank_name: "HSBC",
      account_number: "6677889900",
      routing_number: "0099887766",
      code: "HSBC",
      transaction_receipt: "receipt5.pdf",
      additional_note: "Refund for incorrect billing",
      reason: "Billing error",
      amount: 1500,
      bank_wallet: "HSBC",
      currency: "USD",
      status: "pending",
      orderid: "ORD005",
      userid: "USER005",
      createdAt: "2024-03-19T16:30:00Z",
      returnNumber: "RET005",
      __v: 0
    }
  ]
};

export const demoAgencies: DashboardAgencies = {
  totalAgency: 5,
  agencies: [
    {
      _id: "AG001",
      fullName: "John Smith",
      nationality: "US",
      nationalIdOrPassport: "US123456",
      phoneNumber: "+1-555-0123",
      personalEmail: "john.smith@example.com",
      permanentAddress: "123 Main St, New York, NY",
      personalDocuments: ["doc1.pdf", "doc2.pdf"],
      agencyLogo: "logo1.png",
      agencyName: "Alpha Agency",
      serviceDivision: "IT Services",
      serviceArea: "North America",
      grade: "A",
      employees: ["EMP001", "EMP002"],
      officeAddress: "456 Business Ave, New York, NY",
      phoneNumberOffice: "+1-555-0124",
      officeEmail: "office@alphaagency.com",
      agencyDocuments: ["agency_doc1.pdf", "agency_doc2.pdf"],
      description: "Leading IT solutions provider",
      currency: "USD",
      feeAmount: 5000,
      depositAmount: 10000,
      userId: "USER001",
      status: "Active",
      socialLinks: [
        { platform: "LinkedIn", link: "https://linkedin.com/alphaagency" },
        { platform: "Twitter", link: "https://twitter.com/alphaagency" }
      ],
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-03-15T00:00:00.000Z",
      agencyId: "AG001",
      __v: 0
    },
    {
      _id: "AG002",
      fullName: "Sarah Johnson",
      nationality: "UK",
      nationalIdOrPassport: "UK789012",
      phoneNumber: "+44-20-7123-4567",
      personalEmail: "sarah.johnson@example.com",
      permanentAddress: "10 Downing St, London, UK",
      personalDocuments: ["doc3.pdf", "doc4.pdf"],
      agencyLogo: "logo2.png",
      agencyName: "Beta Solutions",
      serviceDivision: "Consulting",
      serviceArea: "Europe",
      grade: "B",
      employees: ["EMP003", "EMP004"],
      officeAddress: "20 Business Park, London, UK",
      phoneNumberOffice: "+44-20-7123-4568",
      officeEmail: "office@betasolutions.com",
      agencyDocuments: ["agency_doc3.pdf", "agency_doc4.pdf"],
      description: "Professional consulting services",
      currency: "GBP",
      feeAmount: 4000,
      depositAmount: 8000,
      userId: "USER002",
      status: "Pending",
      socialLinks: [
        { platform: "LinkedIn", link: "https://linkedin.com/betasolutions" }
      ],
      createdAt: "2024-01-15T00:00:00.000Z",
      updatedAt: "2024-03-15T00:00:00.000Z",
      agencyId: "AG002",
      __v: 0
    },
    {
      _id: "AG003",
      fullName: "Michael Brown",
      nationality: "CA",
      nationalIdOrPassport: "CA345678",
      phoneNumber: "+1-416-555-0123",
      personalEmail: "michael.brown@example.com",
      permanentAddress: "789 Maple St, Toronto, ON",
      personalDocuments: ["doc5.pdf", "doc6.pdf"],
      agencyLogo: "logo3.png",
      agencyName: "Gamma Consulting",
      serviceDivision: "Financial Services",
      serviceArea: "Canada",
      grade: "C",
      employees: ["EMP005", "EMP006"],
      officeAddress: "321 Business Blvd, Toronto, ON",
      phoneNumberOffice: "+1-416-555-0124",
      officeEmail: "office@gammaconsulting.com",
      agencyDocuments: ["agency_doc5.pdf", "agency_doc6.pdf"],
      description: "Financial consulting and advisory",
      currency: "CAD",
      feeAmount: 3000,
      depositAmount: 6000,
      userId: "USER003",
      status: "Inactive",
      socialLinks: [
        { platform: "LinkedIn", link: "https://linkedin.com/gammaconsulting" }
      ],
      createdAt: "2024-02-01T00:00:00.000Z",
      updatedAt: "2024-03-15T00:00:00.000Z",
      agencyId: "AG003",
      __v: 0
    }
  ]
};

export const demoPaymentTracker = [
  {
    id: "1",
    amount: 1500.00,
    status: "completed",
    currency: "USD",
    payment_type: "bank_transfer",
    created_at: "2024-03-20T10:30:00Z"
  },
  {
    id: "2",
    amount: 2500.00,
    status: "pending",
    currency: "EUR",
    payment_type: "credit_card",
    created_at: "2024-03-19T15:45:00Z"
  },
  {
    id: "3",
    amount: 800.00,
    status: "completed",
    currency: "GBP",
    payment_type: "bank_transfer",
    created_at: "2024-03-18T09:15:00Z"
  },
  {
    id: "4",
    amount: 3000.00,
    status: "failed",
    currency: "USD",
    payment_type: "credit_card",
    created_at: "2024-03-17T14:20:00Z"
  },
  {
    id: "5",
    amount: 1200.00,
    status: "completed",
    currency: "JPY",
    payment_type: "bank_transfer",
    created_at: "2024-03-16T11:00:00Z"
  },
  {
    id: "6",
    amount: 1800.00,
    status: "pending",
    currency: "AUD",
    payment_type: "credit_card",
    created_at: "2024-03-15T16:30:00Z"
  },
  {
    id: "7",
    amount: 950.00,
    status: "completed",
    currency: "CAD",
    payment_type: "bank_transfer",
    created_at: "2024-03-14T13:45:00Z"
  },
  {
    id: "8",
    amount: 2200.00,
    status: "completed",
    currency: "USD",
    payment_type: "credit_card",
    created_at: "2024-03-13T10:15:00Z"
  },
  {
    id: "9",
    amount: 1600.00,
    status: "pending",
    currency: "EUR",
    payment_type: "bank_transfer",
    created_at: "2024-03-12T15:30:00Z"
  },
  {
    id: "10",
    amount: 2800.00,
    status: "completed",
    currency: "GBP",
    payment_type: "credit_card",
    created_at: "2024-03-11T09:45:00Z"
  }
];

export const demoUsers: User[] = [
  {
    _id: "1",
    userNumber: "USR001",
    userUID: "UID001",
    no: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    status: "active",
    finance: {
      total_order: 15,
      total_amount: 2500,
      total_paid: 2000,
      money_left: 500,
      refund_amount: 0,
      profit: 750
    },
    suspend: 0,
    isSuspended: "false",
    isBlocked: false,
    isDeleted: false,
    currency: "USD",
    enable_2fa: true,
    role: "customer",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-03-15T08:30:00Z"
  },
  {
    _id: "2",
    userNumber: "USR002",
    userUID: "UID002",
    no: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "active",
    finance: {
      total_order: 8,
      total_amount: 1800,
      total_paid: 1800,
      money_left: 0,
      refund_amount: 100,
      profit: 500
    },
    suspend: 0,
    isSuspended: "false",
    isBlocked: false,
    isDeleted: false,
    currency: "EUR",
    enable_2fa: false,
    role: "customer",
    createdAt: "2024-01-15T14:20:00Z",
    updatedAt: "2024-03-14T16:45:00Z"
  },
  {
    _id: "3",
    userNumber: "USR003",
    userUID: "UID003",
    no: 3,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    status: "suspended",
    finance: {
      total_order: 3,
      total_amount: 800,
      total_paid: 500,
      money_left: 300,
      refund_amount: 0,
      profit: 200
    },
    suspend: 1,
    isSuspended: "true",
    isBlocked: true,
    isDeleted: false,
    currency: "GBP",
    enable_2fa: true,
    role: "customer",
    createdAt: "2024-02-01T09:15:00Z",
    updatedAt: "2024-03-10T11:20:00Z"
  }
];

// Sample analytics data
export const demoUserAnalytics = {
  totalUsers: 3,
  activeUsers: 2,
  suspendedUsers: 1,
  totalOrders: 26,
  totalRevenue: 5100,
  totalProfit: 1450
};


import { OrderData } from "@/types/orderData";

const demoUserOrders: OrderData[] = [
  {
    _id: "ord_001",
    orderNumber: "ORD-2024-001",
    full_name: "E-commerce Website Development",
    project_requirement: "Build a modern e-commerce platform with payment integration",
    project_type: "Web Development",
    pay_currency: "USD",
    budget: 5000,
    project_deadline: "2024-05-15",
    reference_name: "John Smith",
    minimum_pay: 2500,
    project_details: "Full-stack e-commerce website with admin dashboard",
    accepted_terms: true,
    work_location: "Remote",
    paid_amount: 2500,
    balance_amount: 2500,
    profit: 1500,
    status: "working",
    userid: "user_001",
    orderid: "order_001",
    project_files: [],
    createdAt: "2024-03-01T10:00:00Z",
    __v: 0,
    user_signatory: {
      signature_type: "digital",
      signature: "user_signature_001"
    },
    admin_signatory: {
      signature_type: "digital",
      signature: "admin_signature_001"
    }
  },
  {
    _id: "ord_002",
    orderNumber: "ORD-2024-002",
    full_name: "Mobile App UI Design",
    project_requirement: "Design modern UI for iOS fitness app",
    project_type: "UI/UX Design",
    pay_currency: "USD",
    budget: 3000,
    project_deadline: "2024-04-20",
    reference_name: "Sarah Johnson",
    minimum_pay: 1500,
    project_details: "Complete UI kit with animations",
    accepted_terms: true,
    work_location: "Remote",
    paid_amount: 3000,
    balance_amount: 0,
    profit: 1000,
    status: "completed",
    userid: "user_001",
    orderid: "order_002",
    project_files: [],
    createdAt: "2024-02-15T09:00:00Z",
    __v: 0,
    user_signatory: {
      signature_type: "digital",
      signature: "user_signature_002"
    },
    admin_signatory: {
      signature_type: "digital",
      signature: "admin_signature_002"
    }
  },
  {
    _id: "ord_003",
    orderNumber: "ORD-2024-003",
    full_name: "SEO Optimization Project",
    project_requirement: "Improve website SEO rankings",
    project_type: "Digital Marketing",
    pay_currency: "USD",
    budget: 1500,
    project_deadline: "2024-04-10",
    reference_name: "Mike Brown",
    minimum_pay: 750,
    project_details: "Complete SEO audit and optimization",
    accepted_terms: true,
    work_location: "Remote",
    paid_amount: 0,
    balance_amount: 1500,
    profit: 500,
    status: "pending",
    userid: "user_001",
    orderid: "order_003",
    project_files: [],
    createdAt: "2024-03-10T14:00:00Z",
    __v: 0,
    user_signatory: {
      signature_type: "digital",
      signature: "user_signature_003"
    },
    admin_signatory: {
      signature_type: "digital",
      signature: "admin_signature_003"
    }
  }
];

export const demoDashboardOrderData = {
  totaluserorder: 8,
  totalpendingorders: 2,
  totalorderpayment: 3,
  totalwaitingorders: 1,
  totalworkingorders: 2,
  totalcancelledorders: 0,
  totalcompleteorders: 2,
  totaldeliveredorders: 1,
  totalcancelorders: 0,
  totalprojectamount: 15000,
  totalmoneyleft: 6000,
  userorders: demoUserOrders
};

const demoUserPayment: UserPaymentType[] = [
  {
    transaction_id: "1234567890",
    payment_type: "bank_transfer",
    amount: 1000,
    createdAt: "2024-03-01T10:00:00Z",
    status: "pending",
    _id: "1234567890"
  },
  {
    transaction_id: "1234567890",
    payment_type: "bank_transfer",
    amount: 1000,
    createdAt: "2024-03-01T10:00:00Z",
    status: "pending",
    _id: "1234567890"
  },
  {
    transaction_id: "1234567890",
    payment_type: "bank_transfer",
    amount: 1000,
    createdAt: "2024-03-01T10:00:00Z",
    status: "pending",
    _id: "1234567890"
  }
  ,
  {
    transaction_id: "1234567890",
    payment_type: "bank_transfer",
    amount: 1000,
    createdAt: "2024-03-01T10:00:00Z",
    status: "pending",
    _id: "1234567890"
  }
]
export const demoDashboardPaymentData = {
  totalpendingpayment: 1000,
  totaluserpayment: 1000,
  totalsumpayment: 1000,
  totalacceptedpayment: 1000,
  totalspampayment: 1000,
  userpayment: demoUserPayment
}
