import { Form, Input } from "antd";
import { Controller } from "react-hook-form";

const CustomInput = ({
  type,
  name,
  label,
  className,
  placeholder,
  disabled,
  style,
  addonAfter,
  defaultValue,
}: {
  type: string;
  name: string;
  label: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties; 
  addonAfter?: React.ReactNode;
  defaultValue?: any;
}) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) => (
          <Form.Item label={label}>
            {type === "password" ? (
              <Input.Password
                {...field} 
                type={type}
                id={name}
                className={className}
                size="large"
                disabled={disabled}
                placeholder={placeholder}
                addonAfter={addonAfter}
              />
            ) : (
              <Input
                {...field} 
                type={type}
                id={name}
                size="large"
                disabled={disabled}
                placeholder={placeholder}
                className={className}
                style={style}
                addonAfter={addonAfter}
                defaultValue={defaultValue}
              />
            )}
            {error && <small style={{ color: "red" }}>{error.message}</small>}
          </Form.Item>
        )}
      />
    </div>
  );
};

export default CustomInput;
