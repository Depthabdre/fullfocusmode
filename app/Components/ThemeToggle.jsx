'use client'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize darkMode state based on localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    // const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    // || (!storedTheme && systemPrefersDark)
    if (storedTheme === "dark" ) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Update localStorage and document class on theme change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <motion.button
      onClick={() => setDarkMode(!darkMode)}
      className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 shadow-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={darkMode ? "moon" : "sun"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          {darkMode ? (
            <Moon size={24} className="text-white dark:text-gray-300" />
          ) : (
            <Sun size={24} className="text-yellow-500 dark:text-yellow-400" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}