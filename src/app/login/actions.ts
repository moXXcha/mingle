"use server";

import { login } from "@/server/auth/login";
import { AuthSchema } from "@/types/types";
import { redirect } from "next/navigation";

export default async function loginAction(formData: FormData) {
  try {
    // validation
    const { email, password } = AuthSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // login
    await login(email, password);

    console.log("login success");
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
  redirect("/");
}
