'use client';
import React, { useEffect, useState } from 'react';
import TimerComponent from './TimerComponent';
import TouchPressureComponent from 'app/bubble-popping-task/TouchPressure';
import { LOCALSTORAGE } from '@constants/storage.constant';
import { getLocalStorageValue } from '@utils/localStorage';
import { VideoProcessorComponent } from 'app/preferential-looking-task/VideoProcessorComponent';

const Index = () => {
  const [vidSRC, setVidSRC] = useState('');
  useEffect(() => {
    setVidSRC(getLocalStorageValue('recordedVideo'));
  }, []);

  return (
    <div className="w-screen h-screen">
      {/* <TouchPressureComponent /> */}
      <video
        src={vidSRC}
        controls
        className="w-full mt-4"
        // type="video/webm"
      />
      <VideoProcessorComponent />
    </div>
  );
};

export default Index;
