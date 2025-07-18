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
      case "Dorman":
        return "bg-[#1B368E]";
      case "Dissolved":
        return "bg-[#E70000CC]";
      case "Pending":
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


  const demoAgencies: IAgency[] = [
    {
      _id: "1",
      fullName: "John Doe",
      agencyName: "Doe Agency",
      grade: "A",
      createdAt: "2023-10-01T12:00:00Z",
      depositAmount: 1000,
      feeAmount: 100,
      status: "Active",
      nationality: "American",
      nationalIdOrPassport: "123456789",
      phoneNumber: "123-456-7890",
      personalEmail: "john.doe@example.com",
      permanentAddress: "123 Main St, Anytown, USA",
      personalDocuments: [],
      agencyLogo: "",
      serviceDivision: "Sales",
      serviceArea: "North America",
      employees: ["Employee 1", "Employee 2"],
      officeAddress: "123 Main St, Anytown, USA",
      phoneNumberOffice: "123-456-7890",
      officeEmail: "office@doeagency.com",
      agencyDocuments: [],
      description: "A leading sales agency.",
      currency: "USD",
      userId: "user1",
      socialLinks: [],
      updatedAt: "2023-10-01T12:00:00Z",
      agencyId: "AG001",
      __v: 0,
    },
    {
      _id: "2",
      fullName: "Jane Smith",
      agencyName: "Smith Agency",
      grade: "B",
      createdAt: "2023-09-15T08:30:00Z",
      depositAmount: 1500,
      feeAmount: 150,
      status: "Inactive",
      nationality: "Canadian",
      nationalIdOrPassport: "987654321",
      phoneNumber: "987-654-3210",
      personalEmail: "jane.smith@example.com",
      permanentAddress: "456 Elm St, Othertown, Canada",
      personalDocuments: [],
      agencyLogo: "",
      serviceDivision: "Marketing",
      serviceArea: "Canada",
      employees: ["Employee 3", "Employee 4"],
      officeAddress: "456 Elm St, Othertown, Canada",
      phoneNumberOffice: "987-654-3210",
      officeEmail: "office@smithagency.com",
      agencyDocuments: [],
      description: "A top marketing agency.",
      currency: "CAD",
      userId: "user2",
      socialLinks: [],
      updatedAt: "2023-09-15T08:30:00Z",
      agencyId: "AG002",
      __v: 0,
    },
    {
      _id: "3",
      fullName: "Alice Johnson",
      agencyName: "Johnson Agency",
      grade: "C",
      createdAt: "2023-08-20T14:45:00Z",
      depositAmount: 2000,
      feeAmount: 200,
      status: "Pending",
      nationality: "British",
      nationalIdOrPassport: "1122334455",
      phoneNumber: "555-123-4567",
      personalEmail: "alice.johnson@example.com",
      permanentAddress: "789 Maple St, Sometown, UK",
      personalDocuments: [],
      agencyLogo: "",
      serviceDivision: "Support",
      serviceArea: "UK",
      employees: ["Employee 5", "Employee 6"],
      officeAddress: "789 Maple St, Sometown, UK",
      phoneNumberOffice: "555-123-4567",
      officeEmail: "office@johnsonagency.com",
      agencyDocuments: [],
      description: "A reliable support agency.",
      currency: "GBP",
      userId: "user3",
      socialLinks: [],
      updatedAt: "2023-08-20T14:45:00Z",
      agencyId: "AG003",
      __v: 0,
    },
  ];

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
        {demoAgencies.map((agency: IAgency, rowIndex: number) => (
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
              {Math.floor(Math.random() * 100)}
            </td>
            <td className="py-3 text-xs border-r border-r-[#FFB200]">{Math.floor(Math.random() * 100)} USD</td>
            <td className="py-3 text-xs border-r border-r-[#FFB200]">{Math.floor(Math.random() * 100)} USD</td>
            
            {/* <td className="py-3 text-xs border-r border-r-[#FFB200]">
              <ChatInterface />
            </td> */}
            <td className="py-3 text-xs border-r border-r-[#FFB200]">
              {agency.depositAmount} USD
            </td>
            <td className="py-3 text-xs border-r border-r-[#FFB200]">
              {agency.depositAmount} USD
            </td>
            <td className="py-3 text-xs border-r border-r-[#FFB200]">
              {agency.feeAmount} USD
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
