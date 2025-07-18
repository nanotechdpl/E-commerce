import React, {  useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";


interface FormState {
    title: string;
  tag: string;
  description: string;
  photo: File | null;
}

export default function FormsInCars({
  handleSubmit,
  isLoading
}: {
  handleSubmit: (data: any) => void;
  isLoading:boolean
}) {
  const [data, setData] = useState<FormState>({
      title: "",
    tag: "",
    description: "",
    photo: null,
  });
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(data);
  };
  return (
    <>
      <div className="mt-8">
        <form method="post" onSubmit={handleFormSubmit}>
          <div className="flex items-center justify-center gap-6 mb-4">
            
            <div>
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                placeholder="Enter title"
                name="title"
                onChange={(e) =>
                  setData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Tag</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                placeholder="Enter name"
                name="tag"
                onChange={(e) =>
                  setData((prev) => ({ ...prev, tag: e.target.value }))
                }
              />
            </div>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md cursor-pointer bg-yellow-600 mt-8 disabled:cursor-not-allowed`}
              disabled={isLoading}
              // onClick={() =>{handleSubmit(data);}}
            >
               {isLoading ? (
               <Loader2 className="animate-spin mr-2" size={20} />
             ) : null}
             {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              onChange={(e) =>
                setData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="bg-white w-full mt-4 rounded-md p-1 min-h-[20rem]"
              name=""
              id="description"
            ></textarea>
          </div>
          <div className="mt-4">
            <label htmlFor="fileInput">Upload</label>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                setData((prev) => ({
                  ...prev,
                  photo: file || null,
                }));
              }}
              type="file"
              id="fileInput"
              className="bg-white hidden w-full mt-4 rounded-md p-1 min-h-[20rem]"
              name="file" // <-- REQUIRED
            />
            <div
              onClick={() => document.getElementById("fileInput")?.click()}
              className="flex flex-col items-center justify-center bg-white w-full mt-4 rounded-md p-1 min-h-[20rem]"
            >
              <Image
                src="/solar_gallery-bold.png"
                alt="upload image"
                width={70}
                height={70}
              />
              <p>Browse file</p>
              <p>Drag and drop file here</p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
