'use client'
/* eslint-disable react/prop-types */
import { useState } from "react";
import { ArrowUp, ArrowDown, Play } from "lucide-react";

function FocusSession({ TotalSessionMinute, setIsRun, mode, currentSessionMinute, minutes }) {
  const [totalMinutes, setTotalMinutes] = useState(0);
  const breaks = Math.floor(totalMinutes / 35);

  function FocusSessionStarter() {
    if (!mode) {
      alert("Enter your Mode");
    } else {
      TotalSessionMinute.current = totalMinutes;
      if (TotalSessionMinute.current >= 30) {
        currentSessionMinute.current = 30;
        minutes.current = 30;
      } else {
        currentSessionMinute.current = TotalSessionMinute.current;
        minutes.current = TotalSessionMinute.current;
      }
      setIsRun(true);
    }
  }

  function decHandler() {
    if (totalMinutes >= 5) setTotalMinutes(totalMinutes - 5);
  }

  function incHandler() {
    setTotalMinutes(totalMinutes + 5);
  }

  function onChangeHandler(e) {
    let totminutes = parseInt(e.target.value);
    if (isNaN(totminutes)) {
      totminutes = "";
    }

    setTotalMinutes(totminutes);
  }

  return (
    <section className="flex flex-col justify-start items-center shadow-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-8 rounded-lg gap-4 select-none">
      <div>
        <h1 className="font-extrabold text-2xl md:text-3xl text-center text-gray-900 dark:text-white">
          Focus here and now
        </h1>
      </div>
      <div className="grid grid-rows-2 grid-cols-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 md:w-3/7 p-4 gap-2">
        <div className="row-span-2 col-span-2 flex flex-col justify-between items-center border-r-2 border-gray-400 dark:border-gray-600 pr-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={totalMinutes}
            onChange={onChangeHandler}
            onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
            className="font-bold text-xl md:text-3xl w-2/3 h-3/7 m-auto text-center border border-transparent rounded-md outline-none transition duration-200 
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-300 
                       hover:border-gray-400 dark:hover:border-gray-500 dark:focus:ring-blue-400"
          />
          <span className="text-sm text-gray-900 dark:text-white">mins</span>
        </div>
        <div className="flex justify-center items-center text-gray-900 dark:text-white text-3xl border-b-2 border-amber-300 dark:border-amber-100 pl-2">
          <ArrowUp onClick={incHandler} className="cursor-pointer hover:text-blue-500 dark:hover:text-blue-300 transition-transform hover:scale-110" />
        </div>
        <div className="flex justify-center items-center text-gray-900 dark:text-white text-3xl border-amber-300 dark:border-amber-100 pl-2">
          <ArrowDown onClick={decHandler} className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-transform hover:scale-110" />
        </div>
      </div>
      <div>
        <p className="text-emerald-900 dark:text-emerald-50 font-semibold">
          You will have {breaks} breaks
        </p>
      </div>
      <div className="bg-blue-300 dark:bg-blue-700 rounded-md p-2 text-blue-900 dark:text-blue-50 font-bold hover:scale-110 transition-transform duration-500 ease-linear">
        <button className="inline-flex gap-2" onClick={FocusSessionStarter}>
          <Play className="cursor-pointer hover:scale-110 transition-transform" />
          Start Focus Session
        </button>
      </div>
    </section>
  );
}

export default FocusSession;