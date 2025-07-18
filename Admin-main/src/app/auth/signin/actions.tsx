"use server";
import { loginSchema } from "./validate";
import { FormState } from "./definition";
import { LoggedInSuccess } from "./definition";
import { env } from "../../../../config/env";

export async function signIn(
  formData: FormData
): Promise<FormState | LoggedInSuccess> {
  const validateFields = loginSchema?.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateFields.success) {
    console.log(validateFields.error.flatten().fieldErrors);
    return validateFields.error.flatten().fieldErrors;
  }
  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/api/v1/factory-app/auth-admin/login`,
      {
        method: "POST",
        body: JSON.stringify(validateFields?.data),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    const response = await res.json();
    if (res.status !== 200) {
      return {
        message: [response.message || "An unknown error occurred."],
      };
    }

    return {
      data: response,
    };
  } catch (error) {
    console.log(error);
    return {
      message: error as string[],
    };
  }
}
