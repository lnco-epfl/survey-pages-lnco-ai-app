import { AppData, AppDataVisibility } from '@graasp/sdk';

import { ExperimentResult } from '@/modules/config/AppResults';

export enum AppDataType {
  SurveyResults = 'survey-results',
}

export type SurveyResultsAppData = AppData & {
  type: AppDataType.SurveyResults;
  data: ExperimentResult;
  visibility: AppDataVisibility.Member;
};

export const getDefaultSurveyResultAppData = (
  userInteraction: ExperimentResult,
): Pick<SurveyResultsAppData, 'data' | 'type' | 'visibility'> => ({
  type: AppDataType.SurveyResults,
  data: userInteraction,
  visibility: AppDataVisibility.Member,
});
