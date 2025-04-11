/* eslint-disable react/prop-types */

import { useState, useEffect, useRef,useCallback } from "react";
import { Quotes, ThemeToggle, Mode, TimeStarter, Notification, ProgressTracker , FocusSession } from "@app/Components";
import prequotes from "./Quote";



export default function App() {
  const [isRun, setIsRun] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [quotes, setQuotes] = useState(prequotes);  // Fixed spelling here
  const intervalId = useRef(null); // Store interval reference
  const TotalSessionMinute = useRef(30)
  const [isBreak,setBreak] = useState(false)
  const [isPause,setIsPause] = useState(false)
  const [mode, setMode] = useState("");
  let currentSessionMinute = useRef(30);
  let sessionBreakPoint = useRef([1,1]); // for enjoing session and  break respectively 
  const [isVisible, setIsVisible] = useState(false);
  let minutes = useRef(0);

  

  useEffect(() => {

    if (isRun && !isPause) {
      intervalId.current = setInterval(() => {
        setTotalSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
      
    } else {
      clearInterval(intervalId.current);
     
    }

    // Cleanup function to avoid memory leaks
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [isRun,isPause]);

  const onClose = useCallback(() => {
    setIsVisible((prev) => !prev); // toggle visibility
  }, []);
  

 useEffect(()=>{
    // if (!isRun) return;
  
    if (TotalSessionMinute.current >= 30 && !isBreak) {
      minutes.current = 30 - Math.floor(totalSeconds / 60);
  
      if (minutes.current == 0) {
        TotalSessionMinute.current -= 30;
  
        if (TotalSessionMinute.current >= 5) 
          currentSessionMinute.current = 5;
        else 
          currentSessionMinute.current = TotalSessionMinute.current;
  
        onClose();
  
        const audio = new Audio("/Remainder.mp3");
        audio.play();
  
        setTimeout(() => {
          audio.play();
        }, 9000);
  
        setTimeout(() => {
          onClose();
        }, 18000);
  
        sessionBreakPoint.current[0] += 1;
        setTotalSeconds(0);
        setBreak(true);
      }
    } 
    else if (TotalSessionMinute.current < 30 && !isBreak) {
      minutes.current = TotalSessionMinute.current - Math.floor(totalSeconds / 60);
  
      if (minutes.current == 0) {
        onClose();
  
        const audio = new Audio("/Remainder.mp3");
        audio.play();
  
        setTimeout(() => {
          audio.play();
        }, 9000);
  
        setTimeout(() => {
          onClose();
        }, 18000);
  
        setIsRun(false);
      }
    } 
    else if (TotalSessionMinute.current >= 5 && isBreak) {
      minutes.current = 5 - Math.floor(totalSeconds / 60);
  
      if (minutes.current == 0) {
        TotalSessionMinute.current -= 5;
  
        if (TotalSessionMinute.current >= 30) 
          currentSessionMinute.current = 30;
        else 
          currentSessionMinute.current = TotalSessionMinute.current;
  
        onClose();
  
        const audio = new Audio("/Remainder.mp3");
        audio.play();
  
        setTimeout(() => {
          audio.play();
        }, 9000);
  
        setTimeout(() => {
          onClose();
        }, 18000);
  
        sessionBreakPoint.current[1] += 1;
        setTotalSeconds(0);
        setBreak(false);
      }
    } 
    else {
      minutes.current = TotalSessionMinute.current - Math.floor(totalSeconds / 60);
  
      if (minutes.current == 0) {
        TotalSessionMinute.current = 0;
  
        onClose();
  
        const audio = new Audio("/Remainder.mp3");
        audio.play();
  
        setTimeout(() => {
          audio.play();
        }, 9000);
  
        setTimeout(() => {
          onClose();
        }, 18000);
  
        setIsRun(false);
      }
    }
  } ,  [totalSeconds, isRun, isBreak, isVisible, onClose] );
  

  function clickHandler() {
    setTotalSeconds(0)
    setIsPause(false)
    setIsRun(prev => !prev);
  }
  function pauseHandler(){
    setIsPause(prevPause => !prevPause)
  }

 

  return (
    
              <>
               {/* {!isRun ? <FloatingButton /> : '' } */}
               <ThemeToggle />
              
                <Mode isPause={isPause} mode={mode} setMode={setMode} />
                <section className=" grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center w-full h-full md:p-10">
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
                <Quotes quotes={quotes} setQuotes={setQuotes} isRun={isRun}  />
              </section>
             
              <ProgressTracker/>
              <Notification isVisible={isVisible} isBreak={isBreak} onClose={onClose} />
              </>
           
         
  );
}
