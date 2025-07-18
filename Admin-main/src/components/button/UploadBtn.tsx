import { LuUpload } from "react-icons/lu";
const UploadBtn = ({
  text,
  onClick,
  className,
}: {
  text: string;
  onClick?: any;
  className?: string;
}) => {
  return (
    <button
      className={`rounded bg-green-500 px-4
      py-2 text-xs text-white md:text-lg ${className} flex items-center gap-2 font-bold`}
      onClick={() => onClick()}
    >
      <LuUpload />
      <span>{text}</span>
    </button>
  );
};

export default UploadBtn;
