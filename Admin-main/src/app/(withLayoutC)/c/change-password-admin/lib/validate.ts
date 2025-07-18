// src\app\(withLayoutC)\c\change-password-admin\lib\validate.ts

import { z } from "zod";

export const ChangeOldPasswordFormValidationSchema = z.object({
  currentpassword: z.string({
    required_error: "Please insert your current password",
  }),
  newpassword: z.string({
    required_error: "Please insert a new password",
  }),
  confirmpassword: z.string({
    required_error: "Please confirm the new password",
  }),
});
export type ChangeOldPasswordFormValueType = z.infer<
  typeof ChangeOldPasswordFormValidationSchema
>;
