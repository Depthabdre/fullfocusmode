import MonthTable from "./MonthTable";

function ProgressTracker() {
  return (
    <>
      <section className="w-3/4 m-auto md:w-1/2 flex flex-col text-lg text-gray-900 dark:text-white font-bold shadow-md bg-gray-100 dark:bg-gray-800 mt-4 md:m-auto rounded-md overflow-x-scroll p-4">
        <h1 className="m-auto text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400">
          Progress Tracker
        </h1>
        <section className="flex gap-4 overflow-x-scroll p-2">
          <MonthTable daymonth={[1, 31]} month="January" />
          <MonthTable daymonth={[2, 29]} month="February" />
          <MonthTable daymonth={[3, 31]} month="March" />
          <MonthTable daymonth={[4, 30]} month="April" />
          <MonthTable daymonth={[5, 31]} month="May" />
          <MonthTable daymonth={[6, 30]} month="June" />
          <MonthTable daymonth={[7, 31]} month="July" />
          <MonthTable daymonth={[8, 31]} month="August" />
          <MonthTable daymonth={[9, 30]} month="September" />
          <MonthTable daymonth={[10, 31]} month="October" />
          <MonthTable daymonth={[11, 30]} month="November" />
          <MonthTable daymonth={[12, 31]} month="December" />
        </section>
      </section>
    </>
  );
}

export default ProgressTracker;