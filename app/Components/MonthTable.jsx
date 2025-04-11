/* eslint-disable react/prop-types */

function MonthTable({ daymonth, month }) {
  function clickHandler(e) {
    if (e.target.innerText === "") {
      e.target.innerText = "X";
    } else {
      e.target.innerText = "";
    }
  }

  function buttonrender() {
    let result = [];
    for (let i = 0; i < daymonth[1]; i++) {
      result.push(
        <button
          key={`${daymonth[0]}-${i + 1}`}
          className="w-4 h-4 bg-gray-300 dark:bg-gray-900 rounded-sm hover:scale-125 relative text-sm text-red-600 dark:text-red-400 font-extrabold transition-all"
          onClick={clickHandler}
        ></button>
      );
    }
    return result;
  }

  return (
    <section className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-center text-gray-900 dark:text-white font-bold text-lg">{month}</h1>
      <div className="grid grid-flow-col grid-rows-7 gap-1.5">
        {buttonrender()}
      </div>
    </section>
  );
}

export default MonthTable;