import Image from "next/image";
import React from "react";

const PaymentReceipt = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-black md:min-h-[60vh]">
      <div>
        <div className="relative rounded border-2 border-blue-400 bg-white px-5 pb-7 pt-5">
          <div className="mb-8 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Image
                src={
                  "https://s3-alpha-sig.figma.com/img/178d/fab8/d19cb0b1c6d7bb36499bbcf82a25571b?Expires=1714953600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=R3U39FSt72TI1WUqBXowWEZaKU4hWCQugWrrJzgTGH06ddjIr01V1yq6w5VVxVwKdSwqAjG1dkQxMAZyG7ft9Gw8d~Fr2dwHRePx8RgsdTXhAH-9ZsMYGTuW9UQb6twCsbTyA9WsUhuI5CSaG0O~FLsHk3SpMMSw7rG8tPbiFAglvIfGnA345Itk9uWWFzqsCn~XlZKk9wb77yhfU2qZo3lF3BQzoPbdAmZEM1ZQ79rpPQGyroQMTHSIacm7Bw~ZQT01~qHMFw0rhHfp6P-8eR6blprpD-56xOZaUEP7k7tliGod5ySwBy7qRfCoWeGnrc0blRiC~U42OlgDg~C2iQ__"
                }
                height={80}
                width={80}
                alt="bank-img"
              />
              <span className="font-semibold">SBI Bank</span>
            </div>
            <h3 className="font-semibold text-blue-600">Payment Reciption</h3>
            <div>
              <p>30 Aug 2014 13:52:59 AEST</p>
              <p>Transaction Id: 75sg24fg6454ag</p>
            </div>
          </div>
          {/*  */}
          <div>
            <p className="mb-4 font-semibold">Dear YOUR BUSINESS,</p>
            <p className="font-bold text-[#e7a139]">
              You received a payment of $51.00 AUD from XYX (xyz@gmail.com)
            </p>
            <p className="mb-4 font-semibold">
              Thanks for using PayPal. You can now send any items. To view the
              transaction details, log in to your PayPal account.
            </p>
            <p className="mb-4 font-semibold">
              It may take a few moments for this transaction to appear in the
              Recent Activity in your Account Overview
            </p>

            <div className="grid grid-cols-7 gap-5">
              <div className="col-span-5 flex-1">
                <table className="w-full border-2" border={1}>
                  <thead>
                    <tr>
                      <th className="border-2">No</th>
                      <th className="border-2">Order ID</th>
                      <th className="border-2">Project name</th>
                      <th className="border-2">Project Amount</th>
                      <th className="border-2">Pay Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-2 text-center">01</td>
                      <td className="border-2 text-center">4646</td>
                      <td className="border-2 text-center">Web Dev</td>
                      <td className="border-2 text-center">500 GDC</td>
                      <td className="border-2 text-center">100 USD</td>
                    </tr>
                    <tr>
                      <td className="border-2 text-center">01</td>
                      <td className="border-2 text-center">4646</td>
                      <td className="border-2 text-center">Web Dev</td>
                      <td className="border-2 text-center">500 GDC</td>
                      <td className="border-2 text-center">100 USD</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-2 flex justify-end text-sm  font-semibold">
                  <div>
                    <p>Pay Amount : 100 USD</p>
                    <p>Tax Rate 2% : 0.2</p>
                    <p>Total GDC : 1.2</p>
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex flex-col space-y-1 text-sm font-semibold">
                <span>Name : Mr Kazol</span>{" "}
                <span>Email Address : abcd@gmail.com</span>{" "}
                <span>Phone Number : +445646343434</span>{" "}
                <span>Country : UK </span>
                <span>City : UK</span> <span>State/province : UK</span>{" "}
                <span>Postal Zone/Zip Code: 12324</span>{" "}
                <span>Address : abadfdrfsdf</span>
              </div>
            </div>
          </div>
          <Image
            className="absolute right-65 top-10"
            src={
              "https://s3-alpha-sig.figma.com/img/2649/81c4/111e08774a752b61dd647f9a7f5ff35a?Expires=1715558400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=B6KcT0YGQnUnKKZCKMMSJyi~MCQd1wBeujo7338TCc8NdNvLwRpNIeoNKVDFF6WyRDiwkjKSU37t9u-AXoG1dPew5EyturufuuzhGC6IKyzb~y58yQsfYp0rr3SBablCMcETiPh8aCdPZDDUUjNIGNUxPJqI0Ia4qDKeuxGbDZCrDvcgltZK1sqxBMt8h5Z6Cn2smjY~CIlN2KoPWUpOjXkkcDySniBil7YevvfyCoLE699SbD2vRRre~7B3DUJgjV4KiLjgqAEU6N6k8vWAf5mg-HjlPzloql9AWxMXKbuAdhWctUeS78sLSIWmrHoA2pGQ7X6bZ24wK7Pj9H8t6w__"
            }
            width={100}
            height={100}
            alt="spam"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
