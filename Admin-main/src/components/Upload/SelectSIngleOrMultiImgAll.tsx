import { Upload,UploadProps } from "antd";
import Image from "next/image";
import { useState } from "react";

const FileList = ({ files, onDelete }: { files: File[]; onDelete: (index: number) => void }) => {
  console.log(files)
  return (
  
    <div className="mt-2">
      {files.map((file, index) => (
        <div key={index} className="relative text-sm p-2 shadow-lg rounded-sm text-gray-700">
          <Image src={URL.createObjectURL(file)} width={38} height={38} className="rounded-sm w-[50px] h-[50px]" alt="upload" />
          <button
            onClick={() => onDelete(index)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

const SelectSingleOrMultiImgOrVideo = ({
  setFile,
  // file,
  // title,
  multiple,
  // style,
}: {
  setFile: (files: any) => void;
  // file: File[] | File | null;
  // title: string;
  multiple?: boolean;
  // style?: React.CSSProperties;
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onChangeWithCondition: UploadProps["onChange"] = (info: any) => {
    const fileList = info.fileList || [];
    if (multiple) {
      const originalFilesArray = fileList.map((f: any) => f.originFileObj);
      setFile(originalFilesArray);
      setUploadedFiles(originalFilesArray);
    } else {
      const selectedFile =
        fileList.length > 0 ? fileList[0]?.originFileObj : null;
      setFile(selectedFile);
      setUploadedFiles(selectedFile ? [selectedFile] : []);
    }
  };

  const handleDelete = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    setFile(newFiles);
  };

  const [fileProps] = useState<UploadProps>({
    beforeUpload: () => false, // Prevent default upload behavior
    onChange: onChangeWithCondition,
    listType: "picture",
    maxCount: multiple ? 100 : 1,
    multiple: !!multiple,
    accept: 'image/*',
    showUploadList: false, // Hide the uploaded file name
  });

  return (
    <div className="flex  gap-3 items-center">
      <Upload {...fileProps} className="flex items-center">
        <Image
          src={"/icons/upload.png"}
          width={38}
          height={38}
          className="object-contain"
          alt="upload"
        />
      </Upload>
      <FileList files={uploadedFiles} onDelete={handleDelete} />
    </div>
  );
};

export default SelectSingleOrMultiImgOrVideo;
