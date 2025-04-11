import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

function CircularTicker({ children, activeColors }) {
  const parentRef = useRef(null);
  const [parentWidth, setParentWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (parentRef.current) {
        setParentWidth(parentRef.current.getBoundingClientRect().width);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const percentWidth = 0.75 * (parentWidth / 2);

  return (
    <div
      ref={parentRef}
      className="relative aspect-square flex flex-col justify-center items-center shadow-md bg-gray-200 dark:bg-gray-900 rounded-full h-3/4 md:h-3/5 lg:h-3/4"
    >
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className={`absolute ${
            activeColors[i] ? "bg-blue-500 dark:bg-blue-300" : "bg-gray-500 dark:bg-gray-700"
          } w-4 h-1 rounded-full`}
          style={{
            top: "50%",
            left: "50%",
            transformOrigin: "left center",
            transform: `rotate(${i * 15}deg) translateX(${percentWidth}px)`,
          }}
        ></div>
      ))}
      {children}
    </div>
  );
}

CircularTicker.propTypes = {
  children: PropTypes.node,
  activeColors: PropTypes.arrayOf(PropTypes.bool).isRequired,
};

export default CircularTicker;