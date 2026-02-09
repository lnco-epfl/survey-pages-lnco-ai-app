import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
} from '@mui/material';
import Stack from '@mui/material/Stack';

import { MultiAnswer } from '@/modules/config/AppSettings';

type MultiAnswerSettingsViewProps = {
  questionObject: MultiAnswer;
  onChange: (question: MultiAnswer) => void;
};

const MultiAnswerSettingsView: FC<MultiAnswerSettingsViewProps> = ({
  questionObject,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.SECTIONS',
  });
  const {
    question,
    answers,
    description,
    mandatory,
    hasOtherOption,
    otherOptionText,
  } = questionObject;

  const answerFields = answers.map((answer, index) => (
    <Box
      key={index}
      sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1.5 }}
    >
      <TextField
        fullWidth
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
      <IconButton
        onClick={() =>
          onChange({
            ...questionObject,
            answers: questionObject.answers.filter((_, i) => i !== index),
          })
        }
        disabled={answers.length <= 1}
        size="small"
        color="error"
        sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  ));

  // Function to handle adding a new answer
  const handleAddNewAnswer = (): MultiAnswer => ({
    ...questionObject,
    answers: [...answers, ''], // Add an empty answer
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
      <FormControlLabel
        control={<Switch />}
        label="Include 'Other' Option"
        onChange={(e, checked) =>
          onChange({
            ...questionObject,
            hasOtherOption: checked,
            otherOptionText: checked ? 'Other, please specify' : '',
          })
        }
        checked={hasOtherOption ?? false}
      />
      {hasOtherOption && (
        <TextField
          value={otherOptionText || ''}
          label="Other Option Text"
          onChange={(e) =>
            onChange({ ...questionObject, otherOptionText: e.target.value })
          }
        />
      )}
    </Stack>
  );
};

export default MultiAnswerSettingsView;
