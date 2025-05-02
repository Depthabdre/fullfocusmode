/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default  function MonthTable({ months }) {

  const [resultdb, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('../api/progressFetcher'); // This hits route.ts
        const data = await res.json();
        setUsers(data);
        console.log("The fetched Data is " , {data});
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
    

  function buttonrender() {
    const result = [];
    for (let month = 0; month < months.length; month++) {
      for (let day = 0; day < months[month][1]; day++) {
        let possiblekey = String(month + 1) + '-' +  String(day + 1);
        let isActive = false;
        if (possiblekey in resultdb){
          isActive = true;
        }
        result.push(
          <button
            key={`${month + 1}-${day + 1}`}
            className={clsx(
              "relative w-4 h-4 cursor-pointer group", // 🧠 Add 'group' to button
              isActive ? "bg-green-400" : "bg-gray-300 dark:bg-gray-900"
            )}
          >
          {isActive && (
            <span className="z-50 absolute top-[-35px] right-[-50px] hidden group-hover:flex text-sm bg-gray-700 text-white rounded-sm px-2 py-1 whitespace-nowrap">
            {resultdb[possiblekey][1]} focus sessions for {parseInt(resultdb[possiblekey][0] / 60)} minutes
            </span>)}

          </button>


        );
      }
    }
    return result;
  }


  return (
    <>
    
      <section className="relative mb-8 mt-4 rounded-lg shadow-md p-4 border dark:border-gray-800 w-fit max-w-full mx-auto">
        <p className='absolute top-1 left-1 text-md text-gray-900 font-semibold dark:text-gray-100'>consistency</p>
        <div className="overflow-x-auto my-scroll mt-6">
          <div className="flex flex-row justify-start gap-16 pl-10 w-fit">
            {[
              "Jan", "Feb", "Mar", "Apr", "May",
              "Jun", "Jul", "Aug", "Sep", "Oct", "Nov",
            ].map((month) => (
              <span
                key={month}
                className="text-gray-500 dark:text-gray-400 font-medium"
              >
                {month}
              </span>
            ))}
          </div>

          <div className="flex flex-row gap-0.5 mt-2">
            <div className="flex flex-col justify-between text-gray-500 dark:text-gray-400 font-medium">
              {["Mon", "Wed", "Sat"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            {
    !loading 
    ? <div className="grid grid-flow-col grid-rows-7 gap-0.5 w-fit">{buttonrender()}</div> 
    : <div className="text-xl font-bold mx-auto">IS Loading......</div>
}

            
             
           
          </div>
        </div>
      </section>
    </>
  );
}
