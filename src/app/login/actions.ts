"use server";

import { login } from "@/server/auth/login";
import { AuthSchema } from "@/types/types";
import { redirect } from "next/navigation";

export default async function loginAction(formData: FormData) {
  try {
    const { email, password } = AuthSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    console.log(email, password);

    const result = await login(email, password);
    console.log(result);

    console.log("login success");
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
  redirect("/");
}
