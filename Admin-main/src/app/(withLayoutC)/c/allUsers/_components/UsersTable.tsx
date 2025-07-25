import { IUser } from "@/types/user";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});


const UsersTable = ({ users }: { users: IUser[] }) => {
  console.log("🚀 ~ UsersTable ~ users:", users)
  return (
    <div className="rounded-t-lg overflow-x-auto">
      <table className="min-w-full table-auto rounded border-collapse">
        <thead className="bg-[#FFB200] text-xs">
          <tr>
            <th
              className={`${poppins.className} px-2 py-4 text-[#231F20] font-semibold`}
            >
              No.
            </th>
            <th
              className={`${poppins.className} px-2 py-4 text-[#231F20] font-medium border-r`}
            >
              User ID
            </th>
            <th
              className={`${poppins.className} px-2 py-4 text-[#231F20] font-semibold border-r`}
            >
              Total Order
            </th>
            <th
              className={`${poppins.className} px-2 py-4 text-[#231F20] font-semibold border-r`}
            >
              Total Amount
            </th>
            <th
              className={`${poppins.className} px-2 py-4 text-[#231F20] font-semibold border-r`}
            >
              Paid Amount
            </th>
            <th
              className={`${poppins.className} px-2 py-4 text-[#231F20] font-semibold border-r`}
            >
              Due Amount
            </th>
            <th
              className={`${poppins.className} px-2 py-4 text-[#231F20] font-semibold border-r`}
            >
              Refund Amount
            </th>
            <th
              className={`${poppins.className} px-2 py-4 text-[#231F20] font-semibold border-r`}
            >
              Profit
            </th>
            {/* <th
              className={`${poppins.className} px-2 py-4 text-[#231F20] font-semibold border-r`}
            >
              Suspend
            </th> */}
            <th
              className={`${poppins.className} px-2 py-4 text-[#231F20] font-semibold border-r`}
            >
              Status
            </th>
            <th
              className={`${poppins.className} px-2 py-4 text-[#231F20] font-semibold`}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="text-center shadow-lg text-black">
          {Array.isArray(users) &&
            users?.slice(0, 5)?.map((item, rowIndex) => (
              <tr key={rowIndex} className="odd:bg-[#FAEFD8] text-xs even:bg-white">
                <td className="py-3 border-r border-r-[#FFB200]">
                  <div
                    className={`${poppins.className} font-bold text-[9.72px] leading-[22.58px] w-[22.48px] h-[22.28px] bg-[#FFB200] mx-auto`}
                  >
                    {rowIndex + 1}
                  </div>
                </td>
                <td className="py-3 border-r border-r-black">{item?.userUID}</td>
                <td className="py-3 border-r border-r-black">
                  {item.finance?.total_order ?? 0}
                </td>
                <td className="py-3 border-r border-r-black">
                  {item.finance?.total_amount ?? 0}
                </td>
                <td className="py-3 border-r border-r-black">
                  {item.finance?.total_paid ?? 0}
                </td>
                <td className="py-3 border-r border-r-black">
                  {item.finance?.money_left ?? 0}
                </td>
                <td className="py-3 border-r border-r-black">
                  {item.finance?.money_left ?? 0}
                </td>
                <td className="py-3 border-r border-r-black">
                  {item.finance?.profit ?? 0}
                </td>

                {/* <td className="py-3 border-r border-r-black">
                  <div
                    className={`${poppins.className} font-bold text-white text-[9.72px] leading-[22.58px] w-[22.48px] h-[22.28px] bg-[#322488] mx-auto`}
                  >
                    {item.isSuspended ? 1 : 0}
                  </div>
                </td> */}
                <td className="py-3 border-r border-r-black">
                  <div
                    className={
                      `${poppins.className} font-bold text-white text-[10.22px] leading-[15.34px] w-22 h-4 ` +
                      (item.status === "active"
                        ? "bg-[#00850D]"
                        : item.status === "block"
                        ? "bg-[#FF3D00E3]"
                        : item.status === "suspend"
                        ? "bg-[#E4A81D]"
                        : item.status === "dormant"
                        ? "bg-[#3B6DCB]"
                        : item.status === "closed"
                        ? "bg-[#DE1D1D]"
                        : "bg-[#322488]") +
                      " rounded-sm mx-auto"
                    }
                  >
                    {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Unknown"}
                  </div>
                </td>
                <td className="py-3">
                  <Link
                    className="rounded-md bg-[#FFB200] px-3 py-1 text-[14px] text-black transition-all hover:bg-black hover:text-white hover:shadow-md"
                    href={`/c/allUsers/${item._id}/profile`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
