import { useEffect, useRef } from "react";

/**
 * Custom hook for smooth vertical auto-scrolling with delay, continuous scrolling (downward), and pause/resume on hover.
 * @param {number} speed - Pixels to scroll per frame (default: 1).
 * @param {number} stepTime - Frame duration in ms (default: 30ms).
 * @param {number} delay - Time delay before starting the scroll (default: 1500ms).
 */
const useAutoScroll = (speed = 1, stepTime = 30, delay = 1500) => {
  const scrollRef = useRef(null);
  const requestId = useRef(null); // Store the requestAnimationFrame ID
  const isScrolling = useRef(true); // Track if scrolling is active

  // Define the smooth scroll function outside useEffect to access it in other contexts like resumeScroll
  const smoothScroll = () => {
    if (scrollRef.current && isScrolling.current) {
      // Scroll the content by the defined speed
      scrollRef.current.scrollTop += speed;

      // If reaches the bottom, reset to the top (create a loop)
      if (
        scrollRef.current.scrollTop + scrollRef.current.clientHeight >=
        scrollRef.current.scrollHeight
      ) {
        console.log("Reached bottom, resetting to top");
        scrollRef.current.scrollTop = 0; // Reset scroll position to top
      }

      requestId.current = requestAnimationFrame(smoothScroll);
    }
  };

  useEffect(() => {
    // Set a timeout to delay the start of the scroll by `delay` ms
    const timeoutId = setTimeout(() => {
      if (isScrolling.current) {
        requestId.current = requestAnimationFrame(smoothScroll);
      }
    }, delay);  // delay in milliseconds (1500ms = 1.5 seconds)

    // Cleanup: cancel the scroll if the component unmounts or timeout is cleared
    return () => {
      cancelAnimationFrame(requestId.current);
      clearTimeout(timeoutId);
    };
  }, [speed, delay]); // Re-run when speed or delay changes

  // Function to pause the scrolling
  const pauseScroll = () => {
    isScrolling.current = false;
    cancelAnimationFrame(requestId.current); // Cancel any ongoing scroll
  };

  // Function to resume the scrolling
  const resumeScroll = () => {
    if (!isScrolling.current) {
      isScrolling.current = true;
      requestAnimationFrame(smoothScroll); // Start scrolling again
    }
  };

  // Return the scrollRef along with pause and resume functions
  return { scrollRef, pauseScroll, resumeScroll };
};

export default useAutoScroll;
