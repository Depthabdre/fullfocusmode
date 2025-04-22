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
        <p className="absolute top-0 left-0 text-lg font-semibold px-4 py-2 rounded-lg text-gray-900 dark:text-white">
          Break {sessionBreakPoint.current[1]} of{" "}
          {Math.ceil(TotalSessionMinute.current / 35)}
        </p>
      ) : (
        <p className="absolute top-0 left-0 text-lg font-semibold px-4 py-2 rounded-lg text-gray-900 dark:text-white">
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
            className="cursor-pointer hover:scale-110 transition-transform text-gray-900 dark:text-white"
          />
        ) : (
          <Play
            onClick={pauseHandler}
            size={30}
            className="cursor-pointer hover:scale-110 transition-transform text-gray-900 dark:text-white"
          />
        )}
        <button
          onClick={clickHandler}
          className="text-blue-900 dark:text-blue-200 font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg w-14 bg-gray-200 dark:bg-gray-700 hover:scale-105 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
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