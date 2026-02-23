import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

// eslint-disable-next-line import/no-extraneous-dependencies
import { isEqual } from 'lodash';

import {
  ExclusionSettings,
  FullScreenSettings,
  NextStepSettings,
  OtherElementType,
  QuestionTypes,
  SectionSettings,
} from '@/modules/config/AppSettings';
import { useSettings } from '@/modules/context/SettingsContext';

import ExclusionSettingsView from './ExclusionSettingsView';
import FullScreenSettingsView from './FullScreenSettingsView';
import NextStepSettingsView from './NextStepSettingsView';
import SectionSettingsView from './SectionSettingsView';

const SettingsView: FC = () => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS',
  });
  const {
    sectionSettings: sectionSavedState,
    fullScreenSettings: fullScreenSavedState,
    nextStepSettings: nextStepSettingsSavedState,
    exclusionSettings: exclusionSettingsSavedState,
    saveSettings,
  } = useSettings();

  const [sections, setSections] = useState<SectionSettings>(sectionSavedState);
  const [fullScreenSettings, setFullScreenSettings] =
    useState<FullScreenSettings>(fullScreenSavedState);
  const [nextStepSettings, setNextStepSettings] = useState<NextStepSettings>(
    nextStepSettingsSavedState,
  );
  const [exclusionSettings, setExclusionSettings] = useState<ExclusionSettings>(
    exclusionSettingsSavedState,
  );

  const questionOptions = useMemo(
    () =>
      sections.sections
        .flat()
        .filter((element) => element.type !== OtherElementType.Text)
        .map((element) => {
          if (element.type === QuestionTypes.LikertBlock) {
            return {
              value: element.name,
              label: element.description || element.name,
            };
          }

          return {
            value: element.name,
            label: element.question || element.name,
          };
        }),
    [sections.sections],
  );

  const saveAllSettings = (): void => {
    saveSettings('sectionSettings', sections);
    saveSettings('nextStepSettings', nextStepSettings);
    saveSettings('fullScreenSettings', fullScreenSettings);
    saveSettings('exclusionSettings', exclusionSettings);
  };

  const disableSave = useMemo(() => {
    if (
      isEqual(sectionSavedState, sections) &&
      isEqual(fullScreenSavedState, fullScreenSettings) &&
      isEqual(nextStepSettingsSavedState, nextStepSettings) &&
      isEqual(exclusionSettingsSavedState, exclusionSettings)
    ) {
      return true;
    }
    return false;
  }, [
    sectionSavedState,
    sections,
    fullScreenSavedState,
    fullScreenSettings,
    nextStepSettingsSavedState,
    nextStepSettings,
    exclusionSettingsSavedState,
    exclusionSettings,
  ]);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{t('TITLE')}</Typography>
      <FullScreenSettingsView
        fullScreenSettings={fullScreenSettings}
        onChange={(newSetting: FullScreenSettings) => {
          setFullScreenSettings(newSetting);
        }}
      />
      <SectionSettingsView
        sectionSettings={sections}
        onChange={(newSetting: SectionSettings) => {
          setSections(newSetting);
        }}
      />
      <NextStepSettingsView
        nextStepSettings={nextStepSettings}
        onChange={(newSetting: NextStepSettings) => {
          setNextStepSettings(newSetting);
        }}
      />
      <ExclusionSettingsView
        exclusionSettings={exclusionSettings}
        questionOptions={questionOptions}
        onChange={(newSetting: ExclusionSettings) => {
          setExclusionSettings(newSetting);
        }}
      />
      <Box>
        <Button
          variant="contained"
          onClick={saveAllSettings}
          disabled={disableSave}
        >
          Save
        </Button>
      </Box>
    </Stack>
  );
};

export default SettingsView;
