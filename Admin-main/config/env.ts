import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";


// Define your environment variable schema
export const env = createEnv({
  // Server-side environment variables (not exposed to the client)
  //   server: {
  //     DATABASE_URL: z.string().url(), // Must be a valid URL
  //     API_SECRET: z.string(), // Must be a non-empty string
  //   },
  // Client-side environment variables (must start with NEXT_PUBLIC_)
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(), // Public API URL
  },
  // Map the schema to actual runtime environment variables
  runtimeEnv: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7000",
  },
});
