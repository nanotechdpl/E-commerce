import React, { useRef, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import {  RxCrossCircled } from "react-icons/rx";
import { Poppins } from "next/font/google";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Technical } from "@/redux/fetures/service/technicalSlice";


import CreatableSelect from "react-select/creatable";
import { Loader2 } from "lucide-react";
import { Blog } from "@/redux/fetures/service/blogSlice";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

interface CreateFormProps {
  formData: Blog;
  blog: any[];
  onClose: () => void;
  onSave: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: (index: number) => void;
  onFormChange: (field: string, value: any) => void;
  loading: boolean;
}

const CreateBlogForm: React.FC<CreateFormProps> = ({
  formData,
  blog,
  onClose,
  onSave,
  onImageChange,
  onDeleteImage,
  onFormChange,
  loading,
}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
   const editorRef = useRef(null);
   const [imagePreview, setImagePreview] = useState<string | null>(
     formData.photo
   );

   
   
   const handleClick = () => hiddenFileInput.current?.click();
  
   const handleImageChangeWithPreview = (
     e: React.ChangeEvent<HTMLInputElement>
   ) => {
     if (e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       const previewUrl = URL.createObjectURL(file);
       setImagePreview(previewUrl);
       onImageChange(e);
     }
   };
 
   const handleDeleteImageWithPreview = (index: number) => {
     setImagePreview(null);
     onDeleteImage(index);
   };
 


   return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
       <div className="w-[50%] h-[95%] bg-[#ccccff] p-8 rounded-lg shadow-lg ">
         <div className="flex justify-end">
           <button
             className="relative -top-4 -right-2 text-gray-700 text-lg"
             onClick={onClose}
           >
             <RxCrossCircled fontSize={30} />
           </button>
         </div>
 
         <div className="mb-4 flex items-center justify-between">
           <div className="flex flex-row items-center">
             <button
               className={`${poppins.className} font-semibold text-base bg-[#ffb200] w-25 h-16 rounded-[8px] disabled:cursor-not-allowed flex items-center justify-center gap-1  text-[#000000]`}
               onClick={handleClick}
               disabled={loading}
             >
                {loading ? (
               <Loader2 className="animate-spin mr-2" size={20} />
             ) : null}
             {loading ? "Uploading..." : "Photo"}
          
               
             </button>
             <input
               type="file"
               accept="image/*"
               style={{ display: "none" }}
               onChange={handleImageChangeWithPreview}
               ref={hiddenFileInput}
             />
             <div className="flex flex-row gap-3 ml-4">
               {(imagePreview || formData.photo) && (
                 <div className="relative w-[101px] h-20 bg-[#CCCCFF33] rounded shadow-xl">
                   {imagePreview ? (
                     <Image
                       src={imagePreview}
                       alt="Preview"
                       className="object-cover mt-3 mx-auto"
                       width={62}
                       height={50}
                     />
                   ) : formData.photo ? (
                     <Image
                       src={formData.photo}
                       width={62}
                       height={50}
                       alt="Preview"
                       className="object-cover mt-3 mx-auto"
                     />
                   ) : null}
                   <button
                     onClick={() => handleDeleteImageWithPreview(0)}
                     className="absolute top-0 right-0 text-white rounded-full w-6 h-6 flex items-center justify-center"
                   >
                     <BsTrash3 color="red" />
                   </button>
                 </div>
               )}
             </div>
           </div>
           <button
             type="button"
             className="bg-[#ffb200] w-44 h-[45px] disabled:cursor-not-allowed rounded-lg text-[#000000] flex items-center justify-center"
             onClick={onSave}
             disabled={loading}
           >
             {loading ? (
               <Loader2 className="animate-spin mr-2" size={20} />
             ) : null}
             {loading ? "Saving..." : "Save"}
           </button>
         </div>
 
         <div className="flex space-x-6">
           <div className="flex flex-col w-[690px]">
             <div className="flex flex-col w-full ">
               <span className="flex flex-col">
                 <label
                   className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#000000]/50`}
                 >
                   Title
                 </label>
                 <input
                   type="text"
                   className="rounded-[5px] w-[300px] h-14 border border-[#000000] bg-white p-2 outline-none"
                   value={formData.title}
                   onChange={(e) => onFormChange("title", e.target.value)}
                   name="title"
                   id="title"
                 />
               </span>
               <span className="flex flex-col">
                 <label
                   className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#000000]/50`}
                 >
                   Tag
                 </label>
                 <input
                   type="text"
                   className="rounded-[5px] w-[300px] h-14 border border-[#000000] bg-white p-2 outline-none"
                   value={formData.tag}
                   onChange={(e) => onFormChange("tag", e.target.value)}
                   name="tag"
                   id="tag"
                 />
               </span>
             
             </div>
 
             <div className="bg-white mt-6 p-2 rounded-[10px] border border-[#000000]">
               <label
                 className={`${poppins.className} font-normal text-[16px] leading-[31px] text-[#00000099]`}
               >
                 Description
               </label>
               <JoditEditor
                 ref={editorRef}
                 value={formData.description}
                 config={{ height: 200 }}
                 onBlur={(newContent) => onFormChange("description", newContent)}
               />
             </div>
           </div>
         </div>
       </div>
     </div>
   );
};

export default CreateBlogForm;
