import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button"; // if you use shadcn
import { signOut } from "../actions"; // your signOut function

export default function Profile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-2 left-2">
      <div className="p-2 flex items-center justify-between  w-10 h-10 transition-all duration-300 overflow-hidden" style={{ width: open ? '10rem' : '4rem' }}>
        <div className="flex items-center gap-2">
          <FaUserCircle 
            className="w-8 h-8 text-gray-400 dark:text-gray-300 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
          {open && (
            <div className="text-md font-semibold text-gray-800 dark:text-gray-100">
              username
            </div>
          )}
        </div>
      </div>
      {open && (
        <Button
          onClick={signOut}
          className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
        >
          Logout
        </Button>
      )}
    </div>
  );
}
