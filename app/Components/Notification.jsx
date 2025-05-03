// Desc: Notification component to display a message when the session is over or break is over

// eslint-disable-next-line react/prop-types
function Notification({ isBreak, onClose, isVisible }) {
  return (
    <div
      style={{
        visibility: isVisible ? "visible" : "hidden",
        transition: "visibility 0.3s, opacity 0.3s",
        opacity: isVisible ? 1 : 0,
      }}
      className="fixed bottom-4 right-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md rounded-sm p-4 w-70 text-gray-900 dark:text-white"
    >
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 font-bold text-lg"
          aria-label="Close notification"
        >
          &times;
        </button>
      </div>
      <div className="mt-4 text-center ">
        {isBreak ? (
          <p className="text-md font-medium text-gray-900 dark:text-white">
            Break is Over, Time to Enjoy Your Session
          </p>
        ) : (
          <p className="text-md font-medium text-gray-900 dark:text-white">
            Enjoying Session is Over, Time for a Break
          </p>
        )}
      </div>
    </div>
  );
}

export default Notification;