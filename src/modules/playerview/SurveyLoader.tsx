import { FC, useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { DataCollection, JsPsych } from 'jspsych';

import { AppSettings } from '../config/AppSettings';
import { useSettings } from '../context/SettingsContext';
import useSurveyResults from '../context/SurveyContext';
import { run } from './jspsych/experiment';

const SurveyLoader: FC = () => {
  const jsPsychRef = useRef<null | Promise<JsPsych>>(null);
  const { fullScreenSettings, nextStepSettings, sectionSettings } =
    useSettings();

  const { experimentResult, setExperimentResult: setSurveyResult } =
    useSurveyResults();

  const onFinish = useCallback(
    (rawData: DataCollection, settings: AppSettings): void => {
      setSurveyResult({
        rawData: { trials: rawData.values() as object[] },
        settings,
      });
    },
    [setSurveyResult],
  );

  useEffect(() => {
    if (!jsPsychRef.current) {
      jsPsychRef.current = run({
        input: {
          appSettings: {
            fullScreenSettings,
            nextStepSettings,
            sectionSettings,
          },
          experimentResult,
        },
        onFinish,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="jspsych-content-outer-wrapper">
      <div id="jspsych-content" className="jspsych-content-outer" />
    </div>
  );
};

export default SurveyLoader;
