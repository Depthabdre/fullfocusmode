'use server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { console } from 'inspector';
import { headers } from "next/headers";
import { db } from "@/lib/drizzle";
import { focusSessions, user } from "@/lib/schema";
import { eq, ne, gt, lt, gte, lte, and, or, sql } from "drizzle-orm";
import { compileFunction } from 'vm';


const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function signUp(prevstate: { message: string }, formData: FormData): Promise<{ message: string }> {

  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !name || !password) {
    return { message: "All fields are required" };
  }

  const result = userSchema.safeParse({ name, email, password });
  if (!result.success) {
    console.error(result.error);
    return { message: "Invalid form data" };
  }
  console.log("SignUp user:", { name, email, password });
  try {

    await auth.api.signUpEmail(
      {
        body: {
          email: email,
          password: password,
          name: name,
        }
      });


  } catch (err) {

    if (err instanceof Error) {
      return { message: `Sign up failed: ${err.message || "An unexpected error occurred. Please check server logs."}` };
    }
    return { message: "Sign up failed: An unexpected error occurred. Please check server logs." };

  }
  redirect("/");
  // console.log("SignUp user:", { name, email, password });
}

export async function signIn(prevState: { message: string }, formData: FormData):
  Promise<{ message: string }> {

  const SignInUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !password) {
    return { message: "All fields are required" };
  }

  const result = SignInUserSchema.safeParse({ email, password });

  if (!result.success) {
    console.error(result.error);
    return { message: "Invalid form data" };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
    });

  } catch (err) {
    return { message: "Sign-in error: Incorrect email or password." }

  }
  redirect("/");
}

export async function signInSocial() {
  try {
    const { url } = await auth.api.signInSocial({
      body: {
        provider: "google",
      },
    });
    if (!url) {
      throw new Error("URL is undefined");
    }
    return redirect(url);

  } catch (err) {
    console.error("Error in SignIn social:", err);
    throw err;
  }
}

export async function signOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    redirect("/login");
  }
  catch (err) {
    console.error("Error in SignOut user:", err);
    throw err;
  }

}


export async function focusDurationSaver(data: { focusDuration: number; mode: string }) {
  console.log("focusDurationSaver called with data:", data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("Session retrieved:", session);

  const focusSchema = z.object({
    focusDuration: z.number().min(0),
    userId: z.string(),
    mode: z.string(),
  });
  if (!session || !session.user) {
    return { success: false, error: "User session not found" };
  }

  const userId = session.user.id;

  const focusData = focusSchema.safeParse({
    focusDuration: data.focusDuration,
    userId: userId,
    mode: data.mode,
  });

  if (!focusData.success) {
    console.error(focusData.error);
    return { success: false, error: "Invalid focus data" };
  }

  try {
    await db.insert(focusSessions).values({
      id: crypto.randomUUID(),
      userId: userId,
      sessionDate: new Date().toISOString().split("T")[0], // Get current date in 'YYYY-MM-DD' format
      durationMinutes: String(data.focusDuration), // Convert seconds to milliseconds and create a Date object
      mode: data.mode,
    });
    console.log("Focus session saved successfully");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Database error" };

  }

}

export async function previousProgressFetcher() {
  const sessions = await auth.api.getSession({
    headers: await headers(),
  })
  console.log("Session retrieved:", sessions);
  if (!sessions)
    return []
  try {
    const userId = sessions.user.id;

    // Define the interface for the result
    interface Result {
      sessionDate: string;
      totalDuration: number;
      modeCount: number;
    }

    // Fetch the data from the database
    const result: Result[] = await db.select({
      sessionDate: focusSessions.sessionDate,
      totalDuration: sql<number>`SUM(CAST(${focusSessions.durationMinutes} AS INTEGER))`.as("total_duration"),
      modeCount: sql<number>`COUNT(DISTINCT ${focusSessions.mode})`.as("mode_count"),
    })
      .from(focusSessions)
      .where(eq(focusSessions.userId, userId))
      .groupBy(focusSessions.sessionDate);

    // Initialize the formattedResult object to store results by date (MMDD format)
    const formattedResult: { [key: string]: [number, number] } = {};

    // Loop through the result array
    for (let i = 0; i < result.length; i++) {
      let tempKeyDate = result[i].sessionDate.split('-'); // Split the sessionDate into [YYYY, MM, DD]
      if (tempKeyDate[1][0] == '0') {
        tempKeyDate[1] = tempKeyDate[1].slice(1, 2);
      }
      if (tempKeyDate[2][0] == '0') {
        tempKeyDate[2] = tempKeyDate[2].slice(1, 2);
      }
      let keyDate = tempKeyDate[1] + '-' + tempKeyDate[2]; // Combine MM and DD to form MMDD format

      // Store the totalDuration and modeCount as an array in the formattedResult
      formattedResult[keyDate] = [result[i].totalDuration, result[i].modeCount];
    }


    return formattedResult
  }
  catch (err) {
    console.error("Error saving focus session:", err);
    throw err;
  }
}

export async function userDataFetcher() {
  
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  
  if (!session) {
    return []
  }
  try {
    const userId = session.user.id;
    const result = await db.select({ name: user.name }).from(user).where(eq(user.id, userId))

    return result
  }
  catch (err) {
    console.error("Error saving focus session:", err);
    throw err;
  }
}