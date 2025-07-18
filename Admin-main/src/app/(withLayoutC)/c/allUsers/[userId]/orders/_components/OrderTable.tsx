import { Poppins } from "next/font/google";
import Link from "next/link";
import ChatInterface from "../ChatInterface";
import { OrderData } from "@/types/orderData";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const EmptyState = ({ searchQuery }: { searchQuery?: string }) => (
  <tr>
    <td colSpan={8} className="py-10 bg-white">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="">
          <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0 1)" fill="none" fillRule="evenodd">
              <ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7"></ellipse>
              <g fillRule="nonzero" stroke="#d9d9d9">
                <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                <path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#fafafa"></path>
              </g>
            </g>
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {searchQuery ? 'No matching orders found' : 'No orders available'}
          </h3>
          <p className="text-gray-500">
            {searchQuery 
              ? 'Try adjusting your search terms or filters' 
              : 'Orders will appear here when they are created'}
          </p>
        </div>
      </div>
    </td>
  </tr>
);


const OrderTable = ({ orders,searchQuery }: { orders: OrderData[],searchQuery:string }) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-[#DE1D1D]";
      case "pending":
        return "bg-[#FFB200]";
      case "working":
        return "bg-[#00EE0A]";
      case "payment":
        return "bg-[#896024]"
      default:
        return "bg-[#00EE0A]";
    }
  }

  return (
    <table className="table-auto w-full rounded border-collapse ">
      <thead className="bg-[#FFB200] text-sm  rounded-full">
        <tr>
          <th className={`${poppins.className} text-[#231F20] font-semibold text-xs leading-[16.28px] px-2 py-4 border-r border-black`}>
            No.
          </th>
          <th className={`${poppins.className} text-[#231F20] font-semibold text-xs leading-[16.28px] px-2 py-4 border-r border-black`}>
            Project Name
          </th>
          <th className={`${poppins.className} text-[#231F20] font-semibold text-xs leading-[16.28px] px-2 py-4 border-r border-black`}>
            Total Amount
          </th>
          <th className={`${poppins.className} text-[#231F20] font-semibold text-xs leading-[16.28px] px-2 py-4 border-r border-black`}>
            Paid Amount
          </th>
          <th className={`${poppins.className} text-[#231F20] font-semibold text-xs leading-[16.28px] px-2 py-4 border-r border-black`}>
            Due Amount
          </th>
          <th className={`${poppins.className} text-[#231F20] font-semibold text-xs leading-[16.28px] px-2 py-4 border-r border-black`}>
            Message
          </th>
          <th className={`${poppins.className} text-[#231F20] font-semibold text-xs leading-[16.28px] py-3 px-2 border-r border-black`}>
            Status
          </th>
          <th className={`${poppins.className} text-[#231F20] font-semibold text-xs leading-[16.28px] px-2 py-4`}>
            Action
          </th>
        </tr>
      </thead>
      <tbody className="text-center text-black">

        {orders.length === 0 && (
          <EmptyState searchQuery={searchQuery} />
        )}
        {orders?.map((order: OrderData, rowIndex: number) => (
          <tr key={rowIndex} className="odd:bg-[#FAEFD8] text-sm even:bg-white ">
            <td className="py-4 border-r border-black">
              <div className={`${poppins.className} font-bold text-black text-[9.72px] leading-[22.58px] w-[22.48px] h-[22.28px] bg-[#FFB200] mx-auto`}>
                {rowIndex + 1}
              </div>
            </td>
            <td className="py-4 border-r border-black">{order.full_name}</td>
            <td className="py-4 border-r border-black">{order.budget}</td>
            <td className="py-4 border-r border-black">{order.paid_amount} USD</td>
            <td className="py-4 border-r border-black">{order.budget - order.paid_amount} USD</td>
            <td className="border-r border-black">
              <div className="ml-3">
                <ChatInterface />
              </div>
            </td>
            <td className="py-4 border-r border-black">
              <div className={`${poppins.className} font-semibold text-black text-[10.22px] py-[3px] px-2 rounded-[5px] ${getStatusColor(order.status)} w-fit h-fit block mx-auto`}>
                {order.status}
              </div>
            </td>
            <td className="py-4">
              <Link className="rounded-md bg-[#FFB200] px-3 py-1 text-[14px] text-black transition-all hover:bg-black hover:text-white hover:shadow-md" href={`/order/${order._id}`}>
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
