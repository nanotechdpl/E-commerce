export type Finance = {
  total_order: number;
  total_amount: number;
  total_paid: number;
  money_left: number;
  refund_amount: number;
  profit: number;
};

export type IUser = {
  userNumber: string;
  no: number;
  _id: string;
  finance: Finance;
  suspend: number;
  status: string;
  userUID: string;
  isSuspended: string;
  isBlocked: boolean;
  isDeleted: boolean;
};

// export type IUser = {
//   no: number;
//   userId: string;
//   userName: string;
//   gender: string;
//   email?: string;
//   country: string;
//   totalOrder: number;
//   totalAmount?: number;
//   totalPaid: number;
//   moneyLeft: number;
//   refundAmount: number;
//   profit?: number;
//   suspend?: number;
//   status?: string;
// };
