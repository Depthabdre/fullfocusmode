'use client'
// Desc: This component is responsible for displaying the timer and the circular progress bar. It also displays the current session and break point. It also has a stop button and a pause/play button.
import { Play, Pause } from "lucide-react";
import PropTypes from "prop-types";
import CircularTicker from "./CircularTicker";
import { useEffect, useState } from "react";

function TimeStarter({
  totalSeconds,
  minutes,
  pauseHandler,
  isPause,
  clickHandler,
  isRun,
  currentSessionMinute,
  sessionBreakPoint,
  TotalSessionMinute,
 
}) {
  const [activeColors, setActiveColors] = useState(Array(24).fill(false));

  useEffect(() => {
    let increment = (currentSessionMinute.current * 60) / 24;
    let index = Math.floor(totalSeconds / increment) - 1;

    setActiveColors((prevActiveColors) =>
      prevActiveColors.map((color, i) => (i === index ? true : color))
    );
  }, [totalSeconds, currentSessionMinute]);

  const seconds = 60 - (totalSeconds % 60);

  return (
    <section className="relative flex flex-col justify-center place-items-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-lg shadow-lg h-[60vh] w-full">
      {isPause ? (
        <p className="absolute top-2 left-2 text-md text-gray-500 font-semibold">
          Break {sessionBreakPoint.current[1]} of{" "}
          {Math.ceil(TotalSessionMinute.current / 35)}
        </p>
      ) : (
        <p className="absolute  top-2 left-2 text-md text-gray-500 font-semibold">
          Joy Session {sessionBreakPoint.current[0]} of{" "}
          {Math.ceil(TotalSessionMinute.current / 35)}
        </p>
      )}

      <CircularTicker activeColors={activeColors}>
        <p className="text-xl md:text-4xl font-extrabold font-mono tracking-wide text-gray-900 dark:text-white">
          {minutes - 1}:{String(seconds).padStart(2, "0")}
        </p>
      </CircularTicker>

      <div className="flex justify-center gap-4 items-center pt-5 row-span-2">
        {!isPause ? (
          <Pause
            onClick={pauseHandler}
            size={30}
            className="cursor-pointer hover:scale-110 transition-transform text-blue-600 dark:text-blue-700"
          />
        ) : (
          <Play
            onClick={pauseHandler}
            size={30}
            className="cursor-pointer hover:scale-110 transition-transform text-blue-600 dark:text-blue-700"
          />
        )}
        <button
          onClick={clickHandler}
          className="cursor-pointer bg-blue-600 dark:bg-blue-700 text-white dark:text-gray-100 font-bold hover:bg-blue-700 dark:hover:bg-blue-500 rounded-full w-14   hover:scale-105   transition-all"
        >
          Stop
        </button>
      </div>
    </section>
  );
}

TimeStarter.propTypes = {
  totalSeconds: PropTypes.number.isRequired,
  minutes: PropTypes.number.isRequired,
  pauseHandler: PropTypes.func.isRequired,
  isPause: PropTypes.bool.isRequired,
  isRun: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func.isRequired,
  currentSessionMinute: PropTypes.object.isRequired, // React.RefObject<number>
  sessionBreakPoint: PropTypes.object.isRequired, // React.RefObject<number[]>
  TotalSessionMinute: PropTypes.object.isRequired, // React.RefObject<number>
};

export default TimeStarter;