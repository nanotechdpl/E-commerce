export interface IBank {
  sl: string;
  bankName: string;
  bankLogo: string;
  qrCode: string;
  accountInfo: string;
  taxInfo: string;
  currency: string;
  active: boolean; // Add the 'active' property
}