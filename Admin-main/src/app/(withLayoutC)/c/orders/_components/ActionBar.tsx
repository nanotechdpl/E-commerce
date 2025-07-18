"use client";

import React from "react";

interface IActionProps {
  service: string;
  setService: React.Dispatch<React.SetStateAction<string>>;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (e: React.FormEvent) => void;
}

const projectStatusOption = [
  { value: "All", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "payment", label: "Payment" },
  { value: "waiting", label: "Waiting" },
  { value: "working", label: "Working" },
  { value: "stopped", label: "Stopped" },
  { value: "completed", label: "Completed" },
  { value: "delivered", label: "Delivery" },
  { value: "refund", label: "Refund" },
  { value: "cancelled", label: "Cancel" },
];

const projectTypes = [
  { value: "All", label: "All" },
  { value: "technical", label: "Technical" },
  { value: "construction", label: "Construction" },
  { value: "realEstate", label: "Real Estate" },
  { value: "visaTravelling", label: "Visa-Travelling" },
  { value: "input-export", label: "Input-Export" },
  { value: "employeeHiring", label: "Employee Hiring" },
  { value: "business", label: "Business" },
];


const ActionBar = ({
  service,
  setService,
  status,
  setStatus,
  search,
  setSearch,
  handleSearch,
}: IActionProps) => {
  return (
    <div className="flex justify-end items-center gap-2 w-full px-1 py-2 rounded-lg">
      {/* Search Form */}
      <form method="get" className="mr-auto" onSubmit={handleSearch}>
        <input
          className="w-[10rem] outline-none border-none bg-white p-1"
          type="search"
          name="search"
          id="search"
          placeholder="User ID or Agency email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="w-[5rem] bg-[#FFB200] px-2 py-1" type="submit">
          Search
        </button>
      </form>

      {/* Service Type Select */}
      <select
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        value={service}
        onChange={(e) => setService(e.target.value)}
        className="min-w-[120px] rounded-lg px-2 py-2 bg-white text-black focus:outline-none"
      >
        <option value="" disabled>
          Service
        </option>
        {projectTypes.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {/* Status Select */}
      <select
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="min-w-[120px] rounded-lg px-2 py-2 bg-white text-black focus:outline-none"
      >
        <option value="" disabled>
          Status
        </option>
        {projectStatusOption.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ActionBar;