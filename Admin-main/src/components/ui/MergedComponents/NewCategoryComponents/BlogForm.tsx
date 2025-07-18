"use client"
import { Poppins } from "next/font/google";
import React, { useRef, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import Image from "next/image";
import dynamic from "next/dynamic";
import { RxCrossCircled } from "react-icons/rx";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

interface BlogData {
    _id: string;
    title: string;
    photo: string;
    tag: string;
    description: string;
    createdAt: string;
    visible: boolean;
}

interface BlogFormProps {
    isVisible: boolean;
    formData: BlogData;
    isLoading: boolean;
    error: string | null;
    editingRow: number | null;
    onClose: () => void;
    onSave: () => Promise<void>;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    onDeleteImage: (index: number) => void;
    onFormChange: (field: keyof BlogData, value: string) => void;
}

const BlogForm: React.FC<BlogFormProps> = ({
    isVisible,
    formData,
    isLoading,
    error,
    editingRow,
    onClose,
    onSave,
    onImageChange,
    onDeleteImage,
    onFormChange,
}) => {
    const editorRef = useRef(null);
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(formData.photo || null);

    if (!isVisible) return null;

    const handleClick = () => hiddenFileInput.current?.click();

    const handleImageChangeWithPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            <div className="bg-[#ccccff] p-6 relative rounded shadow-lg w-100% ">
                <div className="">
                    <button
                        className="absolute top-2 right-2 text-gray-700 text-lg"
                        onClick={onClose}
                    >
                        <RxCrossCircled fontSize={30} />
                    </button>
                </div>
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex flex-row items-center">
                        <button
                            className={`${poppins.className} font-semibold text-base bg-[#ffb200] w-25 h-16 rounded-[8px] text-[#000000] cursor-pointer`}
                            onClick={handleClick}
                        >
                            Photo &gt;
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
                                            width={62}
                                            height={50}
                                            alt="Preview"
                                            className="object-cover mt-3 mx-auto"
                                            style={{ width: '62px', height: '50px' }}
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
                                        className="absolute top-0 right-0 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-black/10"
                                    >
                                        <BsTrash3 color="red" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        className="bg-[#ffb200] cursor-pointer w-44 h-[45px] rounded-lg text-[#000000]"
                        onClick={onSave}
                    >
                        Save
                    </button>
                </div>
                <div className="flex flex-col w-150">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <span className="flex flex-col">
                        <label
                            className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#00000099]`}
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            className="rounded w-80 bg-white h-13 px-3 border border-[#000000]"
                            value={formData.title}
                            onChange={(e) => onFormChange("title", e.target.value)}
                        />
                    </span>
                    <span className="flex flex-col mt-2">
                        <label
                            className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#00000099]`}
                        >
                            Tag
                        </label>
                        <input
                            type="text"
                            className="rounded w-80 h-13 bg-white px-3 border border-[#000000]"
                            value={formData.tag}
                            onChange={(e) => onFormChange("tag", e.target.value)}
                        />
                    </span>
                    <div className="bg-white mt-3 p-2 rounded-[10px] border border-[#000000]">
                        <label
                            className={`${poppins.className} font-normal text-[16px] leading-[31px] text-[#00000099]`}
                        >
                            Description
                        </label>
                        <JoditEditor
                            ref={editorRef}
                            value={formData.description || ""}
                            config={{
                                height: 150,
                            }}
                            onBlur={(newContent) => onFormChange("description", newContent)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogForm; 