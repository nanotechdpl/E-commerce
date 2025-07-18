import Image from "next/image";
import React from "react";
import { RxCrossCircled } from "react-icons/rx";

const OrderProduct:React.FC  = () => {
  return (
    <section >
        <header className='w-ful  bg-blue-700 flex justify-around items-center p-2'>
                 <h2 className='font-bold text-nowrap text-lg  text-white'>Shopping Card</h2>
            <button className=' bg-[#4b4bb6] px-4 py-2 text-white font-bold'>
                Items
            </button>
                 </header>
        {/* here card data come and show using map funtion */}
      <section>
        <div className="card flex gap-2 my-2 p-2">
          <div className="w-14 h-14 bg-blue-200 rounded-md p-1 flex justify-center items-center">
            <Image
              src={
                "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg"
              }
              alt=""
              width={70}
              height={70}
              className="rounded-sm"
            />
          </div>
          <div className="flex justify-between items-center w-full px-2  ">
            <span>
              <h2 className="Product-Name">Product-Name</h2>
              <span className="gap-2">
                <p className="text-sm text-gray-500 ">
                  $669 <del className="text-sm ml-2 text-gray-400 ">$99</del>
                </p>
              </span>
            </span>
            <span className="items-end cursor-pointer ">
              <RxCrossCircled size={25} />
            </span>
          </div>
        </div>
        <div className="card flex gap-2 my-2 px-2">
          <div className="w-14 h-14 bg-blue-200 rounded-md p-1 flex justify-center items-center">
            <Image
              src={
                "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg"
              }
              alt=""
              width={70}
              height={70}
              className="rounded-sm"
            />
          </div>
          <div className="flex justify-between items-center w-full px-2  ">
            <span>
              <h2 className="Product-Name">Product-Name</h2>
              <span className="gap-2">
                <p className="text-sm text-gray-500 ">
                  $669 <del className="text-sm ml-2 text-gray-400 ">$99</del>
                </p>
              </span>
            </span>
            <span className="items-end cursor-pointer ">
              <RxCrossCircled size={25} />
            </span>
          </div>
        </div>
        <div className="card flex gap-2 my-2 px-2">
          <div className="w-14 h-14 bg-blue-200 rounded-md p-1 flex justify-center items-center">
            <Image
              src={
                "https://render.fineartamerica.com/images/images-profile-flow/400/images/artworkimages/mediumlarge/2/1-elvis-presley-on-milton-berle-michael-ochs-archives.jpg"
              }
              alt=""
              width={70}
              height={70}
              className="rounded-sm"
            />
          </div>
          <div className="flex justify-between items-center w-full px-2  ">
            <span>
              <h2 className="Product-Name">Product-Name</h2>
              <span className="gap-2">
                <p className="text-sm text-gray-500 ">
                  $669 <del className="text-sm ml-2 text-gray-400 ">$99</del>
                </p>
              </span>
            </span>
            <span className="items-end cursor-pointer ">
              <RxCrossCircled size={25} />
            </span>
          </div>
        </div>

      </section>
        <footer className="w-72  gap-4 left-3 flex flex-col justify-center   absolute bottom-3 ">
            <div className="flex justify-between px-4 ">
                <h3 className="font-bold text-sm text-gray-600">Total</h3>
                <p className="font-bold text-sm text-gray-600">$500.0</p>
            </div>
            <button type="button" className="bg-blue-600 w-full rounded-md  p-2 text-white font-bold">Proceed Cheakout</button>

        </footer>
    </section>
  );
};

export default OrderProduct;
