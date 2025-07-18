import { DashboardReturns } from "@/redux/fetures/dashboard/dashboardSlice";
import { OrderData } from "@/types/orderData";
import { IWithdraw } from "@/types/payment";
import moment from "moment";
import Link from "next/link";
import React from "react";
interface NewReturnModelProps {
    isOpen: boolean;
    onClose: () => void;
    returns?: DashboardReturns | null
}

const NewReturnModel: React.FC<NewReturnModelProps> = ({ isOpen, onClose, returns }) => {
    if (!isOpen) return null;

    return (
        <div className="text-black absolute top-[110%] right-0 w-fit  bg-white  h-fit  rounded-md shadow-md p-4   ">
            <div className="flex flex-row  justify-between    mb-2">
                <h2 className="header font-medium    text-sm font-inter">
                    New returns
                </h2>
                <h2 className="header font-medium text-black  text-sm font-inter">
                    New {returns?.userrefund?.length || 0}
                </h2>
            </div>
            <ul className="space-y-4">
                {returns?.userrefund
                    ?.slice(0, 3)
                    ?.map((fund:IWithdraw, index: number) => (
                        <li
                            key={index}
                            className="flex items-start space-x-3 border-[0.5px]  border-[#00000030] rounded-md px-2 py-2"
                        >
                            {/* Name and role */}
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="font-inter text-sm font-normal  text-black overflow-hidden text-ellipsis whitespace-nowrap">
                                    {fund.account_name}
                                </p>
                                <p className="text-sm text-black/50 overflow-hidden text-ellipsis whitespace-nowrap">
                                    {fund.amount} USD
                                </p>
                            </div>

                            <div className="flex-1 text-right">
                                <p className="text-xs text-nowrap text-gray-500">
                                    {moment(fund.createdAt).fromNow()}
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

export default NewReturnModel;
