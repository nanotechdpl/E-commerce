import { z } from "zod";

export const ForgotPasswordFormValidationSchema = z.object({
  email: z
    .string({
      required_error: "Please input your email address",
    })
    .email({ message: "Invalid email address" }),
});
export type SignUpFormValueType = z.infer<
  typeof ForgotPasswordFormValidationSchema
>;
