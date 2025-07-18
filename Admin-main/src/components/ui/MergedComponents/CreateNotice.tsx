import React, { useState } from "react";
import NoticeProfile from "../temp/NoticeProfile";
export interface ProfilesData {
  sl?: number;
  id?: number;
  name: string;
  title: string;
  image: string;
  homeAddress: string;
  gmail: string;
  file?: any;
}
const CreateNotice: React.FC = () => {
  interface ProfilesData {
    sl?: number;
    id?: number;
    name: string;
    title: string;
    image: string;
    homeAddress: string;
    gmail: string;
    file?: any;
  }
  const [companyProfiles, setcompanyProfiles] = useState<ProfilesData[]>([
    {
      sl: 1,
      id: 1,
      name: "Mike",
      title: "CEO",
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png",
      homeAddress: "Kolkata",
      gmail: "something2003@gmail.com",
    },
  ]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  interface ProfileData {
    file?: any;
    name: string;
    title: string;
    gmail: string;
    homeAddress: string;
  }
  const [createCompanyProfileData, setCreateCompanyProfileData] =
    useState<ProfileData>({
      file: null,
      name: "",
      title: "",
      gmail: "",
      homeAddress: "",
    });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateCompanyProfileData({
      ...createCompanyProfileData,
      [name]: value,
    });
    const HandleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      const selectedFiles = files as FileList;
      setCreateCompanyProfileData({
        ...createCompanyProfileData,
        file: selectedFiles[0],
      });
    };
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      // Update existing data
      setcompanyProfiles((prevCompanyProfiles: any) =>
        prevCompanyProfiles.map((item: any, index: number) =>
          index === editIndex ? createCompanyProfileData : item,
        ),
      );
    } else {
      // new profile will be add
      const newSl = companyProfiles.length + 1;
      setcompanyProfiles((prevCompanyProfiles: any) => [
        ...prevCompanyProfiles,
        { ...createCompanyProfileData, sl: newSl },
      ]);
    }

    setIsVisible(false);
    setCreateCompanyProfileData({
      file: null,
      name: "",
      title: "",
      gmail: "",
      homeAddress: "",
    });
    setIsEditing(false);
    setEditIndex(null);
  };
  const handleEditClick = (index: number) => {
    setIsEditing(true);
    setEditIndex(index);
    setCreateCompanyProfileData(companyProfiles[index]);
    setIsVisible(true);
  };
  return (
    <div>
      <NoticeProfile />
    </div>
  );
};

export default CreateNotice;
