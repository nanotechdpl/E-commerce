import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please input your email" })
    .email({ message: "Invalid Email" }),
  password: z.string().min(1, { message: "Please input your password" }),
});