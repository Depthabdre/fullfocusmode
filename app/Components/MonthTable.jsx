/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

export default  function MonthTable({ months }) {

  const [resultdb, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('../api/progressFetcher'); // This hits route.ts
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  
  function tableRender() {
    const result2 = [];
    const header = Object.keys(resultdb[0]);

    // HEADER
    result2.push(
      <section key="header" className="flex flex-row justify-between">
        {header.map((key) => (
          <div key={key} className="font-bold">
            {key}
          </div>
        ))}
      </section>
    );

    // ROWS
    for (let i = 0; i < resultdb.length; i++) {
      const rows = Object.values(resultdb[i]);
      result2.push(
        <section key={i} className="flex flex-row justify-between">
          {rows.map((value, idx) => (
            <div key={idx} className="font-bold">
              {value}
            </div>
          ))}
        </section>
      );
    }

    return result2;
  }

  function buttonrender() {
    const result = [];
    for (let month = 0; month < months.length; month++) {
      for (let day = 0; day < months[month][1]; day++) {
        result.push(
          <button
            key={`${month + 1}-${day + 1}`}
            className="relative w-4 h-4 bg-gray-300 dark:bg-gray-900 cursor-pointer"
          />
        );
      }
    }
    return result;
  }

  if (loading) return <p>Loading from DB...</p>;

  return (
    <>
      {resultdb.length ? (
        tableRender()
      ) : (
        <div className="text-6xl">NO data Appears</div>
      )}

      <section className="mb-8 mt-4 rounded-lg shadow-md p-4 border w-fit max-w-full">
        <div className="overflow-x-auto my-scroll">
          <div className="flex flex-row justify-start gap-16 pl-10 w-fit">
            {[
              "Jan", "Feb", "Mar", "Apr", "May",
              "Jun", "Jul", "Aug", "Sep", "Oct", "Nov",
            ].map((month) => (
              <span
                key={month}
                className="text-gray-600 dark:text-gray-300 font-medium"
              >
                {month}
              </span>
            ))}
          </div>

          <div className="flex flex-row gap-0.5 mt-2">
            <div className="flex flex-col justify-between text-gray-600 font-medium dark:text-gray-300">
              {["Mon", "Wed", "Sat"].map((day) => (
                <span key={day}>{day}</span>
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
