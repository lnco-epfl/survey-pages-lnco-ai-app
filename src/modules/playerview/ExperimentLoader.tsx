import { FC, useEffect, useRef, useState } from 'react';

import { Typography } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';

import { DataCollection, JsPsych } from 'jspsych';

import { parseScreenCalibration } from '@/utils/screenCalibration';

import { TrialData } from '../config/AppResults';
import {
  AppSettings,
  OtherElementType,
  QuestionTypes,
} from '../config/AppSettings';
import useExperimentResults from '../context/ExperimentContext';
import { useSettings } from '../context/SettingsContext';
import { run } from './jspsych/experiment';

export const ExperimentLoader: FC = () => {
  const settings = useSettings();
  // screenCalibration may not exist in the LocalContext type yet, so cast to access it
  const { screenCalibration } = useLocalContext() as Record<string, unknown>;
  const parsedCalibration = parseScreenCalibration(screenCalibration);

  const jsPsychRef = useRef<null | Promise<JsPsych>>(null);

  const { status, experimentResultsAppData, setExperimentResult } =
    useExperimentResults();

  const isCompleted = (
    trials: TrialData[],
    // eslint-disable-next-line @typescript-eslint/no-shadow
    _settings: AppSettings,
  ): boolean => {
    // Count total mandatory questions across all sections
    const totalMandatoryQuestions = _settings.sectionSettings.sections.reduce(
      (total, section) =>
        total +
        section.reduce((sectionTotal, question) => {
          if (
            question.type !== OtherElementType.Text &&
            (question.mandatory ||
              (question.type === QuestionTypes.LikertBlock &&
                question.requireAll))
          ) {
            return sectionTotal + 1;
          }
          return sectionTotal;
        }, 0),
      0,
    );

    // Check if trials exist and have enough responses
    return (
      trials.length > 0 &&
      trials[0].response &&
      Object.keys(trials[0].response).length >= totalMandatoryQuestions
    );
  };

  const updateData = (
    rawData: DataCollection,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    settings: AppSettings,
  ): void => {
    const responseArray = rawData.values();
    setExperimentResult({
      rawData: { trials: responseArray },
      settings,
    });
  };

  const [completedContent, setCompletedContent] = useState<JSX.Element | null>(
    null,
  );

  useEffect(() => {
    if (status === 'success' && !experimentResultsAppData) {
      setExperimentResult({
        rawData: { trials: [] },
        settings,
      });
    }
    if (!jsPsychRef.current && experimentResultsAppData?.rawData) {
      if (experimentResultsAppData.rawData?.trials.length === 0) {
        jsPsychRef.current = run({
          input: {
            settings,
            results: experimentResultsAppData,
            screenCalibration: parsedCalibration,
          },
          // eslint-disable-next-line @typescript-eslint/no-shadow
          updateData: (data, settings) => updateData(data, settings),
        });
      } else if (
        isCompleted(experimentResultsAppData.rawData.trials, settings)
      ) {
        setCompletedContent(
          <Typography variant="h5" style={{ backgroundColor: 'white' }}>
            You have previously completed this experiment, please reach out to
            the experimenter if this is not correct.
          </Typography>,
        );
      } else {
        jsPsychRef.current = run({
          input: {
            settings,
            results: experimentResultsAppData,
            screenCalibration: parsedCalibration,
          },
          // eslint-disable-next-line @typescript-eslint/no-shadow
          updateData: (data, settings) => updateData(data, settings),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentResultsAppData, setExperimentResult, settings, status]);

  if (completedContent) {
    return completedContent;
  }
  return <div id="jspsych-display-element" />;
};
