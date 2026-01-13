import {
  FC,
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';

import { sortBy } from 'lodash';

import {
  AppDataType,
  SurveyResultsAppData,
  getDefaultSurveyResultAppData,
} from '@/config/appData';

import { ExperimentResult } from '../config/AppResults';
import { hooks, mutations } from '../config/queryClient';

type SurveyContextType = {
  experimentResult?: ExperimentResult;
  setExperimentResult: (experimentResult: ExperimentResult) => void;
  deleteExperimentResult: (id?: SurveyResultsAppData['id']) => void;
  allSurveyResultsAppData?: SurveyResultsAppData[];
  status: 'loading' | 'error' | 'success';
};

const defaultContextValue: SurveyContextType = {
  setExperimentResult: () => null,
  deleteExperimentResult: () => null,
  status: 'loading',
};

const SurveyResultsContext =
  createContext<SurveyContextType>(defaultContextValue);

export const SurveyResultsProvider: FC<{
  children: ReactElement | ReactElement[];
}> = ({ children }) => {
  const { data, isSuccess, status } = hooks.useAppData<ExperimentResult>({
    type: AppDataType.SurveyResults,
  });

  const [surveyResultsAppData, setSurveyResultsAppData] =
    useState<SurveyResultsAppData>();
  const [allSurveyResultsAppData, setAllSurveyResultsAppData] =
    useState<SurveyResultsAppData[]>();

  const cachePayload = useRef<ExperimentResult>();
  // const debouncedPatch = useRef<ReturnType<typeof debounce>>();
  const hasPosted = useRef<boolean>(false);
  const { mutate: postAppData } = mutations.usePostAppData();
  const { mutate: patchAppData } = mutations.usePatchAppData();
  const { mutate: deleteAppData } = mutations.useDeleteAppData();
  const { permission, memberId } = useLocalContext();

  const isAdmin = useMemo(
    () => PermissionLevelCompare.gte(permission, PermissionLevel.Admin),
    [permission],
  );

  useEffect(() => {
    if (isSuccess) {
      const allIns = data.filter(
        (d) => d.type === AppDataType.SurveyResults,
      ) as SurveyResultsAppData[];
      setAllSurveyResultsAppData(allIns);
      setSurveyResultsAppData(
        sortBy(allIns, ['createdAt'])
          .reverse()
          .find((d) => d.member.id === memberId),
      );
    }
  }, [isSuccess, data, memberId]);

  useEffect(() => {
    if (isSuccess && surveyResultsAppData) {
      hasPosted.current = true;
    }
  });

  const setSurveyResult = useMemo(
    () =>
      (surveyResults: ExperimentResult): void => {
        const payloadData = surveyResults;
        if (isSuccess) {
          if (hasPosted.current) {
            if (surveyResultsAppData?.id) {
              // Eventually useless
              cachePayload.current = payloadData;
              patchAppData({
                ...surveyResultsAppData,
                data: cachePayload.current,
              });
            }
          } else {
            postAppData(getDefaultSurveyResultAppData(payloadData));
            hasPosted.current = true;
          }
        }
      },
    [isSuccess, patchAppData, postAppData, surveyResultsAppData],
  );

  const deleteSurveyResult = useMemo(
    () =>
      (id?: SurveyResultsAppData['id']): void => {
        if (id) {
          deleteAppData({ id });
        } else if (surveyResultsAppData) {
          deleteAppData({ id: surveyResultsAppData?.id });
        }
        setSurveyResultsAppData(undefined);
        hasPosted.current = false;
      },
    [deleteAppData, surveyResultsAppData],
  );
  const contextValue = useMemo(
    () => ({
      surveyResultsAppData: surveyResultsAppData?.data,
      setExperimentResult: setSurveyResult,
      allSurveyResultsAppData: isAdmin ? allSurveyResultsAppData : undefined,
      deleteExperimentResult: deleteSurveyResult,
      status,
    }),
    [
      allSurveyResultsAppData,
      deleteSurveyResult,
      isAdmin,
      setSurveyResult,
      status,
      surveyResultsAppData?.data,
    ],
  );

  return (
    <SurveyResultsContext.Provider value={contextValue}>
      {children}
    </SurveyResultsContext.Provider>
  );
};

const useSurveyResults = (): SurveyContextType =>
  useContext(SurveyResultsContext);

export default useSurveyResults;
