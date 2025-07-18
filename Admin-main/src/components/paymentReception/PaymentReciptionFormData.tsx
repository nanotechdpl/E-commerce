"use client"
import Image from 'next/image'
import React from 'react'
import recept from "../../../public/images/recipt.svg"


const PaymentReciptionFormData = () => {
    return (
        <div className=''>
            <h1 className='font-bold text-indigo-700 text-lg md:text-2xl text-center mb-5'>Payment Reception </h1>
            <div>
                <h2 className='font-bold text-black text-xl md:text-2xl'>
                    <span className='block'>Dear, jack</span>
                    Your order ID: 64646 for the Logo Design project, with a Refand amount of 510 USD, <span className='text-sky-500'>Your Refand status is pending</span>
                </h2>
                <div className='mt-5'>
                    <h2 className='font-bold text-black text-xl md:text-2xl flex-col-reverse'>Form</h2>
                    <div className='flex gap-5 justify-between'>
                        <div>
                            <div className='text-black flex font-inter'>
                                <div className='me-2'>
                                    <h4 className='text-xl md:text-2xl font-inter'>Account Holder Name</h4>
                                    <h4 className='text-xl md:text-2xl'>Bank Name </h4>
                                    <h4 className='text-xl md:text-2xl'>Account Number</h4>
                                    <h4 className='text-xl md:text-2xl'>Transaction ID</h4>
                                    <h4 className='text-xl md:text-2xl'>Transaction Receipt</h4>
                                    <h4 className='text-xl md:text-2xl'>Additional information</h4>
                                </div>
                                <div>
                                    <h4 className='text-xl md:text-2xl'>: Mr jack</h4>
                                    <h4 className='text-xl md:text-2xl'>: Paypal</h4>
                                    <h4 className='text-xl md:text-2xl'>: 1694996199</h4>
                                    <h4 className='text-xl md:text-2xl'>: 646JOJDOJ6</h4>
                                    <h4 className='text-xl md:text-2xl'>: yes</h4>
                                    <h4 className='text-xl md:text-2xl'>: hello sir</h4>
                                </div>
                            </div>
                            <div className='mt-5'>
                                <Image className='max-w-[100px]' width={200} height={400} src={recept} alt='Recipt' />
                            </div>
                        </div>
                        <div>
                            <div className='text-black flex font-inter'>
                                <div className='me-2'>
                                    <h4 className='text-xl md:text-2xl'>Project amount</h4>
                                    <h4 className='text-xl md:text-2xl'>Paid Amount</h4>
                                    <h4 className='text-xl md:text-2xl'>Left amount</h4>
                                    <h4 className='text-xl md:text-2xl'>pay Amount</h4>
                                    <h4 className='text-xl md:text-2xl'>VAT(2%)</h4>
                                </div>
                                <div>
                                    <h4 className='text-xl md:text-2xl'>: 1500 USD</h4>
                                    <h4 className='text-xl md:text-2xl'>: 500 USD</h4>
                                    <h4 className='text-xl md:text-2xl'>: 1000 USD</h4>
                                    <h4 className='text-xl md:text-2xl'>: 500 USD</h4>
                                    <h4 className='text-xl md:text-2xl'>: 10 </h4>
                                </div>
                            </div>
                            <div className='text-black bg-[#D9D9D9] mt-10 rounded-lg p-3'>
                                <h2 className='font-bold text-xl md:text-2xl'>Total Amount <span>: $ 510</span></h2>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PaymentReciptionFormData