"use client";

import { FieldConfig, useField } from "formik";
import Image from "next/image";

type Props = React.ClassAttributes<HTMLInputElement> &
  React.InputHTMLAttributes<HTMLInputElement> &
  FieldConfig<unknown> & {
    label: string;
    icon: string;
    placeholder: string;
  };

function TextInput({ label, type, icon, placeholder, ...props }: Props) {
  const [field, meta] = useField(props);

  return (
    <div>
      <div className="relative">
        <span className="absolute left-6 top-1/2 -translate-y-1/2">
          <Image alt="Icon" src={icon} width={25} height={25} />
        </span>
        <input
          id={label}
          type={type}
          className="peer h-10 w-full text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 px-6 pl-[60px] rounded-[40px] bg-[#2F2F2F1A] py-7"
          placeholder={placeholder}
          {...field}
          {...props}
        />
        <label
          htmlFor={label}
          className="absolute left-[59px] -top-2 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-gray-600 peer-focus:text-sm"
        >
          {label}
        </label>
      </div>

      {meta.touched && meta.error ? (
        <div className="mt-1 text-sm text-red-400">{meta.error}</div>
      ) : null}
    </div>
  );
}

export default TextInput;
