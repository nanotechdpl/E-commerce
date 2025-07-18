import Notice from "@/types/notice";

const noticeData: Notice[] = [
  {
    title: "Maintenance Downtime",
    updatedDate: "2025-01-01",
    status: "Ongoing",
    documents: ["https://example.com/maintenance-info.pdf"],
    visible: true,
  },
  {
    title: "New Features Release",
    updatedDate: "2025-01-05",
    status: "coming soon",
    documents: ["https://example.com/new-features.pdf"],
    visible: true,
  },
  {
    title: "Year-End Report",
    updatedDate: "2024-12-31",
    status: "expired",
    documents: ["https://example.com/year-end-report.pdf"],
    visible: true,
  },
  {
    title: "Policy Update Notice",
    updatedDate: "2024-11-20",
    status: "expired",
    documents: ["https://example.com/policy-update.pdf"],
    visible: true,
  },
  {
    title: "Community Guidelines",
    updatedDate: "2025-01-03",
    status: "Ongoing",
    documents: [
      "https://example.com/guidelines.pdf",
      "https://example.com/guidelines.pdf",
    ],
    visible: true,
  },
];

export default noticeData;
