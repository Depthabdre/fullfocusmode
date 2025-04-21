import sql  from "@/lib/drizzle";
import createAuthTables from "@/lib/table";
import {createTables} from "@/lib/table";

export default async function DbTester() {
  try {
    await createAuthTables();
    console.log('🗑️ Auth Tables Created!');
    await createTables();
    console.log('🗑️ Focus Session Tables Created!');
    
  } catch (error) {
    console.error("Error:", error);
  }
}