import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';
import Stack from '@mui/material/Stack';

import { MultipleChoice } from '@/modules/config/AppSettings';

type MultipleChoiceSettingsViewProps = {
  questionObject: MultipleChoice;
  onChange: (question: MultipleChoice) => void;
};

const MultipleChoiceSettingsView: FC<MultipleChoiceSettingsViewProps> = ({
  questionObject,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.SECTIONS',
  });
  const { question, description, answers, mandatory } = questionObject;

  const answerFields = answers.map((answer, index) => (
    <TextField
      key={index}
      value={answer}
      label={`${t('ANSWER_LABEL')} ${index + 1}`}
      onChange={(e) =>
        onChange({
          ...questionObject,
          answers: questionObject.answers.map((oldAnswer, i) =>
            i === index ? e.target.value : oldAnswer,
          ),
        })
      }
    />
  ));

  // Function to handle adding a new item
  const handleAddNewAnswer = (): MultipleChoice => ({
    ...questionObject,
    answers: [...answers, ''],
  });

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
      {answerFields}
      <Box>
        <Button
          variant="outlined"
          onClick={() => onChange(handleAddNewAnswer())}
        >
          {t('ADD_ANSWER')}
        </Button>
      </Box>
    </Stack>
  );
};

export default MultipleChoiceSettingsView;
