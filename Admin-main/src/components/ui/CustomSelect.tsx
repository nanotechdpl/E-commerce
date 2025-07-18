"use client";
import { Select } from "antd";
import React from "react";

type IOption = {
  value: string;
  label: string;
};

interface TCustomSelect {
  placeholder: string;
  options: IOption[];
  disabled?: boolean;
  className?: string; // Added className for Tailwind styling
}

const CustomSelect = ({ placeholder, options, disabled, className }: TCustomSelect) => {
  const selectValue = (value: string) => {
    console.log(value);
  };

  return (
    <Select
      placeholder={placeholder || "Please Select"}
      className={`${className}`} // Apply Tailwind and custom class
      options={options}
      onChange={selectValue}
      size="large"
      disabled={disabled}
    />
  );
};

export default CustomSelect;
