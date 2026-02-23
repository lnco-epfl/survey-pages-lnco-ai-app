import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import {
  ExclusionCriterion,
  ExclusionOperator,
  ExclusionSettings,
} from '@/modules/config/AppSettings';

type ExclusionSettingsViewProps = {
  exclusionSettings: ExclusionSettings;
  questionOptions: { value: string; label: string }[];
  onChange: (newSetting: ExclusionSettings) => void;
};

const ExclusionSettingsView: FC<ExclusionSettingsViewProps> = ({
  exclusionSettings,
  questionOptions,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.EXCLUSION',
  });

  const updateCriterion = (
    index: number,
    criterion: ExclusionCriterion,
  ): void => {
    const nextCriteria = exclusionSettings.criteria.map(
      (current, currentIndex) => (currentIndex === index ? criterion : current),
    );
    onChange({ ...exclusionSettings, criteria: nextCriteria });
  };

  const removeCriterion = (index: number): void => {
    const nextCriteria = exclusionSettings.criteria.filter(
      (_, currentIndex) => currentIndex !== index,
    );
    onChange({ ...exclusionSettings, criteria: nextCriteria });
  };

  const addCriterion = (): void => {
    const defaultQuestion = questionOptions[0]?.value ?? '';
    onChange({
      ...exclusionSettings,
      criteria: [
        ...exclusionSettings.criteria,
        {
          questionName: defaultQuestion,
          operator: ExclusionOperator.Equals,
          value: '',
        },
      ],
    });
  };

  return (
    <Stack spacing={1}>
      <FormControlLabel
        control={<Switch />}
        label={t('ENABLE_LABEL')}
        onChange={(_, checked) =>
          onChange({ ...exclusionSettings, enabled: checked })
        }
        checked={exclusionSettings.enabled}
      />
      {exclusionSettings.enabled && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{t('TITLE')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <FormControlLabel
                control={<Switch />}
                label={t('REQUIRE_CONFIRMATION')}
                onChange={(_, checked) =>
                  onChange({
                    ...exclusionSettings,
                    requireFinalConfirmation: checked,
                  })
                }
                checked={exclusionSettings.requireFinalConfirmation}
              />

              <FormControl fullWidth>
                <InputLabel id="match-mode-label">{t('MATCH_MODE')}</InputLabel>
                <Select
                  labelId="match-mode-label"
                  label={t('MATCH_MODE')}
                  value={exclusionSettings.matchMode}
                  onChange={(event) =>
                    onChange({
                      ...exclusionSettings,
                      matchMode: event.target.value as 'any' | 'all',
                    })
                  }
                >
                  <MenuItem value="any">{t('MATCH_ANY')}</MenuItem>
                  <MenuItem value="all">{t('MATCH_ALL')}</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="subtitle1">{t('CRITERIA_TITLE')}</Typography>
              {exclusionSettings.criteria.map((criterion, index) => (
                <Box key={`${criterion.questionName}-${index}`}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FormControl fullWidth>
                      <InputLabel id={`criterion-question-${index}`}>
                        {t('QUESTION_NAME')}
                      </InputLabel>
                      <Select
                        labelId={`criterion-question-${index}`}
                        label={t('QUESTION_NAME')}
                        value={criterion.questionName}
                        onChange={(event) =>
                          updateCriterion(index, {
                            ...criterion,
                            questionName: event.target.value,
                          })
                        }
                      >
                        {questionOptions.map((questionOption) => (
                          <MenuItem
                            key={questionOption.value}
                            value={questionOption.value}
                          >
                            {questionOption.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel id={`criterion-operator-${index}`}>
                        {t('OPERATOR')}
                      </InputLabel>
                      <Select
                        labelId={`criterion-operator-${index}`}
                        label={t('OPERATOR')}
                        value={criterion.operator}
                        onChange={(event) =>
                          updateCriterion(index, {
                            ...criterion,
                            operator: event.target.value as ExclusionOperator,
                          })
                        }
                      >
                        <MenuItem value={ExclusionOperator.Equals}>
                          {t('OPERATOR_EQUALS')}
                        </MenuItem>
                        <MenuItem value={ExclusionOperator.NotEquals}>
                          {t('OPERATOR_NOT_EQUALS')}
                        </MenuItem>
                        <MenuItem value={ExclusionOperator.Includes}>
                          {t('OPERATOR_INCLUDES')}
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label={t('VALUE')}
                      value={criterion.value}
                      onChange={(event) =>
                        updateCriterion(index, {
                          ...criterion,
                          value: event.target.value,
                        })
                      }
                    />

                    <IconButton
                      aria-label={t('REMOVE_CRITERION')}
                      onClick={() => removeCriterion(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Box>
              ))}

              <Box>
                <Button variant="outlined" onClick={addCriterion}>
                  {t('ADD_CRITERION')}
                </Button>
              </Box>

              <TextField
                value={exclusionSettings.confirmationTitle}
                label={t('CONFIRMATION_TITLE')}
                onChange={(event) =>
                  onChange({
                    ...exclusionSettings,
                    confirmationTitle: event.target.value,
                  })
                }
              />
              <TextField
                value={exclusionSettings.confirmationDescription}
                label={t('CONFIRMATION_DESCRIPTION')}
                multiline
                minRows={2}
                onChange={(event) =>
                  onChange({
                    ...exclusionSettings,
                    confirmationDescription: event.target.value,
                  })
                }
              />
              <TextField
                value={exclusionSettings.confirmationCheckboxLabel}
                label={t('CONFIRMATION_CHECKBOX_LABEL')}
                onChange={(event) =>
                  onChange({
                    ...exclusionSettings,
                    confirmationCheckboxLabel: event.target.value,
                  })
                }
              />

              <TextField
                value={exclusionSettings.exclusionTitle}
                label={t('EXCLUSION_TITLE')}
                onChange={(event) =>
                  onChange({
                    ...exclusionSettings,
                    exclusionTitle: event.target.value,
                  })
                }
              />
              <TextField
                value={exclusionSettings.exclusionDescription}
                label={t('EXCLUSION_DESCRIPTION')}
                multiline
                minRows={2}
                onChange={(event) =>
                  onChange({
                    ...exclusionSettings,
                    exclusionDescription: event.target.value,
                  })
                }
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
};

export default ExclusionSettingsView;
