import { AppSettings } from './AppSettings';

export type ExperimentResult = {
  settings?: AppSettings;
  rawData?: { trials: object[] };
};
