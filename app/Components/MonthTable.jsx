/* eslint-disable react/prop-types */
import {previousProgressFetcher}  from "../actions"; 

async function MonthTable({  months }) {
  const resultdb = await previousProgressFetcher();
    
  function tableRender(){
    let result2 = [];
    const header = Object.keys(resultdb[0])
    result2.push(
      <section className="flex flex-row justify-between">
        {header.map((key) =>{
           <div key={key} className="font-bold">{key}</div>
        })}
      </section>
    )
    for ( let i = 1 ; i < resultdb.lengh ; i++){
      const rows = Object.values(resultdb[i])
      result2.push(
        <section className="flex flex-row justify-between">
          {rows.map((value)=>{
            <div key={value} className="font-bold">{value}</div>
          })}
        </section>
      )
    }
  }
  function buttonrender() {
    let result = [];
    for (let month = 0 ; month < months.length; month++) {
    for (let day = 0; day < months[month][1]; day++) {
      result.push(
        <button
          key={`${month + 1}-${day + 1}`} // Unique key for each button with their month and day
          className="relative w-4 h-4 bg-gray-300 dark:bg-gray-900  cursor-pointer "
          // style={{ backgroundColor: "hsl(120, 40%, 30%)" }}
        ></button>
      );
    }
   
  }
  return result;
}

  return (
    <>
    {result ? tableRender(): "" }
    <section className="mb-8 mt-4 rounded-lg shadow-md p-4 border w-fit max-w-full">
 
  <div className="overflow-x-auto my-scroll">
    <div className="flex flex-row justify-start gap-16 pl-10 w-fit">
      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((month) => (
        <span key={month} className="text-gray-600 dark:text-gray-300 font-medium">
          {month}
        </span>
      ))}
    </div>

    <div className="flex flex-row gap-0.5 mt-2">
      <div className="flex flex-col justify-between text-gray-600 font-medium dark:text-gray-300">
        {["Mon", "Wed", "Sat"].map((day) => (
          <span key={day} className="text-gray-600 dark:text-gray-300">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-flow-col grid-rows-7 gap-0.5 w-fit">
        {buttonrender()}
      </div>
    </div>
  </div>
</section>
</>

  );
}

export default MonthTable;