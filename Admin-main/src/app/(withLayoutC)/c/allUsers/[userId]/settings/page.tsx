"use client";
import { Poppins } from "next/font/google";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { deleteUser } from "../../actions";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

function Page() {
  const user: any = useSelector((state: RootState) => state.users?.userById);
  const dispatch = useDispatch();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    await dispatch(deleteUser(user?._id));
    setDeleting(false);
    router.push("/c/allUsers");
  };
  console.log("user from setting: ", user);
  return (
    <div className="w-full h-[calc(h-screen - 76px)] mt-[150px]">
      <div className="w-[516px] h-[288px] mx-auto bg-white border-[#D9D9D9] border-[0.52px] rounded-[15.69px] p-4">
        <div className="flex flex-col h-full justify-around">
          <div className="flex flex-row justify-center mt-7">
            <span className="font-inter font-medium text-[33.47px] leading-[33.47px] text-left text-[#131212]">
              Confirm Account Deletion
            </span>
          </div>
          <div className="flex flex-row justify-start">
            <span>
              Are you sure you want to delete your account and customer data
              from DoorDash?
            </span>
          </div>
          <div className="flex flex-row justify-start">
            <span>This action is permanent and cannot be undone</span>
          </div>
          <div className="flex flex-row justify-end mr-4">
            <button className="font-inter font-bold text-[16px] leading-[22.4px] text-[#000000] mr-8">
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className={`bg-[#EE404C] text-white ${poppins.className} font-medium text-base rounded-[5px] w-[185.15px] h-[39.68px]`}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
