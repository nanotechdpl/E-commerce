import { formatDate3 } from "@/lib/formatDate";
// import { IPayment } from "@/types/payment";

const PaymentReception = ({ paymentData }: { paymentData: any | null }) => {
  return (
    <div className="flex justify-between gap-4 items-center">
      <h3 className="font-semibold text-2xl text-blue-600 text-left">
        Payment Reception
      </h3>
      <div className="font-semibold items-start text-[#FFB200] flex justify-center">
        <div className="text-left">
          <p>Payment ID: {paymentData?._id}</p>
          <p>
            Payment Date:{" "}
            {formatDate3(paymentData ? paymentData.createdAt : "")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentReception;
