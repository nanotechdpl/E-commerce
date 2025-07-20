import Link from "next/link";
import ChatInterface from "../ChatInterface";
import { IAgency } from "@/types/agency";

const AgencyTable = ({
  agencies,
  poppins,
}: {
  agencies: IAgency[];
  poppins: any;
}) => {


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-[#0DB746]";
      case "Inactive":
        return "bg-[#3B6DCB]";
      case "Dormant":
        return "bg-[#1B368E]";
      case "Dissolved":
        return "bg-[#E70000CC]";
      case "Pending":
        return "bg-[#E4A81D]";
      default:
        return "bg-[#E4A81D]";
    }
  }


  function formatCustomUTC(dateString:string) {
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


  // Use real data from props instead of dummy data
  const realAgencies = agencies || [];

  return (
    <table className="table-auto w-full rounded border-collapse overflow-x-auto">
      <thead className="bg-[#FFB200] text-sm rounded-full">
        <tr>
          <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            No.
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            Agency ID
          </th>
          {/* <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            Agent Name
          </th> */}
          <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            Total Orders
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            Total Amount
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            Paid Amount
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            Due Amount
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            Refund Amount
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            Profit
          </th>
          {/* <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            Message
          </th> */}
          {/* <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            Deposit
          </th> */}
          {/* <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            Fee
          </th> */}
          {/* <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            Return
          </th> */}
          <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            Status
          </th>
          <th
            className={`${poppins.className} text-[#231F20] font-semibold px-2 py-4`}
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody className="text-center text-black">
        {realAgencies.map((agency: IAgency, rowIndex: number) => (
          <tr key={rowIndex} className="odd:bg-[#FAEFD8] even:bg-white">
            <td className="py-3 border-r border-r-[#FFB200] ">
              <div
                className={`${poppins.className} font-bold text-black text-[9.72px] leading-[22.58px] w-[22.48px] h-[22.28px] bg-[#FFB200] mx-auto`}
              >
                {rowIndex + 1}
              </div>
            </td>
            <td className="py-3 text-xs border-r border-r-[#FFB200]">{agency.agencyId}</td>
            {/* <td className="py-3 text-xs border-r border-r-[#FFB200]">
              {agency.agencyName}
            </td> */}
            <td className="py-3 text-xs border-r border-r-[#FFB200]">
              {/* TODO: Get actual order count from backend */}
              0
            </td>
            <td className="py-3 text-xs border-r border-r-[#FFB200]">
              {agency.depositAmount || 0} {agency.currency || 'USD'}
            </td>
            <td className="py-3 text-xs border-r border-r-[#FFB200]">
              {agency.feeAmount || 0} {agency.currency || 'USD'}
            </td>
            <td className="py-3 text-xs border-r border-r-[#FFB200]">
              {(agency.depositAmount || 0) - (agency.feeAmount || 0)} {agency.currency || 'USD'}
            </td>
            <td className="py-3 text-xs border-r border-r-[#FFB200]">
              {/* TODO: Get actual refund amount from backend */}
              0 {agency.currency || 'USD'}
            </td>
            <td className="py-3 text-xs border-r border-r-[#FFB200]">
              {agency.feeAmount || 0} {agency.currency || 'USD'}
            </td>
            {/* <td className="py-3 text-xs border-r border-r-[#FFB200]">
              {agency.depositAmount - agency.feeAmount}
            </td> */}
            <td className="py-3 text-xs px-2 border-r border-r-[#FFB200]">
              <div
                className={`${poppins.className
                  } font-bold text-black  text-[10.22px] px-3 w-fit rounded-lg ${getStatusColor(agency.status)} rounded-[5px] mx-auto`}
              >
                {agency.status}
              </div>
            </td>
            <td className="py-3 text-xs">
              <Link
                className="rounded-md bg-[#FFB200] px-3 py-1 text-[14px] text-black transition-all hover:bg-black hover:text-white hover:shadow-md"
                href={`/c/agency/view/${agency._id}/`}
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

export default AgencyTable;
