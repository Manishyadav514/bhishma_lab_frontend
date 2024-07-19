"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import Bubble from "./Bubble";
import Image from "next/image";
import useAudio from "@hooks/useAudio";
import MessagePopup from "components/common/MessagePopup";
import { Attempt } from "types/survey.types";
import { timer } from "@utils/timer";
import { useSurveyContext } from "context/SurveyContext";
import useWindowSize from "@hooks/useWindowSize";

export const colors: string[] = [
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "orange",
];

const BubblePoppingTask = ({ isSurvey = false }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [numberOfBubbles, setNumberOfBubbles] = useState<number>(4);
  const [bubbles, setBubbles] = useState<string[]>(colors);
  const [bubblesPopped, setBubblesPopped] = useState<number>(0);
  const [alertShown, setAlertShown] = useState(false);
  const [positionRange, setPositionRange] = useState<number>(0);
  const [screenHeight, setScreenHeight] = useState<number>(100);
  const [screenWidth, setScreenWidth] = useState<number>(100);
  const [timerData, setTimerData] = useState<{
    startTime: number;
    endTime: number;
    timeLimit: number;
    isTimeOver: boolean;
  } | null>(null);
  const [surveyData, setSurveyData] = useState<Attempt>({
    closedWithTimeout: false,
    timeTaken: "",
    ballCoord: [],
    mouseCoord: [],
    colors: [],
    bubblesPopped: "",
    bubblesTotal: "",
    startTime: "",
    endTime: "",
    screenHeight: "",
    screenWidth: "",
    deviceType: "",
  });

  const { windowSize } = useWindowSize();
  const { state, dispatch } = useSurveyContext();
  const searchParams = useSearchParams();
  const attemptString = searchParams.get("attempt") || "0";
  const attempt = parseInt(attemptString);
  const bubblePop = useAudio("/bubble-pop.mp3");
  const reAttemptUrl =
    attempt < 3 ? `bubble-popping-task?attempt=${attempt + 1}` : null;
  const timeLimit = 1800000;
  const maxNumberOfBubble: number = 6;
  const bubbleSize: number = 100;

  // start game
  useEffect(() => {
    if (isSurvey) {
      handleStartGame();
    }
  }, [isSurvey]);

  // screensize
  useEffect(() => {
    if (windowSize.width && windowSize.height) {
      setScreenWidth(windowSize.width);
      setScreenHeight(windowSize.height);
      setPositionRange(windowSize.width / numberOfBubbles);
    }
  }, [windowSize]);

  // increase bubble number
  useEffect(() => {
    if (windowSize.width) {
      setPositionRange(windowSize.width / numberOfBubbles);
    }

    if (numberOfBubbles === maxNumberOfBubble + 1) {
      if (isSurvey) {
        const timeData = handleStopTimer();
        closeGame(timeData);
      } else {
        alert("you may start the game!");
      }
    } else {
      setBubbles(colors.slice(0, numberOfBubbles));
    }
  }, [numberOfBubbles]);

  useEffect(() => {
    if (timerData?.isTimeOver && !alertShown) {
      closeGame();
      setAlertShown(true);
    }
  }, [alertShown, timerData]);

  // function to get the coordinates of click
  const pushEntry = (ballCoordEntry: any, mouseCoordEntry: any, color: any) => {
    setSurveyData((prevState: any) => ({
      ...prevState,
      ballCoord: [...(prevState?.ballCoord || []), ballCoordEntry],
      mouseCoord: [...(prevState?.mouseCoord || []), mouseCoordEntry],
      colors: [...(prevState?.colors || []), color],
    }));
  };

  const handleBubblePop = (
    ball_coord: any,
    mouse_coord: any,
    color: string
  ) => {
    bubblePop();
    if (isSurvey) {
      setBubblesPopped((prevState) => prevState + 1);
      pushEntry(ball_coord, mouse_coord, color);
    }

    setBubbles((bubble) =>
      bubble.filter((prevBubbles) => prevBubbles !== color)
    );
    if (bubbles.length - 1 === 0) {
      setNumberOfBubbles((numberOfBubbles) => numberOfBubbles + 1);
    }
  };

  const handleStartGame = () => {
    handleTimer();
    const width = window.screen.width;
    const height = window.screen.height;
    const device = navigator.userAgent;

    setSurveyData((prevState: any) => ({
      ...prevState,
      screenHeight: height,
      screenWidth: width,
      deviceType: device,
    }));
    setNumberOfBubbles(1);
  };

  const stopTimerFuncRef = useRef<() => any>();

  const handleTimer = () => {
    const { endTimePromise, stopTimer } = timer(timeLimit);

    stopTimerFuncRef.current = stopTimer;

    endTimePromise.then(setTimerData);

    return () => {
      // Optional cleanup if necessary
      stopTimerFuncRef.current && stopTimerFuncRef.current();
    };
  };

  const handleStopTimer = useCallback(() => {
    if (stopTimerFuncRef.current) {
      const data = stopTimerFuncRef.current();
      return data;
    }
  }, []);

  const closeGame = useCallback(
    (timeData?: any) => {
      if (isSurvey) {
        setShowPopup(true);
        console.log({ timeData });
        const bubblesTotal: number =
          (maxNumberOfBubble / 2) * (2 + (maxNumberOfBubble - 1));
        setSurveyData((prevState: any) => {
          const updatedSurveyData = {
            ...prevState,
            timeTaken: timeData?.timeLimit || "",
            endTime: timeData?.endTime || "",
            startTime: timeData?.startTime || "",
            closedWithTimeout: timeData?.isTimeOver || false,
            bubblesTotal,
            bubblesPopped,
          };

          dispatch({
            type: "UPDATE_SURVEY_DATA",
            attempt,
            task: "BubblePoppingTask",
            data: updatedSurveyData,
          });

          return updatedSurveyData;
        });
      }
    },
    [isSurvey, timerData, attempt, bubblesPopped]
  );

  const calculatePosition = (index: number) => {
    const min = index * positionRange + bubbleSize / 2;
    const max = (index + 1) * positionRange - bubbleSize;

    let x = Math.random() * (max - min) + min;
    const y = Math.random() * (screenHeight - bubbleSize);

    // console.log(x + bubbleSize / 2, {
    //   positionRange,
    //   index,
    //   max,
    //   x,
    //   screenWidth,
    //   min,
    //   numberOfBubbles,
    // });
    return { x, y };
  };

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden">
        <Image src="/ocean.jpg" layout="fill" objectFit="cover" alt="ocean" />
        {positionRange && screenWidth && screenHeight && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="flex flex-wrap justify-center">
              {bubbles.map((color: string, index: number) => (
                <Bubble
                  key={color}
                  color={color}
                  onClick={handleBubblePop}
                  bubbleSize={bubbleSize}
                  screenWidth={screenWidth}
                  screenHeight={screenHeight}
                  initialPosition={calculatePosition(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {isSurvey && (
        <MessagePopup
          showFilter={showPopup}
          msg={
            "You have completed the Bubble Popping Task. You can now make another attempt for this test, go back to the survey dashboard or start the new task. "
          }
          testName={"bubble popping"}
          reAttemptUrl={reAttemptUrl}
        />
      )}
      <audio id="bubble-pop" src="bubble-pop.mp3" preload="auto"></audio>
    </>
  );
};

export default BubblePoppingTask;