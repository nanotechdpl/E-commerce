import React, { useEffect, useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getAllContacts } from "@/app/(withLayoutC)/c/footer/actions";
import { RootState } from "@/redux/store/store";
import { BiTrash } from "react-icons/bi";
import instance from "@/api/axios";
import {
  deleteContact,
  setContacts,
} from "@/redux/fetures/footer/contactSlice";
import { formatDate } from "@/lib/formatDate";

interface RowData {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  selected: boolean;
}

const ContactUsDropDownTable: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const contacts = useSelector((state: RootState) => state.contact.contacts);

  useEffect(() => {
    getAllContacts();
  }, [dispatch]);

  const handleSelectAll = () => {
    setSelectedContacts(contacts.map((item) => item._id));
  };

  // Handle individual checkbox toggle
  const handleCheckboxChange = (id: string) => {
    setSelectedContacts((prev) => [...prev, id]);
  };

  // Handle individual row removal
  const handleRemove = async (id: string) => {
    const res = await instance.delete(`/admin/contact-us/${id}`);
    if (res.data && res.data.success) {
      dispatch(deleteContact(id));
    }
  };



  useEffect(() => {
       const fetchContacts = async () => {
    const res = await instance.get("/admin/contact-us");
    console.log({ res });
    if (res.data) {
      dispatch(setContacts(res.data)); // <-- fix here
    }
  };
    fetchContacts();
  }, [dispatch]);

  return (
    <div className="p-2 ">
      {/* Table */}
      <form method="post" className="mr-auto">
          <input className="w-[10rem] outline-none border-none bg-white p-1" type="search" name="search" id="seach" placeholder=""/>
          <button className="w-[5rem] bg-[#FFB200] px-2 py-1" type="submit">Search</button>
      </form>
      <div className="mt-8 rounded-t-lg overflow-hidden">
        <table className="w-full shadow-lg text-left border-collapse">
          <thead className="">
            <tr className="bg-[#FFB200] text-black font-bold rounded-lg">
              <th className="px-2 py-4">No.</th>
              <th className="px-2 py-4">Name</th>
              <th className="px-2 py-4">Email</th>
              <th className="px-2 py-4">Phone No</th>
              <th className="px-2 py-4">Message</th>
              <th className="px-2 py-4">Date</th>
              <th className="px-2 py-4 text-center">
                <button onClick={handleSelectAll}>
                  <BiTrash className="text-red-500" />{" "}
                </button>
              </th>
              <th className="p-3 ">Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts
              .slice(0, showAll ? contacts.length : 5)
              .map((item, index) => (
                <tr
                  key={item._id}
                  className={`${
                    index % 2 === 0 ? "bg-[#FAEFD8]" : "bg-[#fff]"
                  }`}
                >
                  <td className="p-3 text-center text-black border-r border-black/20 ">
                    <button className="bg-[#FFB200] px-3 py-1 square-half font-semibold">
                      {index + 1}
                    </button>
                  </td>
                  <td className="p-3 text-black border-r border-black/20">
                    {item.name}
                  </td>
                  <td className="p-3 text-black whitespace-nowrap border-r border-black/20">
                    {item.email}
                  </td>
                  <td className="p-3 text-black whitespace-nowrap border-r border-black/20">
                    {item.phone}
                  </td>
                  <td className="p-3 text-black text-sm border-r border-black/20">
                    {item.message}
                  </td>
                  <td className="p-3 text-black whitespace-nowrap border-r border-black/20">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="p-3 text-center border-r border-black/20">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(item._id)}
                      onChange={() => handleCheckboxChange(item._id)}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="flex items-center gap-1 bg-[#ff4c4c] text-black px-4 py-1 rounded-full font-semibold"
                    >
                      <RiDeleteBin6Line /> Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="text-center mt-4">
        <p className="text-md mb-2 text-black font-bold">
          Showing {showAll ? 1 : 5} To {showAll ? contacts.length : 5} of{" "}
          {contacts.length} Results
        </p>
        {/* <button
          onClick={() => setShowAll(!showAll)}
          className="px-4 py-2 border bg-[#FFB200] rounded-full text-black hover:bg-black hover:text-white transition-colors"
        >
          {showAll ? "Show Less" : "More Results"}
        </button> */}
        <div className="rounded-[10px] w-[10rem] mx-auto border-[0.89px] border-white bg-[#FFB200] text-[#231F20] font-inter font-semibold text-[13px] leading-[15.73px] py-2 px-4">
          <span>More Results</span>
          <select name="" id="" className="ml-4">
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
              <option value="96">96</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ContactUsDropDownTable;
