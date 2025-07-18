"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import exlamationIcon from "../../../public/images/icon/i.svg"
import { Button, Select } from 'antd'
import PaymentReciptionFormData from './PaymentReciptionFormData'



const PaymentReception = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState("Choose One")
    // array of options 
    const options = ['Apple', 'banana', 'chips'];



    return (
        <>
            <div className='w-full p-4 md:p-6 2xl:p-10 bg-gray-2'>
                {/* <Breadcrumb pageName="All Payments" /> */}
                {/* alert top */}
                <div className='flex justify-between items-center'>
                    <div>
                        <div className='flex items-center gap-5'>
                            <Image src={exlamationIcon} width={50} height={50} alt='icon' />
                            <p className='font-bold text-black'>Pending  Page View</p>
                        </div>
                    </div>
                    {/* right parts buttons */}
                    <div className='flex items-start gap-5'>
                        <div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className=''>
                                <Select defaultValue="Status" style={{ height: "40px" }}>
                                    <Select.Option value="panding" >Pending</Select.Option>
                                    <Select.Option value="sending" >Sending</Select.Option>
                                    <Select.Option value="ineligible" >Ineligible</Select.Option>
                                </Select>
                            </div>
                            <button className='border px-4 md:px-6 md:rounded-full bg-pink-500 text-white font-semibold py-2 rounded-md'>Save</button>
                        </div>
                    </div>
                </div>
                <div className='mt-8 p-14 bg-white rounded-lg max-w-[1000px] mx-auto'>
                    <PaymentReciptionFormData />
                </div>
            </div>

        </>
    )
}

export default PaymentReception