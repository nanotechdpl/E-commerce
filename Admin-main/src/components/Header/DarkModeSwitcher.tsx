import useColorMode from "@/hooks/useColorMode";
import { IoIosMoon } from "react-icons/io";
import { IoSunnyOutline } from "react-icons/io5";

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <li>
      <label
        className={`relative mr-6  h-7.5 w-11 ${
          colorMode === "dark" ? "bg-primary" : "bg-stroke"
        }`}
      >
        <input
          type="checkbox"
          onChange={() => {
            if (typeof setColorMode === "function") {
              setColorMode(colorMode === "light" ? "dark" : "light");
            }
          }}
          className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`absolute left-[3px] top-1/2 flex h-6 w-6 -translate-y-1/2 translate-z-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
            colorMode === "dark" && "!right-[3px] !translate-z-full"
          }`}
        >
          <span className=" bg-[#F8F6F0] text-black-2 rounded-full border-2 border-[#000]">
            <IoIosMoon size={24} />
          </span>
          <span className="hidden ">
            <IoSunnyOutline size={24} />
          </span>
        </span>
      </label>
    </li>
  );
};

export default DarkModeSwitcher;
