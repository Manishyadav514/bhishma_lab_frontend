'use client';
import { LOCALSTORAGE } from '@constants/storage.constant';
import { InitialSurveyState } from '@constants/survey.data.constant';
import { getLocalStorageValue, setLocalStorageValue } from '@utils/localStorage';
import React, { useReducer, ReactNode, useContext, useEffect } from 'react';
import SurveyContext from 'state/context/SurveyContext';
import { SurveyReducer } from 'state/reducer/SurveyReducer';

const SurveyProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    SurveyReducer,
    InitialSurveyState,
    (initial) => {
      // Load state from localStorage or fallback to initial state
      const persisted = getLocalStorageValue('surveyData');
      return persisted ? JSON.parse(persisted) : initial;
    }
  );

  useEffect(() => {
    // Save state to localStorage whenever it changes
    // localStorage?.setItem('surveyData', JSON.stringify(state));
    setLocalStorageValue(LOCALSTORAGE.SURVEY_DATA, state, true);
    // const surveyData = JSON.stringify(state);
    console.log(`Data size: ${new Blob([state]).size / 1024} KB`); // Size in KB
  }, [state]);
  // useEffect(() => {
  //   // Save state to localStorage whenever it changes
  //   setLocalStorageValue(LOCALSTORAGE.SURVEY_DATA, state, true);
  // }, [state]);

  return (
    <SurveyContext.Provider value={{ state, dispatch }}>
      {children}
    </SurveyContext.Provider>
  );
};

const useSurveyContext = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurveyContext must be used within a SurveyProvider');
  }
  return context;
};

export { SurveyProvider, useSurveyContext };
