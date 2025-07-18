import { customUTCFormat } from "@/lib/formatDate";
import { UserPaymentType } from "@/redux/fetures/admin/userSlice";
import { Poppins } from "next/font/google";
import Link from "next/link";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const PaymentTable = ({ PaymentsData }: { PaymentsData: UserPaymentType[] }) => {
  console.log("🚀 ~ PaymentTable ~ PaymentsData:", PaymentsData);

  function formatUTCDate(isoDate: string) {
    const date = new Date(isoDate);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(date.getUTCFullYear()).slice(2); // Get last two digits of the year
    const hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format

    return `UTC.${month}-${day}-${year}.${formattedHours}:${minutes} ${period}`;
  }



  const getStatusColor = (status: string) => {
    switch (status) {
      case "spam":
        return "bg-[#DE1D1D]";
      case "pending":
        return "bg-[#FFB200]";
      case "accepted":
        return "bg-[#00EE0A]";
      default:
        return "bg-orange-600";
    }
  }

  return (
    <table className="table-auto w-full rounded border-collapse">
      <thead className="bg-[#FFB200] text-sm rounded-full">
        <tr>
          <th
            className={`${poppins.className} text-[#231F20] font-bold text-[13.85px] leading-[16.28px] px-2 py-4`}
          >
            No.
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-bold text-[13.85px] leading-[16.28px] px-2 py-4`}
          >
            Transaction ID
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-bold text-[13.85px] leading-[16.28px] px-2 py-4`}
          >
            Method
          </th>
          <th
            className={`flex flex-col ${poppins.className} text-[#231F20] font-bold text-[13.85px] leading-[16.28px] px-2 py-4`}
          >
            Amount
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-bold text-[13.85px] leading-[16.28px] px-2 py-4`}
          >
            Date & Time
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-bold text-[13.85px] leading-[16.28px] px-2 py-4`}
          >
            Status
          </th>

          <th
            className={`${poppins.className} text-[#231F20] font-bold text-[13.85px] leading-[16.28px] px-2 py-4`}
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody className="text-center text-black shadow-lg">
        {PaymentsData?.map((item, rowIndex) => (
          <tr key={rowIndex} className="odd:bg-[#FAEFD8] even:bg-white">
            <td className="py-4 border-r border-r-[#FFB200] ">
              <div
                className={`${poppins.className} font-bold text-[9.72px] leading-[22.58px] w-[22.48px] h-[22.28px] bg-[#FFB200] mx-auto`}
              >
                {rowIndex + 1}
              </div>
            </td>
            {/* Currency ISO */}
            <td className="py-4 border-r border-r-[#FFB200]">
              {item.transaction_id}
            </td>
            <td className="py-4 border-r border-r-[#FFB200]">
              {item.payment_type}
            </td>
            <td className="py-4 border-r border-r-[#FFB200]">{item.amount} USD</td>
            <td className="py-4 border-r border-r-[#FFB200]">
              {formatUTCDate(item.createdAt)}
            </td>
            {/* <td className="py-4 border-r border-r-[#FFB200]">{item.status}</td> */}

            <td className="py-4 border-r border-r-[#FFB200]">
              <div
                className={`${poppins.className
                  } font-bold text-white text-[10.22px] flex items-center justify-center leading-[15.34px] w-22 h-6 ${getStatusColor(item.status)} rounded-[5px] mx-auto`}
              >
                {item.status}
              </div>
            </td>
            <td className="py-4">
              <Link
                className="rounded-md bg-[#FFB200] px-3 py-1 text-[14px] text-black transition-all hover:bg-black hover:text-white hover:shadow-md"
                href={`/payment/${item._id}`}
              >
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PaymentTable;
