import { DashboardAgencies } from "@/redux/fetures/dashboard/dashboardSlice";
import { IAgency } from "@/types/agency";
import { OrderData } from "@/types/orderData";
import moment from "moment";
import Link from "next/link";
import React from "react";
interface NewAgencyModelProps {
    isOpen: boolean;
    onClose: () => void;
    agencies?: DashboardAgencies | null
}





const NewAgencyModel: React.FC<NewAgencyModelProps> = ({ isOpen, onClose, agencies }) => {
    if (!isOpen) return null;

    return (
        <div className="text-black absolute top-[110%] right-0 w-fit  bg-white  h-fit  rounded-md shadow-md p-4   ">
            <div className="flex flex-row  justify-between    mb-2">
                <h2 className="header font-medium    text-sm font-inter">
                    New Agency
                </h2>
                <h2 className="header font-medium text-black  text-sm font-inter">
                    New {agencies?.totalAgency || 0}
                </h2>
            </div>
            <ul className="space-y-4">
                {agencies?.agencies
                    // ?.slice(0, 3)
                    ?.map((agency: IAgency, index: number) => (
                        <li
                            key={index}
                            className="flex items-start space-x-3 border-[0.5px]  border-[#00000030] rounded-md px-2 py-2"
                        >
                            {/* Name and role */}
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="font-inter text-sm text-nowrap text-ellipsis font-normal  text-black overflow-hidden">
                                    {agency.agencyName}
                                </p>
                                <p className="text-sm text-black/50 overflow-hidden text-ellipsis whitespace-nowrap">
                                    {agency.fullName}
                                </p>
                            </div>

                            <div className="flex-1 text-right">
                                <p className="text-xs text-nowrap text-gray-500">
                                    {moment(agency.createdAt).fromNow()}
                                </p>
                            </div>
                        </li>

                    ))}
            </ul>
            <Link href={"/c/orders"} className="flex justify-end mt-2 text-xs text-black/70">
                See more
            </Link>
        </div>

    );
};

export default NewAgencyModel;
