"use client";

import { type FieldConfig, useField } from "formik";
import type React from "react";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type Props = React.ClassAttributes<HTMLInputElement> &
  React.InputHTMLAttributes<HTMLInputElement> &
  FieldConfig<any> & {
    label: string;
    classname?: string;
    icon?: React.ReactNode;
    placeholder: string;
  };

function TextInput({
  label,
  classname,
  type,
  icon,
  placeholder,
  ...props
}: Props) {
  const [field, meta] = useField(props);
  const [visibility, setVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setVisibility(!visibility);
  };

  return (
    <div className={`${classname}  flex-1`}>
      <div className="relative  w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          id={label}
          type={type === "password" && visibility ? "text" : type}
          className="peer !outline-none h-12 bg-transparent w-full text-gray-900 placeholder-transparent focus:!outline-none  px-3 pl-10 pr-10 rounded-md bg-white"
          placeholder={placeholder}
          style={{outline: 'none'}}
          {...field}
          {...props}
        />
        <label
          htmlFor={label}
          className="absolute left-10 -top-2 bg-white px-1 text-xs text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2 peer-focus:text-gray-600 peer-focus:text-xs"
        >
          {label}
        </label>
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute  top right-0 text-gray-400 hover:text-[#ffb200] focus:outline-none"
          >
            {visibility ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {meta.touched && meta.error ? (
        <div className="mt-1 text-sm text-red-400">{meta.error}</div>
      ) : null}
    </div>
  );
}

export default TextInput;
