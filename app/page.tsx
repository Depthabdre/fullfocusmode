'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import { Quotes, ThemeToggle, Mode, TimeStarter, Notification, ProgressTracker, FocusSession } from "./Components";
import prequotes from "./Quote";
import './globals.css';



export default function App() {
  const [isRun, setIsRun] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [quotes, setQuotes] = useState(prequotes);
  const [isBreak, setBreak] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [mode, setMode] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  // This flag prevents repeated notification triggers until the next session/break change.
  const [hasNotified, setHasNotified] = useState(false);

  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const notificationTimeout1 = useRef<NodeJS.Timeout | null>(null);
  const notificationTimeout2 = useRef<NodeJS.Timeout | null>(null);

  const TotalSessionMinute = useRef(30);
  const currentSessionMinute = useRef(30);
  // sessionBreakPoint[0] = session breaks count; sessionBreakPoint[1] = work session count
  const sessionBreakPoint = useRef([1, 1]);
  const minutes = useRef(0);
  
  // Declare the ref for the audio without initialization
  const audio = useRef<HTMLAudioElement | null>(null);

  // Initialize the Audio instance on the client-side
  useEffect(() => {
    if (typeof Audio !== "undefined") {
      audio.current = new Audio("/Remainder.mp3");
    }
  }, []);

  // Helper function for audio playback
  const playAudio = () => {
    if (audio.current) {
      console.log("Playing audio");
      audio.current.play().catch((error) => console.error("Audio play error:", error));
    }
  };

  // Toggle notification visibility
  const onClose = useCallback(() => {
    console.log("Toggling notification visibility");
    setIsVisible((prev) => !prev);
  }, []);

  // Timer interval effect
  useEffect(() => {
    // Reset notification flag if timer is reset manually
    if (!isRun) {
      setHasNotified(false);
      setTotalSeconds(0);
    }
    if (isRun && !isPause) {
      intervalId.current = setInterval(() => {
        setTotalSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [isRun, isPause]);

  // Main effect checking for session/break boundaries
  useEffect(() => {
    // Reset the notification flag when the session state changes
    if (totalSeconds === 0) {
      setHasNotified(false);
    }

    // Check current mode and calculate remaining minutes
    if (!isBreak) {
      // Work Session Mode
      if (TotalSessionMinute.current >= 30) {
        minutes.current = 30 - Math.floor(totalSeconds / 60);
        if (minutes.current <= 0 && !hasNotified) {
          console.log("Work session completed. Initiating break.");
          setHasNotified(true);
          TotalSessionMinute.current -= 30;
          currentSessionMinute.current = TotalSessionMinute.current >= 5 ? 5 : TotalSessionMinute.current;
          onClose();
          playAudio();
          // Schedule subsequent actions
          notificationTimeout1.current = setTimeout(playAudio, 9000);
          notificationTimeout2.current = setTimeout(() => {
            onClose();
            // Prepare for break session by resetting timer and flag
            setTotalSeconds(0);
            setHasNotified(false);
            sessionBreakPoint.current[0] += 1;
            setBreak(true);
          }, 18000);
        }
      } else { // When TotalSessionMinute.current < 30 (final session work period)
        minutes.current = TotalSessionMinute.current - Math.floor(totalSeconds / 60);
        if (minutes.current <= 0 && !hasNotified) {
          console.log("Final work session completed.");
          setHasNotified(true);
          onClose();
          playAudio();
          notificationTimeout1.current = setTimeout(playAudio, 9000);
          notificationTimeout2.current = setTimeout(() => {
            onClose();
            setIsRun(false);
          }, 18000);
        }
      }
    } else {
      // Break Mode
      if (TotalSessionMinute.current >= 5) {
        minutes.current = 5 - Math.floor(totalSeconds / 60);
        if (minutes.current <= 0 && !hasNotified) {
          console.log("Break completed. Resuming work session.");
          setHasNotified(true);
          TotalSessionMinute.current -= 5;
          currentSessionMinute.current = TotalSessionMinute.current >= 30 ? 30 : TotalSessionMinute.current;
          onClose();
          playAudio();
          notificationTimeout1.current = setTimeout(playAudio, 9000);
          notificationTimeout2.current = setTimeout(() => {
            onClose();
            setTotalSeconds(0);
            setHasNotified(false);
            sessionBreakPoint.current[1] += 1;
            setBreak(false);
          }, 18000);
        }
      } else {
        // Final break if available minutes less than 5
        minutes.current = TotalSessionMinute.current - Math.floor(totalSeconds / 60);
        if (minutes.current <= 0 && !hasNotified) {
          console.log("Final break completed.");
          setHasNotified(true);
          TotalSessionMinute.current = 0;
          onClose();
          playAudio();
          notificationTimeout1.current = setTimeout(playAudio, 9000);
          notificationTimeout2.current = setTimeout(() => {
            onClose();
            setIsRun(false);
          }, 18000);
        }
      }
    }

    // Cleanup function for notification timeouts
    return () => {
      if (notificationTimeout1.current) clearTimeout(notificationTimeout1.current);
      if (notificationTimeout2.current) clearTimeout(notificationTimeout2.current);
    };
  }, [totalSeconds, isBreak, onClose, hasNotified]);

  function clickHandler() {
    // Reset relevant states for new session start
    setTotalSeconds(0);
    setIsPause(false);
    setHasNotified(false);
    setIsRun((prev) => !prev);
  }

  function pauseHandler() {
    setIsPause((prevPause) => !prevPause);
  }

  return (
    <>
      <ThemeToggle />
      <Mode isPause={isPause} mode={mode} setMode={setMode} />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center w-full h-full md:p-10">
        {isRun ? (
          <TimeStarter
            isPause={isPause}
            TotalSessionMinute={TotalSessionMinute}
            pauseHandler={pauseHandler}
            sessionBreakPoint={sessionBreakPoint}
            clickHandler={clickHandler}
            isRun={isRun}
            totalSeconds={totalSeconds}
            minutes={minutes.current}
            currentSessionMinute={currentSessionMinute}
          />
        ) : (
          <FocusSession
            currentSessionMinute={currentSessionMinute}
            TotalSessionMinute={TotalSessionMinute}
            setIsRun={setIsRun}
            mode={mode}
            minutes={minutes}
          />
        )}
        <Quotes quotes={quotes} setQuotes={setQuotes} isRun={isRun} />
      </section>
      <ProgressTracker />
      <Notification isVisible={isVisible} isBreak={isBreak} onClose={onClose} />
    </>
  );
}
