import { Link } from "next/navigation";

function FloatingButton() {
  return (
    <div className="absolute right-4 top-4 bg-amber-900 dark:bg-amber-700 text-white dark:text-gray-900 px-4 py-2 rounded-md shadow-lg hover:bg-amber-700 dark:hover:bg-amber-500 transition-all">
      <Link to="/LearningPage" className="text-white dark:text-gray-900 text-sm font-semibold">
        Learn How to Focus
      </Link>
    </div>
  );
}

export default FloatingButton;