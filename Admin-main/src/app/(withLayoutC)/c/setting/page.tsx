"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AccountChangeModal from "./_components/ActionChangeModal";
import ChangePassModal from "./_components/ChangePassModal";
import ForgotPassModal from "./_components/ForgetPassModal";

type Admin = {
  id: number;
  gmail: string;
  isActive: boolean;
};

const SettingPage = () => {
  return (
    <div className="w-full p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Settings" />
      <div className="mx-auto p-2 md:p-10 xl:w-[70%] xl:p-20">
        <div className="flex justify-between gap-1">
          <ForgotPassModal />
          <ChangePassModal />
          <AccountChangeModal />
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
