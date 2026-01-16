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

import { LikertBlock } from '@/modules/config/AppSettings';

type LikertBlockSettingsViewProps = {
  questionObject: LikertBlock;
  onChange: (question: LikertBlock) => void;
};

const LikertBlockSettingsView: FC<LikertBlockSettingsViewProps> = ({
  questionObject,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.SECTIONS',
  });
  const { questions, scale, description, mandatory } = questionObject;

  const questionFields = questions.map((questionOption, index) => (
    <TextField
      key={index}
      value={questionOption}
      label={`${t('QUESTION_LABEL')} / Row ${index + 1}`}
      onChange={(e) =>
        onChange({
          ...questionObject,
          questions: questionObject.questions.map((oldQuestion, i) =>
            i === index ? e.target.value : oldQuestion,
          ),
        })
      }
    />
  ));

  const scaleFields = scale.map((scaleOption, index) => (
    <TextField
      key={index}
      value={scaleOption}
      label={`${t('SCALE_OPTION_LABEL')} / Column ${index + 1}`}
      onChange={(e) =>
        onChange({
          ...questionObject,
          scale: questionObject.scale.map((oldOption, i) =>
            i === index ? e.target.value : oldOption,
          ),
        })
      }
    />
  ));

  // Function to handle adding a new question (row)
  const handleAddNewQuestion = (): LikertBlock => ({
    ...questionObject,
    questions: [...questions, ''], // Add an empty question
  });

  // Function to handle adding a new scale option (column)
  const handleAddNewScaleOption = (): LikertBlock => ({
    ...questionObject,
    scale: [...scale, ''], // Add an empty scale option
  });

  return (
    <Stack spacing={1}>
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
      <FormControlLabel
        control={<Switch />}
        label="Require All Questions"
        onChange={(e, checked) =>
          onChange({ ...questionObject, requireAll: checked })
        }
        checked={questionObject.requireAll ?? false}
      />
      <Box sx={{ mt: 2 }}>
        <Box sx={{ mb: 1 }}>
          <strong>Questions (Rows):</strong>
        </Box>
        {questionFields}
        <Box sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => onChange(handleAddNewQuestion())}
            size="small"
          >
            {t('ADD_QUESTION_LABEL', 'Add Question')}
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Box sx={{ mb: 1 }}>
          <strong>Scale Options (Columns):</strong>
        </Box>
        {scaleFields}
        <Box sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => onChange(handleAddNewScaleOption())}
            size="small"
          >
            {t('ADD_SCALE_OPTION')}
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default LikertBlockSettingsView;
