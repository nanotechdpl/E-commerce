'use client'
import React from 'react'
import Image from 'next/image'
import {Poppins} from 'next/font/google'
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400']
})

interface DisplayUploadedImageProps {
  title: string
  src: string
  onDelete: () => void
}

const DisplayUploadedImage: React.FC<DisplayUploadedImageProps> = ({
  title,
  src,
  onDelete
}) => {
  return (
    <div className='relative rounded-md'>
      {/* Render the uploaded image */}
      <span className={`${poppins.className} font-normal text-[12px] leading-[7.5px] text-[#000000]`}>{title}</span>
      <Image
        src={src}
        width={146.4}
        height={92.86}
        className='rounded-md'
        alt='Uploaded'
      />

      {/* Delete button */}
      <button className='absolute top-[29px] right-[5px]' onClick={onDelete}>
        <Image
          
          src={'/icons/close.png'}
          width={15}
          height={15}
          alt='Delete'
        />
      </button>
    </div>
  )
}

export default DisplayUploadedImage
