import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { FormControlLabel, Switch } from '@mui/material';
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
  const { fullScreen, pagePerQuestion } = fullScreenSettings;
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
    </Stack>
  );
};

export default FullScreenSettingsView;
