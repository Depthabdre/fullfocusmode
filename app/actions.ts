'use server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { console } from 'inspector';
import { headers } from "next/headers";
import { db } from "@/lib/drizzle";
import { focusSessions } from "@/lib/schema";
import { eq, ne, gt, lt, gte, lte, and, or ,sql  } from "drizzle-orm";


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
    throw new Error("User session not found");
  }

  const userId = session.user.id;

  const focusData = focusSchema.safeParse({
    focusDuration: data.focusDuration,
    userId: userId,
    mode: data.mode,
  });

  if (!focusData.success) {
    console.error(focusData.error);
    throw new Error("Invalid focus data");
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
    return "Focus session saved successfully";
  } catch (err) {
    console.error("Error saving focus session:", err);
    throw err;
  }
  
}

export async function previousProgressFetcher(){
  const sessions = await auth.api.getSession({
      headers: await headers(),
  })
  if (!sessions)
    return []
  try{
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
  totalDuration: sql`SUM(CAST(${focusSessions.durationMinutes} AS INTEGER))`.as("total_duration"),
  modeCount: sql`COUNT(DISTINCT ${focusSessions.mode})`.as("mode_count"),
})
.from(focusSessions)
.where(eq(focusSessions.userId, userId))
.groupBy(focusSessions.sessionDate);

// Initialize the formattedResult object to store results by date (MMDD format)
const formattedResult: { [key: string]: [number, number] } = {};

// Loop through the result array
for (let i = 0; i < result.length; i++) {
  let tempKeyDate = result[i].sessionDate.split('-'); // Split the sessionDate into [YYYY, MM, DD]
  let keyDate = tempKeyDate[1] + '-' +  tempKeyDate[2]; // Combine MM and DD to form MMDD format

  // Store the totalDuration and modeCount as an array in the formattedResult
  formattedResult[keyDate] = [result[i].totalDuration, result[i].modeCount];
}


  return formattedResult}
  catch(err){
    console.error("Error saving focus session:", err);
    throw err;
  }
}