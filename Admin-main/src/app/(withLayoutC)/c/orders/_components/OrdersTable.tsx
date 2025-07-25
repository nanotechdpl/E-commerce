import { Poppins } from "next/font/google";
import Link from "next/link";
import { useChatContext } from "@/modules/live-chat/hooks/useChatContext";
import { OrderData } from "@/types/orderData";
import dynamic from "next/dynamic";
import { useState } from "react";
import PaymentHistory from "../../orders/update/_components/PaymentHistory";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const formatToDDMMYYYY = (isoDate: any) => {
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getUTCFullYear();

  return `${day}-${month}-${year}`;
};

const LiveChatManage = dynamic(() => import("@/modules/live-chat/LiveChatManage").then(mod => mod.LiveChatManage), { ssr: false });

const OrdersTable = ({ orders }: { orders: OrderData[] }) => {
  const { updateReceiverId, updateIsChatSelect } = useChatContext();
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatUserId, setChatUserId] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);

  const openChatModal = (userId: string) => {
    setChatUserId(userId);
    updateReceiverId(userId);
    updateIsChatSelect(true);
    setChatModalOpen(true);
  };

  const closeChatModal = () => {
    setChatModalOpen(false);
    setChatUserId(null);
  };

  const openPaymentModal = (orderId: string) => {
    setPaymentOrderId(orderId);
    setPaymentModalOpen(true);
  };
  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setPaymentOrderId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-[#F9C23C]";
      case "payment":
        return "bg-[#FFD700]";
      case "waiting":
        return "bg-[#F4D03F]";
      case "working":
        return "bg-[#5DADE2]";
      case "stopped":
        return "bg-[#A569BD]";
      case "completed":
        return "bg-[#2ECC71]";
      case "delivered":
        return "bg-[#27AE60]";
      case "refund":
        return "bg-[#F1948A]";
      case "cancelled":
        return "bg-[#E74C3C]";
      default:
        return "bg-[#FFB200]";
    }
  }
  return (
    <>
      {chatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl relative">
            <button
              className="absolute top-2 right-2 text-black bg-[#FFB200] rounded-full px-2 py-1"
              onClick={closeChatModal}
            >
              Close
            </button>
            <LiveChatManage />
          </div>
        </div>
      )}
      {paymentModalOpen && paymentOrderId && (
        <PaymentHistory orderId={paymentOrderId} onClose={closePaymentModal} />
      )}
      <table className="w-full overflow-x-scroll rounded-lg border-collapse ">
      <thead className="bg-[#FFB200] text-sm">
        <tr>
          {[
            "No.",
            "Order ID",
            "User / Agency Email",
            "Project Name",
            "Total Amount",
            "Paid Amount",
            "Due Amount",
            "Message",
            "Transaction List",
            // "Delivery Date",
            "Profits",
            "Status",
            "Action",
          ].map((header, index) => (
            <th
              key={index}
              className={`${poppins.className} px-2 py-4 text-[#231F20] font-semibold`}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="text-center text-black">
        {orders &&
          orders?.map((order: OrderData, rowIndex: number) => (
            <tr
              key={rowIndex}
              className={`${
                rowIndex % 2 === 0 ? "bg-[#FAEFD8]" : "bg-white"
              }   `}
            >
              <td className="py-3 border-r border-r-[#FFB200]">
                <span
                  className={`${poppins.className} font-bold text-black text-[9.72px] leading-[22.58px] w-[22.48px] h-[22.28px] bg-[#FFB200] mx-auto block `}
                >
                  {rowIndex + 1}
                </span>
              </td>
              <td className="py-3 border-r border-r-[#FFB200]">
                {order?.orderId}
              </td>
              <td className="py-3 border-r border-r-[#FFB200]">
                {order?.email}
              </td>
              <td className="py-3 border-r border-r-[#FFB200]">
                {order?.serviceName
}
              </td>
              <td className="py-3 border-r border-r-[#FFB200]">
                {order?.priceOrBudget || order?.salaryOrBudget} {order?.payCurrency}
              </td>
              <td className="py-3 border-r border-r-[#FFB200]">
                {order.paid_amount}
              </td>
              <td className="py-3 border-r border-r-[#FFB200]">
                {((order?.priceOrBudget || order?.salaryOrBudget || 0) - (order.paid_amount || 0)).toFixed(2)}
              </td>
              <td className="py-3 border-r border-r-[#FFB200]">
                <button
                  onClick={() => openChatModal(order.userid)}
                  className="rounded-md bg-[#FFB200] px-3 py-1 text-black transition-all hover:bg-black hover:text-white"
                >
                  Message
                </button>
              </td>
              <td className="py-3 border-r border-r-[#FFB200]">
                <button
                  onClick={() => openPaymentModal(order._id)}
                  className="rounded-md bg-[#FFB200] px-3 py-1 text-black transition-all hover:bg-black hover:text-white"
                >
                  Transaction List
                </button>
              </td>
              {/* <td className="py-3 border-r border-r-[#FFB200]">
                {formatToDDMMYYYY(order.project_deadline)}
              </td> */}
              <td className="py-3 border-r border-r-[#FFB200]">
                {order.profit || 0}
              </td>
              <td className="py-3 border-r border-r-[#FFB200]">
                <span
                  className={`${
                    poppins.className
                  } font-bold text-black w-fit text-[10.22px] py-[2px] px-3 rounded-[5px]  ${getStatusColor(order.orderStatus)}  block mx-auto`}
                >
                  {order?.orderStatus}
                </span>
              </td>
              <td className="py-3">
                <Link
                  className="rounded-md bg-[#FFB200] px-3 py-1 text-[14px] text-black transition-all hover:bg-black hover:text-white hover:shadow-md"
                  href={`/c/orders/update?orderId=${order?._id}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
    </>
  );
};

export default OrdersTable;
