export type IPayment = {
  sl: number;
  id: number;
  ProjectName: string;
  paymentType: string;
  paymentID: string;
  paymentMethod: string;
  accountName: string;
  accountNumber: string;
  payAmount: number;
  amount: number;
  paymentDay: string;
  acocuntHolderName: string;
  account_name: string;
  transactionId: string;
  transactionReceipt: string;
  additionalNote: string;
  Currency: string;
  Name: string;
  createdAt: string;
  status: string;
};

export interface IWithdraw {
  _id: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  routing_number: string;
  code: string;
  transaction_receipt: string;
  additional_note: string;
  reason: string;
  amount: number;
  bank_wallet: string;
  currency: string;
  status: string;
  orderid: string;
  userid: string;
  createdAt: string;
  returnNumber: string;
  __v: number;
}
