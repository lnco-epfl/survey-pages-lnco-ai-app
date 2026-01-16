import { AppSettings } from './AppSettings';

export type ExperimentResult = {
  settings?: AppSettings;
  rawData?: { trials: TrialData[] };
};

export type TrialData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
