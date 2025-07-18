import React, { useState, useRef } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdCloudUpload } from "react-icons/md";
import Image from "next/image";


interface TableDataType  {
  namePerson: string;
  title: string;
  contactInfo: string;
  image: string;
}
const CompanyProfile: React.FC = () => {
  const [data] = useState([
    {
      sl: 1,
      id: 1,
      namePerson: "Software",
      title: "23-23-23",
      contactInfo: "View",
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  // const [isDeleteItem, setIsDeleteItems] = useState(false);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  // const [isChecked, setIsChecked] = useState(false);
  // const [isMessageSaved, setIsMessageSaved] = useState(false);
  // const [showConfirmation, setShowConfirmatin] = useState(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  // const [draggedRow, setDraggedRow] = useState<any>(null);
  // update hooks
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
  const [isUpdateMode, setIsupdateMode] = useState(false);
  const [updateIndex, setUpdateIndex] = useState<any>(null);
  // delete recor hooks
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteIndex] = useState<number>(0);

  // const handleDrageStart = (e: React.DragEvent<SVGElement>, index: any) => {
  //   setDraggedRow(index);
  //   e.dataTransfer.effectAllowed = "move";
  //   e.dataTransfer.setData("text/html", index);
  // };

  // const handleDragOver = (e: React.DragEvent<SVGElement>, index: number) => {
  //   e.preventDefault();
  // };

  // const handleDrop = (e: React.DragEvent<SVGElement>, index: number) => {
  //   e.preventDefault();
  //   const draggedRowIndex = Number(e.dataTransfer.getData("text/html"));
  //   const newTableData = [...tableData];
  //   const draggedRowData = newTableData[draggedRowIndex];

  //   newTableData.splice(draggedRowIndex, 1);
  //   newTableData.splice(index, 0, draggedRowData);
  //   setTableData(newTableData);
  //   setDraggedRow(null);
  // };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState({
    namePerson: "",
    title: "",
    contactInfo: "",
    image: "",
  });
  const [tableData, setTableData] = useState<TableDataType[]>([]);

  // const handleConfirmation = (confirmed: boolean) => {
  //   if (confirmed) {
  //     setIsChecked(!isChecked);
  //   }
  //   setShowConfirmatin(false);
  // };

  //   const handleCheckboxChange = (event: any, index: any) => {
  //     setActiveRowIndex(index===activeRowIndex ? null :index);
  //     if (isChecked) {
  //       setIsChecked(!isChecked);

  //     } else {
  //       setShowConfirmatin(true);
  //     }
  //   };

  const paginate = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  // const handleDeleteClick = (itemId: any) => {
  //   setIsDeleteItems(true);
  //   setDeleteIndex(itemId);
  // };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    const imageFile = selectedFiles[0];
    if (imageFile) {
      setInputValue((prevValues:TableDataType) => ({
        ...prevValues,
        image: URL.createObjectURL(imageFile),
      }));
    }
  };

  const handleInputChange = (feildName: string, value: string) => {
    setInputValue((prevValues:TableDataType) => ({
      ...prevValues,
      [feildName]: value,
    }));
  };

  const handleButtonClickInput = () => {
    if (isUpdateMode) {
      handleUpdateSubmit();
    } else {
      setTableData((prevData:TableDataType[]) => [...prevData, { ...inputValue }]);
      // for Clear input values
      setInputValue({
        namePerson: "",
        title: "",
        contactInfo: "",
        image: "",
      });
    }
  };

  const handleButtonImge = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setInputValue((prevValues:TableDataType) => ({
      ...prevValues,
      image: "",
    }));
    setShowRemoveConfirmation(false);
  };

  const handleRemoveConfirmation = () => {
    setShowRemoveConfirmation(true);
  };

  // updateData
  const handleUpdate = (index: any) => {
    setInputValue(tableData[index]);
    setIsupdateMode(true);
    setUpdateIndex(index);
  };

  const handleUpdateSubmit = () => {
    setShowUpdateConfirmation(true);
  };
  const confirmUpdate = () => {
    setTableData((prevData: any) => {
      const newData = [...prevData];
      newData[updateIndex] = { ...inputValue };
      return newData;
    });
    setInputValue({
      namePerson: "",
      title: "",
      contactInfo: "",
      image: "",
    });
    setIsupdateMode(false);
    setUpdateIndex(null);
    setShowUpdateConfirmation(false);
  };

  const cancelUpdate = () => {
    setShowUpdateConfirmation(false);
  };

  // updateData

  // Delete Data handle code

  // const handleRemoveRowFromTable = (index: any) => {
  //   setShowDeleteConfirmation(true);
  //   setDeleteIndex(index);
  // };
  const handleSingleDelete = (index: number) => {
    setTableData((prevData: TableDataType[]) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
  };
  const confirmDelete = () => {
    setTableData((prevData: TableDataType[]) => {
      const newData = [...prevData];
      newData.splice(deleteIndex, 1);
      return newData;
    });
    setShowDeleteConfirmation(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };
  // Delete Data handle code
  return (
    <div className="my-4">
      <table className="border-gray-300 w-full border-collapse rounded-md border">
        <caption className="m-8 text-center text-xl font-bold">
          Company Employee Profile
        </caption>
        <thead className=" font-bold">
          <tr className="w-14 bg-slate-200 text-black">
            <th className="border-gray-300 border p-2 text-sm">SL</th>
            <th className="border-gray-300 border p-2 text-sm">Photo</th>
            <th className="border-gray-300 border p-2 text-sm">Name</th>
            <th className="border-gray-300 border p-2 text-sm">Title</th>
            <th className="border-gray-300 border p-2 text-sm">Contact Info</th>
            <th className="border-gray-300 border p-2 text-sm">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className={`text-center font-medium `}>
            <td className="border-gray-300 border text-sm"></td>
            <label htmlFor="">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </label>
            {inputValue.image && (
              <div className="relative inline-block">
                <Image
                  src={inputValue.image}
                  alt="selected"
                  width={100}
                  height={100}
                />
                <span
                  onClick={handleRemoveConfirmation}
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    cursor: "pointer",
                  }}
                >
                  x
                </span>
              </div>
            )}

            {/* confirmation pop up  */}
            {showRemoveConfirmation && (
              <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-slate-700 bg-opacity-75">
                <div className="rounded-md bg-white p-4">
                  <p>Arue you sure Want to remove the image?</p>
                  <div className="mt-4 flex justify-end">
                    <button
                      className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white"
                      onClick={handleRemoveImage}
                    >
                      Yes
                    </button>
                    <button
                      className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white"
                      onClick={() => setShowRemoveConfirmation(false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* confirmation pop up  */}

            <td
              className="border-gray-300 mx-1 mt-2 flex w-[150px] cursor-default items-center justify-center gap-1 rounded-full border bg-yellow-500 p-2 text-sm font-bold hover:bg-yellow-400"
              onClick={handleButtonImge}
            >
              <MdCloudUpload size={30} />
              <span>Upload Photo</span>
            </td>
            <td className="border-gray-300 border p-2 text-sm ">
              <input
                type="text"
                value={inputValue.namePerson}
                onChange={(e) =>
                  handleInputChange("namePerson", e.target.value)
                }
                className="h-8 border-none p-1   "
                placeholder="Enter Contry Name...."
              />
            </td>
            <td className="border-gray-300 border p-2 text-sm">
              <input
                type="text"
                value={inputValue.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="h-8 border-none p-1 "
                placeholder="Enter Office Address...."
              />
            </td>
            <td className="border-gray-300 border p-2 text-sm">
              <input
                type="text"
                value={inputValue.contactInfo}
                onChange={(e) =>
                  handleInputChange("contactInfo", e.target.value)
                }
                className="h-8 border-none p-1 hover:border-none focus:border-none "
                placeholder="Enter Contact Detalis..."
              />
            </td>
            <td className=" border-gray-300  border p-2 text-sm">
              <button
                className="border-gray-300 mx-auto flex w-40 cursor-default items-center  justify-center gap-1 rounded-full border bg-orange-500 p-2 px-8 py-2 pt-2 text-lg font-bold hover:bg-orange-600  "
                onClick={handleButtonClickInput}
              >
                {isUpdateMode ? <div> Update </div> : <div> Add</div>}
              </button>
            </td>
          </tr>
          {tableData.map((item:TableDataType, index: number) => (
            <SingleRow
              key={index}
              index={index}
              item={item}
              handleSingleDelete={handleSingleDelete}
              handleUpdate={handleUpdate}
            />
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <ul className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index}>
              <button
                className={`${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 bg-slate-300"
                } rounded-full px-3 py-1`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* confirmation update pop up  */}
      {showUpdateConfirmation && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-slate-700 bg-opacity-75">
          <div className="rounded-md bg-white p-4">
            <p>Arue you sure Want to update the data</p>
            <div className="mt-4 flex justify-end">
              <button
                className="mr-2 rounded-md bg-green-500 px-4 py-2 text-white"
                onClick={confirmUpdate}
              >
                Yes
              </button>
              <button
                className="mr-2 rounded-md bg-slate-500 px-4 py-2 text-white"
                onClick={cancelUpdate}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* confirmation update pop up  */}
      {/* confirmation Delete Record  pop up  */}
      {showDeleteConfirmation && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-slate-700 bg-opacity-75">
          <div className="rounded-md bg-white p-4">
            <p>Arue you sure Want to delete this record?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="mr-2 rounded-md bg-rose-500 px-4 py-2 text-white"
                onClick={confirmDelete}
              >
                Yes
              </button>
              <button
                className="mr-2 rounded-md bg-slate-500 px-4 py-2 text-white"
                onClick={cancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* confirmation  Delete Record pop up  */}
    </div>
  );
};

const SingleRow = ({
  item,
  index,
  handleUpdate,
  handleSingleDelete,
}: {
  item: any;
  index: number;
  handleUpdate: any;
  handleSingleDelete: any;
}) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <tr key={index}>
      <td className="border-gray-300 border text-center text-sm">
        {/* {index + 1 + indexOfFirstItem} */}
        {index + 1}
      </td>

      <td className="border-gray-300 w-5 border p-2  text-sm ">
        <div className="flex items-center justify-center gap-2">
          <Image
            src={item?.image}
            alt="img"
            height={100}
            width={100}
            className="rounded"
          />
        </div>
      </td>
      <td
        className="border-gray-300 w-[100px] border p-2  text-sm font-semibold text-black  "
        style={{ overflowWrap: "break-word" }}
      >
        {item.namePerson}
      </td>
      <td
        className="border-gray-300 w-[100px] border p-2  text-sm font-semibold text-black  "
        style={{ overflowWrap: "break-word" }}
      >
        {item.title}
      </td>
      <td
        className="border-gray-300 wfont-bold w-[100px] border  p-2 text-sm font-semibold  text-black  "
        style={{ overflowWrap: "break-word" }}
      >
        {item.contactInfo}
      </td>
      <td className=" border-gray-300 border  p-2 text-sm  ">
        <div className="flex items-center justify-center gap-4">
          {/* Togale tbn */}
          <label className="flex cursor-pointer select-none items-center">
            <div className="relative">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`box block h-8 w-14 rounded-full ${
                  isChecked ? "bg-green-500" : "bg-slate-200"
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center  rounded-full bg-white  transition ${
                  isChecked ? "translate-x-full" : ""
                }`}
              ></div>
            </div>
          </label>

          <AiOutlineEdit
            className="h-5 w-5 cursor-pointer text-green-500"
            onClick={() => handleUpdate(index)}
          />
          <RiDeleteBin6Line
            onClick={() => handleSingleDelete(index)}
            className="text-red-500 h-5 w-5 cursor-pointer"
          />
        </div>
      </td>
    </tr>
  );
};

export default CompanyProfile;
