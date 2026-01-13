import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

// eslint-disable-next-line import/no-extraneous-dependencies
import { isEqual } from 'lodash';

import {
  FullScreenSettings,
  NextStepSettings,
  SectionSettings,
} from '@/modules/config/AppSettings';
import { useSettings } from '@/modules/context/SettingsContext';

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
    saveSettings,
  } = useSettings();

  const [sections, setSections] = useState<SectionSettings>(sectionSavedState);
  const [fullScreenSettings, setFullScreenSettings] =
    useState<FullScreenSettings>(fullScreenSavedState);
  const [nextStepSettings, setNextStepSettings] = useState<NextStepSettings>(
    nextStepSettingsSavedState,
  );

  const saveAllSettings = (): void => {
    saveSettings('sectionSettings', sections);
    saveSettings('nextStepSettings', nextStepSettings);
    saveSettings('fullScreenSettings', fullScreenSettings);
  };

  const disableSave = useMemo(() => {
    if (
      isEqual(sectionSavedState, sections) &&
      isEqual(fullScreenSavedState, fullScreenSettings) &&
      isEqual(nextStepSettingsSavedState, nextStepSettings)
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
