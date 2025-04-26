'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import { Quotes, ThemeToggle, Mode, TimeStarter, Notification, ProgressTracker, FocusSession } from "./Components";
import prequotes from "./Quote";
import './globals.css';
import {focusDurationSaver} from "./actions";



export default function App() {
  const [isRun, setIsRun] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [quotes, setQuotes] = useState(prequotes);
  const [isBreak, setBreak] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [mode, setMode] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const ActualFocusDuration =  useRef(0);
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
    ActualFocusDuration.current += 1;   // look i want to track how many minutes user focuses before changes to non focus mode
    // Check current mode and calculate remaining minutes
    if (!isBreak) {
      // Work Session Mode
      if (TotalSessionMinute.current >= 30) {
        minutes.current = 30 - Math.floor(totalSeconds / 60);
        if (minutes.current <= 0 ) {
          console.log("Work session completed. Initiating break.");
          // setHasNotified(true);
          TotalSessionMinute.current -= 30;
          currentSessionMinute.current = TotalSessionMinute.current >= 5 ? 5 : TotalSessionMinute.current;

          setTotalSeconds(0);
          sessionBreakPoint.current[0] += 1;
          setBreak(true);

          onClose();
          playAudio();
          setTimeout(playAudio, 9000);
          setTimeout(() => {
                onClose();
              }, 18000);
        }
      } else { // When TotalSessionMinute.current < 30 (final session work period)
        minutes.current = TotalSessionMinute.current - Math.floor(totalSeconds / 60);
        if (minutes.current <= 0 ) {
          console.log("Final work session completed.");
          focusDurationSender();
          setIsRun(false);
          setTotalSeconds(0);
          TotalSessionMinute.current = 0;

          onClose();
          playAudio();
          setTimeout(playAudio, 9000);
          setTimeout(() => {
            onClose();
          }, 18000);
        }
      }
    } else {
      // Break Mode

      if (TotalSessionMinute.current >= 5) {
        minutes.current = 5 - Math.floor(totalSeconds / 60);
        if (minutes.current <= 0  ) {
          console.log("Break completed. Resuming work session.");
          TotalSessionMinute.current -= 5;
          currentSessionMinute.current = TotalSessionMinute.current >= 30 ? 30 : TotalSessionMinute.current;

          setTotalSeconds(0);
          sessionBreakPoint.current[1] += 1;
          setBreak(false);

          onClose();
          playAudio();
          setTimeout(playAudio, 9000);
          setTimeout(() => {
            onClose();
          }, 18000);
        }
      } else {
        // Final break if available minutes less than 5
        minutes.current = TotalSessionMinute.current - Math.floor(totalSeconds / 60);
        if (minutes.current <= 0 ) {
          console.log("Final break completed.");
          TotalSessionMinute.current = 0;
          focusDurationSender();
          setIsRun(false);
          setTotalSeconds(0);

          onClose();
          playAudio();
          setTimeout(playAudio, 9000);
          setTimeout(() => {
            onClose();
          }, 18000);

        }
      }
    }

    
   
  }, [totalSeconds, isBreak,  isRun]);

  function clickHandler() {
    // Reset relevant states for new session start
    if (isRun){
      console.log("Session Finished");
      focusDurationSender();
    }
    setTotalSeconds(0);
    setIsPause(false);
    setIsRun((prev) => !prev);
  }
  async function focusDurationSender(){
    console.log("Focus Duration Sender called");
    const result = await focusDurationSaver({focusDuration:Number(ActualFocusDuration.current) , mode:mode});
    alert(result);
    ActualFocusDuration.current = 0;
    

  }
  function pauseHandler() {
    setIsPause((prevPause) => !prevPause);
  }
  

  return (
    <>
      <ThemeToggle />
      <Mode isPause={isPause} mode={mode} setMode={setMode} />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4  justify-center md:max-w-4xl max-w-md mx-auto h-full    items-stretch">
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
