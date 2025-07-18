import { Poppins } from "next/font/google";
import {useEffect, useState } from "react";
import SelectSingleOrMultiImgOrVideo from "../../../components/Upload/SelectSIngleOrMultiImgAll";
import DisplayUploadedImage from "./displayImage/DisplayUploadedImage";
import axios from "axios";
import { env } from "../../../../config/env";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface PhtotData {
  _id: string,
  title: string,
  media: string,
}


const PhotoVideoUpdate = () => {
  const [file, setFile] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [photoData, setPhotoData] = useState([])
  const [totalData, setTotalData] = useState("")
  const [limit, setLimit] = useState("")
  useEffect(() => {
    (async() => {
      const {data} = await axios.get(`${env.NEXT_PUBLIC_API_URL}/api/v1/admin/home/service-gallery/get?limit=${limit}`)
      console.log(data)
      setPhotoData(data?.data)
      setTotalData(data?.totalData)
    })()
  }, [limit])
 
  return (
    <div className="w-full border-slate-300 ">
      <div className="flex flex-wrap gap-3 justify-center">
        <div className="  bg-white p-5 rounded-[32px] w-full ">
          <MapPhotoVideoUpload file={file} setFile={setFile} />

          <div
            className="mt-10 grid gap-3 grid-cols-[repeat(auto-fit,minmax(120px,1fr))] overflow-y-auto"
            style={{ maxHeight: "400px" }}
          >
            {photoData?.map((value: PhtotData, index) => (
              <DisplayUploadedImage
                key={value?._id}
                title={value?.title}
                src={value?.media}
                onDelete={() => console.log(`Delete clicked for image ${index + 1}`)}
              />
            ))}
          </div>

          <div className="text-center my-10">
            <h4 className={`${poppins.className} font-semibold text-xs text-black`}>
              Showing {photoData?.length || 0} of {totalData} results
            </h4>
            <div className="w-50 mx-auto rounded-[10px] border-[0.89px] border-white bg-[#FFB200] text-[#231F20] font-inter font-semibold text-[13px] leading-[15.73px] py-2 px-4">
              <span>More Results</span>
              <select onChange={(e) => setLimit(e.target.value)} name="" id="" className="ml-4">
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
                <option value="96">96</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapPhotoVideoUpload = ({ file, setFile }: { file: any; setFile: any }) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 w-full mt-[2rem]">
      {/* ------ Select Image/Video -------- */}
      <SelectSingleOrMultiImgOrVideo
        style={{ background: "#3B82F6" }}
        file={file}
        setFile={setFile}
        title="Photo/Video"
      />

      {/* ------ Input for Title/URL -------- */}
      <div className="flex w-full h-fit sm:max-w-[371px] bg-[#F8F6F0] flex-row justify-between rounded-[5px] border border-black">
        <input
          type="text"
          placeholder="Title/Url"
          className="w-full sm:w-[70%] focus:outline-none h-fit bg-[#F8F6F0] px-4 py-2 rounded-l-[5px] placeholder-black"
        />
        <button className="w-full sm:w-[95px] bg-[#FFB200] text-black rounded-[8px] px-3 py-2">
          Save
        </button>
      </div>
    </div>
  );
};

export default PhotoVideoUpdate;
