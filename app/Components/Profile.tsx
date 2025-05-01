import { useState , useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button"; // if you use shadcn
import { signOut } from "../actions"; // your signOut function

export default function Profile() {
  const [open, setOpen] = useState(false);
  const [userName , setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(()=>{

    async function fetchName(){
      try{
      const res = await fetch("../api/UserDataFetcher");
      const result = await res.json();
      console.log("The fetched Data is " , {result});
      setUserName(result[0].name);
      }
      catch(err){
        console.error('Failed to fetch users:', err);
      }
      finally{
        setLoading(false);
      }

    }
    fetchName();

  } , [])

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
          onClick={signOut}
          className="mt-2 text-md font-bold w-full bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
        >
          Logout
        </Button>
      )}
    </div>
  );
}
