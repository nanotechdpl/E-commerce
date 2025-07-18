export const treeData = [
  {
    title: "Dashboards",
    value: "dashboard",
    key: "dashboard",
    children: [
      {
        title: "View",
        value: "view",
        key: "view_dashboard",
      },
    ],
  },
  {
    title: "Monthly Pay Track",
    value: "monthlyPay",
    key: "monthlyPay",
    children: [
      {
        title: "View",
        value: "view",
        key: "vew_monthlyPay",
      },
    ],
  },
  {
    title: "User",
    value: "user",
    key: "user",
    children: [
      {
        title: "View",
        value: "view",
        key: "view_user",
        children: [
          {
            title: "profile",
            value: "profile",
            key: "view_profile",
          },
          {
            title: "Orders",
            value: "order",
            key: "view_order",
          },
          {
            title: "Payment",
            value: "payment",
            key: "view_payment",
          },
          {
            title: "Refund",
            value: "refund",
            key: "view_refund",
          },
        ],
      },
      {
        title: "Edit",
        value: "edit",
        key: "edit_user",
        children: [
          {
            title: "Settings",
            value: "settings",
            key: "settings",
            children: [
              {
                title: "Account Delete",
                value: "accountDelete",
                key: "delete_account",
              },
              {
                title: "Account Active",
                value: "accountActive",
                key: "active_account",
              },
              {
                title: "Account Block",
                value: "accountBlock",
                key: "block_account",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    title: "Order Access",
    value: "orders",
    key: "orders",
    children: [
      {
        title: "Pending",
        value: "orders-pending",
        key: "orders-pending",
      },
      {
        title: "Payment",
        value: "orders-payment",
        key: "orders-payment",
      },
      {
        title: "Waiting",
        value: "orders-waiting",
        key: "orders-waiting",
      },
      {
        title: "Working",
        value: "orders-working",
        key: "orders-working",
      },
      {
        title: "Complete",
        value: "orders-complete",
        key: "orders-complete",
      },
      {
        title: "Canceled",
        value: "orders-canceled",
        key: "orders-canceled",
      },
    ],
  },
  {
    title: "Contact Us",
    value: "contactUs",
    key: "contact_us",
    children: [
      {
        title: "All",
        value: "all",
        key: "contact_us_all",
      },
    ],
  },
  {
    title: "Live Chat",
    value: "liveChat",
    key: "liveChat",
    children: [
      {
        title: "Offline Payment Issue",
        value: "liveChat-oflinePaymentIssue",
        key: "liveChat_oflinePaymentIssue",
      },
      {
        title: "Online Payment Issue",
        value: "liveChat-onlinePaymentIssue",
        key: "liveChat_onlinePaymentIssue",
      },
      {
        title: "Order Problems",
        value: "liveChat-orderProblems",
        key: "liveChat_orderProblems",
      },
      {
        title: "Account Problems",
        value: "liveChat-accountProblems",
        key: "liveChat_accountProblems",
      },
      {
        title: "Work Problem",
        value: "liveChat-workProblems",
        key: "liveChat_workProblems",
      },
      {
        title: "Others",
        value: "liveChat-others",
        key: "liveChat_others",
      },
    ],
  },
];
