import { z } from "zod";

export const SignInFormValidationSchema = z.object({
  password: z.string({
    required_error: "Please input your password",
  }),
  email: z
    .string({
      required_error: "Please input your email address",
    })
    .email({ message: "Invalid email address" }),
});
export type SignInFormValueType = z.infer<typeof SignInFormValidationSchema>;