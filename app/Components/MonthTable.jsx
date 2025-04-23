/* eslint-disable react/prop-types */

function MonthTable({  months }) {
  
  function buttonrender() {
    let result = [];
    for (let month = 0 ; month < months.length; month++) {
    for (let day = 0; day < months[month][1]; day++) {
      result.push(
        <button
          key={`${month + 1}-${day + 1}`} // Unique key for each button with their month and day
          className="relative w-4 h-4 bg-gray-300 dark:bg-gray-900  cursor-pointer"
        ></button>
      );
    }
   
  }
  return result;
}

  return (
    <section className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <div className="grid grid-flow-col grid-rows-7 gap-0.5">
        {buttonrender()}
      </div>
    </section>
  );
}

export default MonthTable;