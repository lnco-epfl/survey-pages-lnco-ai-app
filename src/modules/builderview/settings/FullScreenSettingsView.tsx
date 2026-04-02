import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from '@mui/material';
import Stack from '@mui/material/Stack';

import { FullScreenSettings } from '@/modules/config/AppSettings';

type FullScreenSettingsViewProps = {
  fullScreenSettings: FullScreenSettings;
  onChange: (newSetting: FullScreenSettings) => void;
};

const FullScreenSettingsView: FC<FullScreenSettingsViewProps> = ({
  fullScreenSettings,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.FULL_SCREEN',
  });
  const { fullScreen, pagePerQuestion, language, fontSize } =
    fullScreenSettings;
  const selectedLanguage = language ?? 'en';
  const selectedFontSize = fontSize ?? 'normal';
  return (
    <Stack spacing={1}>
      <FormControlLabel
        control={<Switch />}
        label={t('LABEL_FULL_SCREEN')}
        onChange={(e, checked) =>
          onChange({ ...fullScreenSettings, fullScreen: checked })
        }
        checked={fullScreen}
      />
      <FormControlLabel
        control={<Switch />}
        label={t('LABEL_PAGE_PER_QUESTION')}
        onChange={(e, checked) =>
          onChange({ ...fullScreenSettings, pagePerQuestion: checked })
        }
        checked={pagePerQuestion}
      />
      <FormControl fullWidth>
        <InputLabel id="player-language-label">
          {t('LANGUAGE_LABEL')}
        </InputLabel>
        <Select
          labelId="player-language-label"
          value={selectedLanguage}
          label={t('LANGUAGE_LABEL')}
          onChange={(e) =>
            onChange({
              ...fullScreenSettings,
              language: e.target.value as 'en' | 'fr',
            })
          }
        >
          <MenuItem value="en">{t('LANGUAGE_ENGLISH')}</MenuItem>
          <MenuItem value="fr">{t('LANGUAGE_FRENCH')}</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="player-font-size-label">
          {t('FONT_SIZE_LABEL')}
        </InputLabel>
        <Select
          labelId="player-font-size-label"
          value={selectedFontSize}
          label={t('FONT_SIZE_LABEL')}
          onChange={(e) =>
            onChange({
              ...fullScreenSettings,
              fontSize: e.target.value as
                | 'small'
                | 'normal'
                | 'large'
                | 'extra-large',
            })
          }
        >
          <MenuItem value="small">{t('FONT_SIZE_SMALL')}</MenuItem>
          <MenuItem value="normal">{t('FONT_SIZE_NORMAL')}</MenuItem>
          <MenuItem value="large">{t('FONT_SIZE_LARGE')}</MenuItem>
          <MenuItem value="extra-large">{t('FONT_SIZE_EXTRA_LARGE')}</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};

export default FullScreenSettingsView;
