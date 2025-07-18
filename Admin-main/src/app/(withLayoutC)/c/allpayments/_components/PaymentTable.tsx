import { Poppins } from "next/font/google";
import Link from "next/link";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const PaymentTable = ({ PaymentsData }: { PaymentsData: any[] }) => {

  function formatCustomUTC(dateString: string) {
    const date = new Date(dateString);
    const year = String(date.getUTCFullYear()).slice(-2);
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 
    return `UTC.${month}-${day}-${year}. ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

// Example usage
console.log(formatCustomUTC("2025-02-06T12:24:14.355Z")); 
// Output: UTC.02-06-25. 12:24 PM

  return (
    <table className="table-auto w-full rounded border-collapse">
      <thead className="bg-[#FFB200] text-sm rounded-full">
        <tr>
          <th
            className={`${poppins.className} text-[#231F20] font-bold text-[13.85px] leading-[16.28px] p-2`}
          >
            No.
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-bold text-[13.85px] leading-[16.28px] p-2`}
          >
            Transaction ID
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-bold text-[13.85px] leading-[16.28px] p-2`}
          >
            Payment Method
          </th>
          <th
            className={`flex flex-col ${poppins.className} text-[#231F20] font-bold text-[13.85px] leading-[16.28px] p-2`}
          >
            Ammount
            <span className="text-red">Bank/Wallet</span>
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-bold text-[13.85px] leading-[16.28px] p-2`}
          >
            Payment Day
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-bold text-[13.85px] leading-[16.28px] p-2`}
          >
            Status
          </th>

          <th
            className={`${poppins.className} text-[#231F20] font-bold text-[13.85px] leading-[16.28px] p-2`}
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody className="text-center text-black shadow-lg">
        {PaymentsData?.map((item, rowIndex) => (
          <tr key={rowIndex} className="odd:bg-[#FAEFD8] even:bg-white">
            <td className="py-3 border-r border-r-[#FFB200] ">
              <div
                className={`${poppins.className} font-bold text-[9.72px] leading-[22.58px] w-[22.48px] h-[22.28px] bg-[#FFB200] mx-auto`}
              >
                {rowIndex + 1}
              </div>
            </td>
            {/* Currency ISO */}
            <td className="py-3 border-r border-r-[#FFB200]">
              {item.transaction_id}
            </td>
            <td className="py-3 border-r border-r-[#FFB200]">
              {item.payment_type}
            </td>
            <td className="py-3 border-r border-r-[#FFB200]">{item.amount}</td>
            <td className="py-3 border-r border-r-[#FFB200]">
              {formatCustomUTC(item.createdAt)}
            </td>

            <td className="py-3 border-r border-r-[#FFB200]">
              <div
                className={`${
                  poppins.className
                } font-bold text-white text-[10.22px] leading-[15.34px] w-22 h-4 ${
                  item.status === "spam"
                    ? "bg-[#DE1D1D]"
                    : item.status === "pending"
                    ? "bg-[#FFB200]"
                    : item.status === "accepted"
                    ? "bg-[#00EE0A]"
                    : "bg-orange-600"
                } rounded-sm mx-auto`}
              >
                {item.status}
              </div>
            </td>
            <td className="py-3">
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
