import SelectSingleOrMultiImg from "@/components/Upload/SelectSingleOrMultiImg";
import PrimaryButton from "@/components/button/PrimaryButton";
import { Button, Checkbox, Input } from "antd";
import Image from "next/image";
import { useRef, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

const CreateFeatured = () => {
  const inputRef = useRef<any>(null);
  const [topics, setTopics] = useState([
    {
      id: 1,
      title: "Non Proits",
      icChecked: false,
    },
    {
      id: 2,
      title: "Doners",
      icChecked: true,
    },
  ]);
  const [file, setFile] = useState([]);
  const onSave = () => {
    const title = inputRef?.current?.input?.value;
    if (!title) {
      return;
    }
    setTopics([...topics, { id: topics.length + 1, title, icChecked: false }]);
  };
  return (
    <div className="p-5">
      <p className="my-3 text-center text-2xl font-bold">
        Create Featured Work Photo
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="col-span-1 ">
          <div className="mb-3  flex gap-2">
            <Input
              ref={inputRef}
              className="flex-1"
              placeholder="Enter Topic Name.."
              type="text"
            />
            <Button onClick={onSave}>Save</Button>
          </div>
          {topics.length > 0 && (
            <div className="space-y-3">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between gap-2 bg-white p-2 shadow-2"
                >
                  <span className="font-semibold">{topic.title}</span>
                  <div className="flex items-center gap-2">
                    <Checkbox />
                    <MdDelete size={20} className="text-rose-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-span-3 space-y-3 py-10">
          <div>
            <div className="flex items-center justify-center gap-3">
              <SelectSingleOrMultiImg
                setFile={setFile}
                file={file}
                title="Select File"
              />
              <PrimaryButton text="Uplode" />
            </div>
          </div>
          <div className="mx-auto  flex flex-wrap  items-center  justify-center gap-4 space-y-2">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <SingleFeatured item={item} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SingleFeatured = ({ item }: { item: any }) => {
  const { title, blog } = item;
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className={`w-[350px] text-center font-medium`}>
      <div className="flex flex-col  px-2 ">
        <div className="flex items-center justify-between gap-1 bg-slate-300 p-2 ">
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
                  isChecked ? "bg-green-500" : "bg-slate-400"
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
            className=" cursor-pointer text-blue-600"
            // onClick={() => handleUpdate(index)}
            // onClick={() => setIsVisible(true)}
            size={30}
          />
          <MdDelete
            // onClick={() => handleRemoveRowFromTable(index)}
            className="cursor-pointer  text-rose-600"
            size={30}
          />
        </div>

        <div className="w-full">
          <Image
            height={380}
            alt="img"
            width={380}
            src={
              "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg"
            }
          />
        </div>
      </div>
    </div>
  );
};
export default CreateFeatured;
