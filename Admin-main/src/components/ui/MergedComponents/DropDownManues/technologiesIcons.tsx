"use client";
import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { BiPlusCircle } from "react-icons/bi";
import IconUpload from "./iconUpload";
const TecnologeyIcons: React.FC = () => {
  // Drop down manu
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // payment btn optoin of dropdown manu
  const CategoryOptions: string[] = ["Techonology"];

  type TechArray = string[];
  const [technologies, setTechnologies] = useState<TechArray>([
    "React",
    "Next.js  technology",
    "Ruby technology",
    "full-stack",
    "Python",
  ]);
  const [selectedOption, setSelectedOption] =
    useState<string>("Design Technology");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTechnology, setEditedTechnology] =
    useState<string>(selectedOption);
  const [showDropDown, setDropDown] = useState<boolean>(false);
  const [showTechonologyDropDown, setTechonologyGropDown] =
    useState<boolean>(false);

  const [inputValue, setInputValue] = useState<string>("");
  const handdleAddData = () => {
    if (inputValue.trim() !== "") {
      setTechnologies((preveOptions) => [...preveOptions, inputValue]);
      setInputValue("");
    }
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setEditedTechnology(option);
    setIsOpen(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    setTechnologies(
      technologies.map((tech) =>
        tech === selectedOption ? editedTechnology : tech,
      ),
    );
    setSelectedOption(editedTechnology);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setTechnologies(technologies.filter((tech) => tech !== selectedOption));
    setSelectedOption(technologies[0]); // Select the first remaining technology
  };

  return (
    <div className="mb-5 flex flex-col sm:flex-row  sm:space-x-5 ">
      <div className="  sm:w-1/2">
        <label className="block rounded bg-slate-700 font-medium"></label>
        {/* DropDoown Manu */}
        <div className="relative inline-block text-left ">
          <div>
            <span className="rounded-md shadow-sm">
              <button
                type="button"
                className="hover:text-gray-700 border-gray-300 z-50  inline-flex w-[250px] justify-between rounded-md border bg-blue-600  px-4 py-2 text-sm font-medium text-white outline-none  focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 active:bg-blue-600"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
                onClick={() => setDropDown(!showDropDown)}
              >
                {selectedOption || "Select Technology Category"}
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 0 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-.707.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          </div>

          
        </div>
      
        {showDropDown && (
          <div className="relative  w-[360px] py-3 md:w-full">
            {technologies.map((option) => (
              <div
                key={option}
                onClick={() => handleOptionClick(option)}
                
                className="border-gray-400 mb-2 flex w-[250px] flex-row items-center border p-1  text-sm font-bold"
              >
                <>
                  {isEditing && option === selectedOption ? (
                    <input
                      type="text"
                      className="border-gray-900 mr-1 h-7 w-[250px] rounded-md border p-2"
                      value={editedTechnology}
                      onChange={(e) => setEditedTechnology(e.target.value)}
                    />
                  ) : (
                    option
                  )}
                </>
                {isEditing && option === selectedOption ? (
                  <button
                    className=" my-1 flex w-[250px] items-center justify-center rounded-full bg-orange-400 px-1 py-1"
                    onClick={handleEditSubmit}
                  >
                    Save
                  </button>
                ) : (
                  <div className="absolute -right-15 ml-2 flex w-[230px] gap-1">
                    <div className="flex h-7 w-7 items-center  justify-center rounded-full bg-blue-300">
                      <MdEdit
                        onClick={handleEdit}
                        className="text-blue-400"
                        size={18}
                      />
                    </div>
                    <div className="flex h-7 w-7 items-center  justify-center rounded bg-rose-600">
                      <MdDelete
                        onClick={handleDelete}
                        className="text-rose-600"
                        size={20}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {" "}
        <div>
          <div className="flex  w-full">
            <h2 className="font-mdium flex h-[42px] w-[350px] items-center justify-center  whitespace-normal rounded-l-lg  bg-blue-900 text-center text-white">
              Techenology icon name
            </h2>
            <form>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="border-gray-900 w-full rounded-lg rounded-l-none border px-3  py-2"
              />
            </form>
          </div>
          <IconUpload />
          <button
            className="flex h-fit items-center rounded bg-orange-700 px-6 py-2 text-lg font-bold text-white hover:bg-orange-500 hover:text-black"
            onClick={handdleAddData}
          >
            ADD <BiPlusCircle size={28} className="pl-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TecnologeyIcons;
