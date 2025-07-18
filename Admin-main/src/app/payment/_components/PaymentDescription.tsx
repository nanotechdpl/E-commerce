const PaymentDescription = ({ paymentData }: { paymentData: any | null }) => {
  return (
    <div className="bg-white mt-4">
      <p className="font-semibold items-start text-left">
        Dear, {paymentData?.userid?.name || paymentData?.userid?.email}
      </p>
      <p className="font-semibold mb-4 items-start text-left">
        You have paid{" "}
        <span className="font-bold">{paymentData?.amount || ""}</span>{" "}
        {paymentData?.Currency} to {paymentData?.bankid?.name || ""}
        <span className="text-[#5296D6] ml-1">
          Your payment status is {paymentData?.status}
        </span>
      </p>
    </div>
  );
};

export default PaymentDescription;
