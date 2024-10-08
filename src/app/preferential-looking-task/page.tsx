'use client';
import React from 'react';
import { useState } from 'react';
import { TasksConstant } from 'constants/tasks.constant';
import TaskHome from 'components/TaskHome';
import PreferentialLookingTask from './PreferentialLookingTask';
import SuspenseWrapper from 'components/SuspenseWrapper';
import PreferentialLookingStateContext from 'state/context/PreferentialLookingStateContext';
import { PreferentialLookingStateProvider } from 'state/provider/PreferentialLookingStateProvider';
import FullScreenWrapper from 'components/FullScreenWrapper';

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);

  const data = TasksConstant.PreferentialLookingTask;

  const handleStartGame = () => {
    setSurvey(!survey);
  };

  return (
    <>
      {survey ? (
        <FullScreenWrapper isFullScreen={survey}>
          <PreferentialLookingTask isSurvey={survey} />
        </FullScreenWrapper>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TaskHome
            taskName={data.title}
            taskMessage={data.taskMessage}
            handleStartGame={() => handleStartGame()}
          />
          <PreferentialLookingTask />
        </div>
      )}
    </>
  );
};

export default function Page() {
  return (
    <SuspenseWrapper>
      <PreferentialLookingStateProvider>
        <IndexPage />
      </PreferentialLookingStateProvider>
    </SuspenseWrapper>
  );
}
