import { useEffect, useRef } from "react";

/**
 * Custom hook for smooth vertical auto-scrolling.
 * @param {number} speed - Pixels to scroll per frame (default: 1).
 * @param {number} stepTime - Frame duration in ms (default: 30ms).
 */
const useAutoScroll = (speed = 1, stepTime = 30) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    let scrollDirection = 1; // 1 = down, -1 = up
    let requestId;

    const smoothScroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop += scrollDirection * speed;

        // If reaches the bottom, change direction to up
        if (
          scrollRef.current.scrollTop + scrollRef.current.clientHeight >=
          scrollRef.current.scrollHeight
        ) {
          scrollDirection = -1;
        }

        // If reaches the top, change direction to down
        if (scrollRef.current.scrollTop <= 0) {
          scrollDirection = 1;
        }

        requestId = requestAnimationFrame(smoothScroll);
      }
    };

    requestId = requestAnimationFrame(smoothScroll);

    return () => cancelAnimationFrame(requestId); // Cleanup on unmount
  }, [speed]);

  return scrollRef;
};

export default useAutoScroll;
