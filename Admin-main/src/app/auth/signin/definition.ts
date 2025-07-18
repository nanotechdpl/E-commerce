export type FormState = {
  email?: string[];
  password?: string[];
  cpassword?: string[];
  message?: string[];
};

interface userData {
  user: Data;
}
interface Data {
  token?: string;
  _id?: string;
  email?: string;
  name?: string;
  currency?: string;
  enable_2fa?: boolean;
  userUID: string;
}

export interface LoggedInSuccess {
  data: userData;
}

export interface SignUpSuccess {
  // token: string;
  issuccessfull: boolean;
  email: string;
  password: string;
}

export interface ForgetPasswordSuccess {
  email: string;
}
