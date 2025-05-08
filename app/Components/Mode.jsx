'use client'
import { useState } from "react";
import PropTypes from "prop-types";

function Mode({ mode, setMode, isRun }) {
  const [onEdit, setOnEdit] = useState(true);

  function editHandler() {
    setOnEdit((prev) => !prev);
  }

  function onChangeHandler(e) {
    setMode(e.target.value);
  }

  return (
    <div className="md:col-span-2 flex flex-col items-center justify-center gap-2 p-4">
      {onEdit ? (
        <>
          <input
            type="text"
            placeholder="Enter The Mode..."
            value={mode}
            onChange={onChangeHandler}
            list="focusModes"
            className="text-gray-900 dark:text-gray-100 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors duration-200"
          />

          <datalist id="focusModes">
            <option value="Dead Mode" label="Dead Mode - no distractions, high-intensity" />
            <option value="Deep Mode" label="Deep Mode - focused deep work" />
            <option value="Easy Mode" label="Easy Mode - light, relaxed focus" />
          </datalist>

          

          <button
            onClick={editHandler}
            className="cursor-pointer bg-blue-600 dark:bg-blue-700 text-white dark:text-gray-100 w-26 h-10 px-6 py-2 font-bold rounded-full hover:bg-blue-700 dark:hover:bg-blue-500 transition"
          >
            SET
          </button>
        </>
      ) : (
        <>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
            {mode || "No Mode Set"}
          </p>

          {(!onEdit && !isRun) && (
            <button
              onClick={editHandler}
              className="cursor-pointer bg-blue-400 dark:bg-blue-500 text-white dark:text-gray-200 text-center w-20 h-8 font-bold rounded-xl hover:bg-blue-500 dark:hover:bg-blue-400 transition"
            >
              Edit
            </button>
          )}
        </>
      )}
    </div>
  );
}

Mode.propTypes = {
  mode: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
  isPause: PropTypes.bool.isRequired,
};

export default Mode;