import { z } from "zod";

export const ChangePasswordFormValidationSchema = z.object({
  newpassword: z.string({
    required_error: "Please insert a new password",
  }),
  confirmpassword: z.string({
    required_error: "Please re-write a new password",
  }),
});
export type ChangePasswordFormValueType = z.infer<
  typeof ChangePasswordFormValidationSchema
>;
