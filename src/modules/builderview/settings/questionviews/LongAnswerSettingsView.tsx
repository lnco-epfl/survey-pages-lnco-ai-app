import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { FormControlLabel, Switch, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';

import { LongAnswer } from '@/modules/config/AppSettings';

type LongAnswerSettingsViewProps = {
  questionObject: LongAnswer;
  onChange: (question: LongAnswer) => void;
};

const LongAnswerSettingsView: FC<LongAnswerSettingsViewProps> = ({
  questionObject,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.SECTIONS',
  });
  const { question, description, mandatory } = questionObject;

  return (
    <Stack spacing={1}>
      <TextField
        value={question}
        label={t('QUESTION_LABEL')}
        onChange={(e) =>
          onChange({ ...questionObject, question: e.target.value })
        }
      />
      <TextField
        value={description}
        label={t('DESCRIPTION_LABEL')}
        onChange={(e) =>
          onChange({ ...questionObject, description: e.target.value })
        }
        fullWidth
      />
      <TextField
        multiline
        rows={5}
        label="Preview Long Answer Field"
        placeholder="This is how the long answer field will look in the survey"
        fullWidth
        inputProps={{
          style: { fontFamily: 'inherit', fontSize: 'inherit' },
        }}
        disabled
      />
      <FormControlLabel
        control={<Switch />}
        label={t('MANDATORY_LABEL')}
        onChange={(e, checked) =>
          onChange({ ...questionObject, mandatory: checked })
        }
        checked={mandatory}
      />
    </Stack>
  );
};

export default LongAnswerSettingsView;
