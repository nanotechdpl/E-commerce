import { Form, TreeSelect } from "antd";
import { Controller } from "react-hook-form";

const { SHOW_PARENT } = TreeSelect;

const CustomTreeSelect = ({
  name,
  label,
  treeData,
  treeCheckable = true,
  showCheckedStrategy = SHOW_PARENT,
  disabled,
  placeholder,
}: {
  name: string;
  label: string;
  treeData: any;
  treeCheckable?: boolean;
  showCheckedStrategy?: any;
  placeholder?: string;
  disabled?: boolean;
}) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) => (
          <Form.Item label={label}>
            <TreeSelect
              {...field}
              treeData={treeData}
              treeCheckable={treeCheckable}
              showCheckedStrategy={showCheckedStrategy}
              size="large"
              treeIcon={() => ""}
            />
            {error && <small style={{ color: "red" }}>{error.message}</small>}
          </Form.Item>
        )}
      />
    </div>
  );
};

export default CustomTreeSelect;
