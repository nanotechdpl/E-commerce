import { LoadingIcon } from "@/utils/Icons";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-linearGradient ">
      {/* <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-[#FFB200] border-t-transparent"></div> */}
      <div className="flex flex-col items-center justify-center">
        <LoadingIcon className="animate-spin h-16 w-16" />
        <p className="font-semibold text-[32px] leading-[32.11px] text-black-4 mt-5">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;
