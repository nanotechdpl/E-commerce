"use client";

import type React from "react";

import { type FieldConfig, useField } from "formik";
import Image from "next/image";
import { useState } from "react";

type Props = React.ClassAttributes<HTMLInputElement> &
  React.InputHTMLAttributes<HTMLInputElement> &
  FieldConfig<any> & {
    label: string;
    classname?: string;
    icon: string;
    placeholder: string;
    mainClassName?: string;
    inputClassName?: string;
  };

function TextInput({
  label,
  classname,
  type,
  icon,
  placeholder,
  mainClassName,
  inputClassName,
   ...props
}: Props) {
  const [field, meta] = useField(props);
  const [visibility, setVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setVisibility(!visibility);
  };

  return (
    <div className={`relative ${mainClassName}`}>
      {/* Left Icon */}
      <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <Image
          alt="Icon"
          src={icon || "/placeholder.svg"}
          width={20}
          height={20}
        />
      </span>

      {/* Input Field */}
      <input
        id={field.name}
        type={visibility ? "text" : type}
        className={inputClassName ? inputClassName : "peer h-14 w-full text-gray-900 bg-[#F5F5F5] rounded-md py-2 pl-12 pr-12 outline-none focus:ring-2 focus:ring-[#FFB200] transition-all"}
        placeholder=" "
        {...field}
        {...props}
      />

      {/* Floating Label */}
      <label
        htmlFor={field.name}
        className="absolute left-12 text-sm text-gray-500 duration-300 transform 
                   -translate-y-4 scale-75 top-2 z-10 origin-[0] 
                   bg-[#F5F5F5] px-2 peer-focus:px-2 
                   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                   peer-placeholder-shown:top-1/2 peer-focus:top-2 
                   peer-focus:scale-75 peer-focus:-translate-y-4 
                   peer-focus:text-[#FFB200] peer-focus:z-10"
      >
        {label}
      </label>

      {/* Password Visibility Toggle */}
      {type === "password" && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FFB200] focus:outline-none"
        >
          {visibility ? (
            <span className="text-[16px]">Hide</span>
          ) : (
            <span className="text-[16px]">Show</span>
          )}
        </button>
      )}

      {/* Error Message */}
      {meta.touched && meta.error && (
        <div className="mt-1 text-sm text-red-500">{meta.error}</div>
      )}
    </div>
  );
}

export default TextInput;
