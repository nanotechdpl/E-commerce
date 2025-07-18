const PaymentOptions = ({ paymentData }: { paymentData: any | null }) => {
  return (
    <div className="col-span-3 flex-1">
      <table className="w-full table-auto  text-left">
        <tbody className="text-left">
          <tr className="text-left">
            <td>Payment method</td>
            <td>:</td>
            <td>{paymentData?.payment_type || ""}</td>
          </tr>
          <tr>
            <td>Account Holder Name</td>
            <td>:</td>
            <td>{paymentData?.bankid?.account_info[0]?.account_name || ""}</td>
          </tr>
          <tr>
            <td>Account Name</td>
            <td>:</td>
            <td>{paymentData?.account_name || ""}</td>
          </tr>
          <tr>
            <td>Account Number</td>
            <td>:</td>
            <td>{paymentData?.account_number || ""}</td>
          </tr>
          <tr>
            <td>Transaction ID</td>
            <td>:</td>
            <td>{paymentData?.transaction_id || ""}</td>
          </tr>
          <tr>
            <td>Transaction Receipt</td>
            <td>:</td>
            <td>{paymentData?.transaction_receipt || "No"}</td>
          </tr>
          <tr>
            <td>Any Additional information</td>
            <td>:</td>
            <td>{paymentData?.additional_note || ""}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PaymentOptions;
