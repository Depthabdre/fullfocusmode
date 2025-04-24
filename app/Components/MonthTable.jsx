/* eslint-disable react/prop-types */

function MonthTable({  months }) {
  
  function buttonrender() {
    let result = [];
    for (let month = 0 ; month < months.length; month++) {
    for (let day = 0; day < months[month][1]; day++) {
      result.push(
        <button
          key={`${month + 1}-${day + 1}`} // Unique key for each button with their month and day
          className="relative w-4 h-4 bg-gray-300 dark:bg-gray-900  cursor-pointer "
        ></button>
      );
    }
   
  }
  return result;
}

  return (
    <section className=" mb-8 mt-  max-w-full w-fit flex flex-col justify-center items-center rounded-lg shadow-md p-4 border overflow-x-auto my-scroll">
      <div className="flex flex-row justify-start gap-16 pl-10">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((month) => (
              <span key={month} className="text-gray-600 dark:text-gray-300 font-medium">
                {month}
              </span>
            ))}
      </div>

      <div className="flex flex-row gap-0.5">

        <div className="flex flex-col justify-between text-gray-600 font-medium dark:text-gray-300 ">
            {["Mon", "Wed", "Sat"].map((day) => (
              <span key={day} className="text-gray-600 dark:text-gray-300">
                {day}
              </span>
            ))}
        </div>

        <div className="grid grid-flow-col grid-rows-7 gap-0.5 ">
          {buttonrender()}
        </div>

      </div>
    </section>
  );
}

export default MonthTable;