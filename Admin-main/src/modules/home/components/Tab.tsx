import { Dispatch, SetStateAction } from "react";

const Tab = ({
  isVisible,
  setIsVisible,
  name,
}: {
  isVisible: string | null;
  setIsVisible: Dispatch<SetStateAction<string | null>>;
  name: string;
}) => {
  return (
    <span
      onClick={() => setIsVisible(name)}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg ${isVisible === name ? "bg-[#000]" : "bg-primary"} p-2 text-center text-sm font-medium
      text-white hover:bg-opacity-90 md:text-base lg:px-8 xl:px-8 xl:py-2 xl:text-lg `}
    >
      {name}
    </span>
  );
};

export default Tab;
