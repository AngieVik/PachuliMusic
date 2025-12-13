import { useEffect } from "react";

export const useWakeLock = () => {
  useEffect(() => {
    let wakeLock = null;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
          console.log('Screen Wake Lock active');
        }
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    };

    // Request wake lock on component mount
    requestWakeLock();

    // Re-request wake lock if visibility changes (e.g. user switches tabs and comes back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock) {
        wakeLock.release()
          .then(() => {
             console.log('Screen Wake Lock released');
          });
      }
    };
  }, []);
};
