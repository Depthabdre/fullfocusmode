import { useState , useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button"; // if you use shadcn
import { signOut } from "../actions"; // your signOut function
import { useTransition } from "react";

export default function Profile() {
  const [open, setOpen] = useState(false);
  const [userName , setUserName] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchName() {
      try {
        const res = await fetch("../api/UserDataFetcher");
        const result = await res.json();
  
        console.log("Fetched data:", result);
  
        if (Array.isArray(result) && result[0]?.name) {
          setUserName(result[0].name);
        } else {
          console.error("User name not found in result:", result);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } 
    }
  
    fetchName();
  }, []);
  

  return (
    <div className="fixed top-2 left-2">
      <div className="p-2 flex items-center justify-between  w-10 h-10 transition-all duration-300 overflow-hidden" style={{ width: open ? '10rem' : '4rem' }}>
        <div className="flex items-center gap-2">
          <FaUserCircle 
            className="w-8 h-8 text-gray-400 dark:text-gray-300 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
          {open && (
            <div className="text-md font-normal text-gray-500 dark:text-gray-300 whitespace-nowrap ">
             {userName ? userName : 'Loading'}
            </div>
          )}
        </div>
      </div>
      {open && (
        <Button
          onClick={()=>{ startTransition(() => { signOut(); });}}
          disabled = {isPending}
          className="mt-2 text-md font-bold w-full bg-blue-600 dark:bg-blue-700 rounded-md p-2 text-blue-50   hover:bg-blue-700 dark:hover:bg-blue-500 transition-transform duration-500 ease-linear "
        >
          {isPending ? "Signing Out…" : "Sign Out"}
        </Button>
      )}
    </div>
  );
}
