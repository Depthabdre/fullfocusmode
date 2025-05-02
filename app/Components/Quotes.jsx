'use client'
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import clsx from "clsx";

function Quotes({ quotes, setQuotes, isRun }) {
  const [currentQuote, setCurrentQuote] = useState("");
  const [displayedQuote, setDisplayedQuote] = useState("");
  const [newQuote, setNewQuote] = useState("");

  useEffect(() => {
    if (quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    }
  }, [quotes]);

  useEffect(() => {
    setDisplayedQuote("");
    let index = 0;
    const interval = setInterval(() => {
      if (index < currentQuote.length) {
        setDisplayedQuote((prev) => currentQuote.slice(0,index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    // setTimeout()

    return () => clearInterval(interval);
  }, [currentQuote]);

  function newQuoteHandler() {
    if (newQuote.trim()) {
      setQuotes((prevQuotes) => [...prevQuotes, newQuote]);
      setNewQuote("");
    }
  }

  function onChangeHandler(e) {
    setNewQuote(e.target.value);
  }

  return (
    <div
      className={clsx(
        "relative flex flex-col place-items-center justify-center gap-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg  p-8",
        isRun ? "h-[40vh] md:h-[60vh]" : "h-full"
      )}
    >
      {isRun && (<p class="absolute top-2 left-2 text-md text-gray-500 font-semibold">
        Inspirational Quote
      </p>)}
      {!isRun ? (
        <>
          <input
            type="text"
            value={newQuote}
            onChange={onChangeHandler}
            className="text-gray-900 dark:text-gray-100 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors duration-200"
            placeholder="Enter your quote..."
          />
          <button
            onClick={newQuoteHandler}
            className="cursor-pointer bg-blue-600 dark:bg-blue-700 text-white dark:text-gray-100 font-bold px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all"
          >
            Add Quote
          </button>
        </>
      ) : (
        ""
      )}
      <div className="w-full flex justify-center items-center text-center text-gray-900 dark:text-gray-100 font-sans">
        <p className="font-bold text-lg md:text-xl text-center text-gray-900 dark:text-white">
          {displayedQuote}
          <span className="animate-pulse">|</span>
        </p>
      </div>
    </div>
  );
}

export default Quotes;