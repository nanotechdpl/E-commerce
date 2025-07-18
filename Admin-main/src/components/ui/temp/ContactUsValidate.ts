import { z } from "zod";

export const FormValidationSchema = z.object({
  apikey: z.string({
    required_error: "Please insert API key",
  }),
  securitykey: z.string({
    required_error: "Please insert Security key",
  }),
 
});
export type ApiKeyFormValueType = z.infer<
  typeof FormValidationSchema
>;
