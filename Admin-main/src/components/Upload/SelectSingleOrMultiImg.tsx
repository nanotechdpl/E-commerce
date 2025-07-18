import { Button, Upload, UploadProps } from "antd";
import classNames from "classnames";

const SelectSingleOrMultiImg = ({
  setFile,
  file,
  title,
  multiple,
}: {
  setFile: (file: any) => void;
  file: any;
  title: string;
  multiple?: boolean;
}) => {
  const onChangeWithCondition = (e: any) => {
    if (multiple && e.fileList.length >= 1) {
      const originalFilesArray = e.fileList.map((f: any) => f.originFileObj);
      setFile(originalFilesArray);
      return;
    }
    if (!multiple && e.fileList.length >= 1) {
      setFile([e.fileList[0]?.originFileObj]);
      return;
    }
    setFile("");
  };

  const fileProps: UploadProps = {
    beforeUpload: () => false,
    onChange: onChangeWithCondition,
    listType: "picture-card",
    maxCount: multiple ? 100 : 1,
    multiple: multiple || false,
  };

  return (
    <Upload
      className="p-5 md:min-w-[500px] flex items-center gap-5"
      {...fileProps}
      accept="image/*"
    >
      <Button
        style={{ background: "#3B82F6", color: "white" }}
        className={classNames("p-0 text-2xl", {
          "bg-green-600 text-white": file && file.length > 0,
        })}
      >
        {file && file.length >= 1
          ? `${multiple ? "Add More" : "Replace"} : ${
              file.length > 1 ? "Multiple Selected" : file[0]?.name
            }`
          : title}
      </Button>
    </Upload>
  );
};

export default SelectSingleOrMultiImg;
