"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import MessagePopup from "components/common/MessagePopup";
import { timer } from "@utils/timer";
import { useSurveyContext } from "context/SurveyContext";
import useWindowSize from "@hooks/useWindowSize";
import ProgressiveCircle from "./ProgrgessiveCircle";

const DelayedGratificationTask = ({ isSurvey = false }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState(false);
  const [timerData, setTimerData] = useState<{
    startTime: string;
    endTime: string;
    timeLimit: number;
    isTimeOver: boolean;
    timeTaken: number;
  } | null>(null);
  const [surveyData, setSurveyData] = useState<any>({});

  const { windowSize, deviceType } = useWindowSize();
  const { state, dispatch } = useSurveyContext();
  const searchParams = useSearchParams();
  const attemptString = searchParams.get("attempt") || "0";
  const attempt = parseInt(attemptString);
  const reAttemptUrl =
    attempt < 3 ? `delayed-gratification-task?attempt=${attempt + 1}` : null;
  const timeLimit = 30000;

  useEffect(() => {
    if (isSurvey) {
      handleStartGame();
    }
  }, [isSurvey]);

  useEffect(() => {
    if (timerData?.isTimeOver && !alertShown) {
      closeGame(timerData);
      setAlertShown(true);
    }
  }, [alertShown, timerData]);

  const handleStartGame = () => {
    handleTimer();
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
      console.log({ timeData });
      if (isSurvey) {
        setShowPopup(true);
        console.log({ timeData });
        setSurveyData((prevState: any) => {
          const updatedSurveyData = {
            ...prevState,
            timeTaken: timeData.timeTaken,
            timeLimit: timeData?.timeLimit || "",
            endTime: timeData?.endTime || "",
            startTime: timeData?.startTime || "",
            closedWithTimeout: timeData?.isTimeOver || false,
            screenHeight: windowSize.height,
            screenWidth: windowSize.width,
            deviceType,
          };

          dispatch({
            type: "UPDATE_SURVEY_DATA",
            attempt,
            task: "DelayedGratificationTask",
            data: updatedSurveyData,
          });

          return updatedSurveyData;
        });
      }
    },
    [isSurvey, timerData, attempt]
  );

  const handleCloseGame = () => {
    if (isSurvey) {
      const timeData = handleStopTimer();
      closeGame(timeData);
    } else {
      alert("you may start the game!");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div
        className="w-52 h-52 top-40 left-32 absolute cursor-pointer z-60"
        onClick={() => handleCloseGame()}
      >
        <Image
          width={150}
          height={150}
          src="/gif/dance.gif"
          objectFit="contain"
          alt="langaugesampling.png"
          // className="w-auto w-auto"
        />
      </div>
      <div className="top-1/2 relative w-full flex justify-center align-middle items-center gap-20">
        <div className="absolute">
          <ProgressiveCircle />
        </div>
      </div>

      {isSurvey && (
        <MessagePopup
          showFilter={showPopup}
          msg={
            "You have completed the Delayed Gratification Task. You can now make another attempt for this test, go back to the survey dashboard or start the new task. "
          }
          testName={"delayed gratification"}
          reAttemptUrl={reAttemptUrl}
        />
      )}
    </div>
  );
};

export default DelayedGratificationTask;
