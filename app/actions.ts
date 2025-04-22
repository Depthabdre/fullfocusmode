'use server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { console } from 'inspector';

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function signUp(formData: FormData) {
  
  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !name || !password) {
    throw new Error("All fields are required");
  }

  const result = userSchema.safeParse({ name, email, password });
  if (!result.success) {
    console.error(result.error);
    throw new Error("Invalid form data");
  }
console.log("SignUp user:", { name, email, password });
  try {

   await auth.api.signUpEmail(
      {
        body: {
            email: email,
            password: password,
            name: name,
      }});
      redirect("./");
   
  } catch (err) {
    console.error("Error in SignUp user:", err);
    throw err;
  }
  // console.log("SignUp user:", { name, email, password });
}

export async function signIn(formData: FormData) {

  const SignInUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const result = SignInUserSchema.safeParse({ email, password });

  if (!result.success) {
    console.error(result.error);
    throw new Error("Invalid form data");
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
    });
    redirect("./");
  } catch (err) {
    console.error("Error in SignIn user:", err);
    throw err;
  }



}
