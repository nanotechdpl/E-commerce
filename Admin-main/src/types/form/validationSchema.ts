// validationSchema.ts
import { z } from "zod";

export const carFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tag: z.string().min(1, "Tag is required"),
  description: z.string().min(1, "Description is required"),
  photo: z
    .any()
    .refine((file) => file instanceof File, "Photo is required"),
});

export type CarFormSchemaType = z.infer<typeof carFormSchema>;
