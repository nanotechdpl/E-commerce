import HomeTab from "@/modules/home/components/Tabs/ServiceTabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "USUKC | Our Services",
  description: "We provide professional services",
};

const ServicePage = () => {
  return (
    <div className="w-full 2xl:p-10 overflow-hidden h-full ">

        <HomeTab />
   
    </div>
  );
};

export default ServicePage;
