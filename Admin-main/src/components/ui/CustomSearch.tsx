import React from "react";
import { Input } from "antd";
import "./CustomSearch.css"; // Import the custom CSS

const { Search } = Input;

const CustomSearch = ({
  onSearch,
  placeholder,
  className,
}: {
  onSearch: any;
  placeholder?: string;
  className?: string;
}) => {
  const props = {
    className: `custom-search w-full ${className}`,
    placeholder: placeholder || "Placeholder Text...",
    loading: false,
    onSearch: onSearch,
    enterButton: true,
  };
  return <Search {...props} />;
};

export default CustomSearch;
