import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { FormControlLabel, MenuItem, Switch, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';

import { ShortAnswer } from '@/modules/config/AppSettings';

type ShortAnswerSettingsViewProps = {
  questionObject: ShortAnswer;
  onChange: (question: ShortAnswer) => void;
};

const ShortAnswerSettingsView: FC<ShortAnswerSettingsViewProps> = ({
  questionObject,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.SECTIONS',
  });
  const { question, description, mandatory, answerType } = questionObject;

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
      />
      <FormControlLabel
        control={<Switch />}
        label={t('MANDATORY_LABEL')}
        onChange={(e, checked) =>
          onChange({ ...questionObject, mandatory: checked })
        }
        checked={mandatory}
      />
      <TextField
        select
        label={t('ANSWER_TYPE_LABEL')}
        value={answerType}
        onChange={(e) =>
          onChange({
            ...questionObject,
            answerType: e.target.value as 'number' | 'text' | 'date',
          })
        }
      >
        <MenuItem value="text">{t('TEXT_TYPE_LABEL')}</MenuItem>
        <MenuItem value="number">{t('NUMBER_TYPE_LABEL')}</MenuItem>
        <MenuItem value="date">{t('DATE_TYPE_LABEL')}</MenuItem>
      </TextField>
    </Stack>
  );
};

export default ShortAnswerSettingsView;
