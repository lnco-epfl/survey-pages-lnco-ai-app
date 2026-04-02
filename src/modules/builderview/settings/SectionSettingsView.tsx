import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';

import {
  LikertBlock,
  LikertScale,
  LongAnswer,
  MultiAnswer,
  MultipleChoice,
  OtherElementType,
  QuestionTypes,
  SectionSettings,
  ShortAnswer,
  SurveyElement,
  SurveyElementType,
  TableInput,
  TextElement,
} from '@/modules/config/AppSettings';

import LikertScaleSettingsView from './questionviews/LickertScaleSettingsView';
import LikertBlockSettingsView from './questionviews/LikertBlockSettingsView';
import LongAnswerSettingsView from './questionviews/LongAnswerSettingsView';
import MultiAnswerSettingsView from './questionviews/MultiAnswerSettingsView';
import MultipleChoiceSettingsView from './questionviews/MultipleChoiceSettingsView';
import ShortAnswerSettingsView from './questionviews/ShortAnswerSettingsView';
import TableInputSettingsView from './questionviews/TableInputSettingsView';
import TextElementSettingsView from './questionviews/TextElementSettingsView';

type SectionSettingsViewProps = {
  sectionSettings: SectionSettings;
  onChange: (newSetting: SectionSettings) => void;
};

const createQuestionId = (): string =>
  `id${Math.random().toString(16).slice(2)}`;

const SectionSettingsView: FC<SectionSettingsViewProps> = ({
  sectionSettings,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.SECTIONS',
  });
  const { sections, pageButtonSettings } = sectionSettings;

  // Function to handle adding a new item
  const handleAddNewItem = (
    type: SurveyElementType,
    pageNr: number,
  ): SectionSettings => {
    let newItem: SurveyElement | undefined; // Initialize as undefined
    switch (type) {
      case QuestionTypes.MultipleChoice:
        newItem = {
          type: QuestionTypes.MultipleChoice,
          name: createQuestionId(),
          question: '',
          answers: [''],
          description: '',
          mandatory: false,
        };
        break;
      case QuestionTypes.ShortAnswer:
        newItem = {
          type: QuestionTypes.ShortAnswer,
          name: createQuestionId(),
          question: '',
          mandatory: false,
          description: '',
          answerType: 'text',
        };
        break;

      case QuestionTypes.LongAnswer:
        newItem = {
          type: QuestionTypes.LongAnswer,
          name: createQuestionId(),
          question: '',
          description: '',
          mandatory: false,
        };
        break;
      case QuestionTypes.MultiAnswer:
        newItem = {
          type: QuestionTypes.MultiAnswer,
          name: createQuestionId(),
          question: '',
          mandatory: false,
          description: '',
          answers: [''],
        };
        break;
      case QuestionTypes.LikertScale:
        newItem = {
          type: QuestionTypes.LikertScale,
          name: createQuestionId(),
          question: '',
          mandatory: false,
          description: '',
          scale: [
            'Strongly Disagree',
            'Disagree',
            'Neutral',
            'Agree',
            'Strongly Agree',
          ],
        };
        break;
      case QuestionTypes.LikertBlock:
        newItem = {
          type: QuestionTypes.LikertBlock,
          name: createQuestionId(),
          description: '',
          mandatory: false,
          requireAll: true,
          questions: [''],
          scale: [
            'Strongly Disagree',
            'Disagree',
            'Neutral',
            'Agree',
            'Strongly Agree',
          ],
        };
        break;
      case QuestionTypes.TableInput:
        newItem = {
          type: QuestionTypes.TableInput,
          name: createQuestionId(),
          question: '',
          description: '',
          mandatory: false,
          columns: [
            {
              name: 'column1',
              label: 'Column 1',
              inputType: 'text',
              required: false,
            },
          ],
          minRows: 1,
          maxRows: 10,
        };
        break;
      case OtherElementType.Text:
        newItem = {
          type: OtherElementType.Text,
          name: createQuestionId(),
          title: '',
          description: '',
          continueButtonText: '',
        };
        break;
      default:
        break;
    }

    if (newItem) {
      const updatedItems = [...sections[pageNr], newItem]; // Append the new item
      const updateSections = [...sections];
      updateSections[pageNr] = updatedItems;
      return {
        pageButtonSettings,
        sections: updateSections,
      };
    }
    return { pageButtonSettings, sections };
  };

  const handleAddNewPage = (): SectionSettings => {
    const newSections = [...sections, []];
    return { pageButtonSettings, sections: newSections };
  };

  const onChangeQuestion = (
    index: number,
    pageNr: number,
    newQuestion: SurveyElement,
  ): void => {
    const updatedSections = [...sections];
    const updatedQuestions = sections[pageNr].map((question, i) =>
      i === index ? newQuestion : question,
    );
    updatedSections[pageNr] = updatedQuestions;
    onChange({ pageButtonSettings, sections: updatedSections });
  };

  const onDeleteButtonClick = (index: number, pageNr: number): void => {
    const updatedSections = [...sections];
    const updatedQuestions = sections[pageNr].filter(
      (question, i) => i !== index,
    );
    updatedSections[pageNr] = updatedQuestions;
    onChange({ pageButtonSettings, sections: updatedSections });
  };

  const onUpButtonClick = (
    index: number,
    pageNr: number,
    changeSections: boolean,
  ): void => {
    // Create a copy of the sections
    let updatedSections = [...sections];

    if (changeSections) {
      // Check if we are not in the first section and there is a previous section to move the question to
      if (pageNr > 0) {
        const currentQuestions = updatedSections[pageNr]; // Get the current section's questions
        const questionToMove = currentQuestions[index]; // Store the question to be moved

        // Remove the question from the current section
        updatedSections[pageNr] = currentQuestions.filter(
          (_, i) => i !== index,
        );

        // Move the question to the previous section
        const previousQuestions = updatedSections[pageNr - 1];

        // Insert the question into the previous section at the appropriate position
        previousQuestions.push(questionToMove);
        updatedSections[pageNr - 1] = previousQuestions; // Update previous section's questions
      } else {
        // If this is the first section, create a new section
        const currentQuestions = updatedSections[0];
        const questionToMove = currentQuestions[index];

        // Remove the question from the first section
        updatedSections[0] = currentQuestions.filter((_, i) => i !== index);

        // Create a new section and add the question to it
        const newSection = [questionToMove];
        updatedSections = [newSection, ...updatedSections]; // Add the new section at the beginning
      }
    } else {
      // Handle the case for moving up within the same section
      const updatedQuestions = [...updatedSections[pageNr]]; // Copy the current section's questions
      const temp = updatedQuestions[index - 1]; // Store the question above the current one
      updatedQuestions[index - 1] = updatedQuestions[index]; // Swap the current question up
      updatedQuestions[index] = temp; // Swap the above question down

      updatedSections[pageNr] = updatedQuestions; // Update the current section's questions
    }
    onChange({ pageButtonSettings, sections: updatedSections }); // Update the state
  };

  const onDownButtonClick = (
    index: number,
    pageNr: number,
    changeSections: boolean,
  ): void => {
    // Create a copy of the sections
    const updatedSections = [...sections];

    if (changeSections) {
      // Check if we are not in the last section
      if (pageNr < sections.length - 1) {
        const currentQuestions = updatedSections[pageNr]; // Get the current section's questions
        const questionToMove = currentQuestions[index]; // Store the question to be moved

        // Remove the question from the current section
        updatedSections[pageNr] = currentQuestions.filter(
          (_, i) => i !== index,
        );

        // Move the question to the previous section
        updatedSections[pageNr + 1] = [
          questionToMove,
          ...updatedSections[pageNr + 1],
        ];
      }
    } else {
      // Handle the case for moving up within the same section
      const updatedQuestions = [...updatedSections[pageNr]]; // Copy the current section's questions
      const temp = updatedQuestions[index + 1]; // Store the question above the current one
      updatedQuestions[index + 1] = updatedQuestions[index]; // Swap the current question up
      updatedQuestions[index] = temp; // Swap the above question down

      updatedSections[pageNr] = updatedQuestions; // Update the current section's questions
    }
    onChange({ pageButtonSettings, sections: updatedSections }); // Update the state
  };

  const elementHeaderArea = (
    index: number,
    pageNr: number,
    type: SurveyElementType,
  ): ReactNode => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="body1">{`Element ${index + 1}: ${t(`LABEL_${type}`)}`}</Typography>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        divider={
          <Divider orientation="vertical" flexItem sx={{ marginY: '8px' }} />
        }
      >
        {index !== 0 && (
          <Button
            variant="text"
            onClick={() => onUpButtonClick(index, pageNr, false)}
          >
            Up
          </Button>
        )}

        {pageNr !== 0 && index === 0 && (
          <Button
            variant="text"
            onClick={() => onUpButtonClick(index, pageNr, true)}
          >
            Move to Previous Section
          </Button>
        )}
        {index !== sections[pageNr].length - 1 && (
          <Button
            variant="text"
            onClick={() => onDownButtonClick(index, pageNr, false)}
          >
            Down
          </Button>
        )}
        {pageNr !== sections.length - 1 &&
          index === sections[pageNr].length - 1 && (
            <Button
              variant="text"
              onClick={() => onDownButtonClick(index, pageNr, true)}
            >
              Move to Next Section
            </Button>
          )}
        <Button
          variant="text"
          onClick={() => onDeleteButtonClick(index, pageNr)}
        >
          Delete
        </Button>
      </Stack>
    </Box>
  );

  const onPageDeleteButtonClick = (pageNr: number): void => {
    const updatedSections = sections.filter((section, i) => i !== pageNr);
    onChange({ pageButtonSettings, sections: updatedSections });
  };

  const onPageUpButtonClick = (pageNr: number): void => {
    // Create a copy of the sections
    const updatedSections = [...sections];
    const temp = updatedSections[pageNr - 1]; // Store the question above the current one
    updatedSections[pageNr - 1] = updatedSections[pageNr]; // Swap the current question up
    updatedSections[pageNr] = temp; // Swap the above question down
    onChange({ pageButtonSettings, sections: updatedSections }); // Update the state
  };

  const onPageDownButtonClick = (pageNr: number): void => {
    // Create a copy of the sections
    const updatedSections = [...sections];
    // Handle the case for moving up within the same section
    const temp = updatedSections[pageNr + 1]; // Store the question above the current one
    updatedSections[pageNr + 1] = updatedSections[pageNr]; // Swap the current question up
    updatedSections[pageNr] = temp; // Swap the above question down
    onChange({ pageButtonSettings, sections: updatedSections }); // Update the state
  };

  const pageHeaderArea = (pageNr: number): ReactNode => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%', // Ensure the Box takes the full width of its parent
      }}
    >
      <Typography variant="h6">{`Page ${pageNr + 1}`}</Typography>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        divider={
          <Divider orientation="vertical" flexItem sx={{ marginY: '8px' }} />
        }
      >
        {pageNr !== 0 && (
          <Button variant="text" onClick={() => onPageUpButtonClick(pageNr)}>
            Up
          </Button>
        )}
        {pageNr !== sections.length - 1 && (
          <Button variant="text" onClick={() => onPageDownButtonClick(pageNr)}>
            Down
          </Button>
        )}
        <Button variant="text" onClick={() => onPageDeleteButtonClick(pageNr)}>
          Delete
        </Button>
      </Stack>
    </Box>
  );

  const getSectionsDisplay = (): ReactNode[] =>
    sections
      ? sections.map((section, pageNr) => {
          const sectionContent = section.map((element, index) => {
            switch (element.type) {
              case QuestionTypes.ShortAnswer:
                return (
                  <Stack spacing={1}>
                    {elementHeaderArea(
                      index,
                      pageNr,
                      QuestionTypes.ShortAnswer,
                    )}
                    <ShortAnswerSettingsView
                      questionObject={element as ShortAnswer}
                      onChange={(newQuestion: ShortAnswer) =>
                        onChangeQuestion(index, pageNr, newQuestion)
                      }
                    />
                  </Stack>
                );
              case QuestionTypes.LongAnswer:
                return (
                  <Stack spacing={1}>
                    {elementHeaderArea(index, pageNr, QuestionTypes.LongAnswer)}
                    <LongAnswerSettingsView
                      questionObject={element as LongAnswer}
                      onChange={(newQuestion: LongAnswer) =>
                        onChangeQuestion(index, pageNr, newQuestion)
                      }
                    />
                  </Stack>
                );
              case QuestionTypes.MultipleChoice:
                return (
                  <Stack spacing={1}>
                    {elementHeaderArea(
                      index,
                      pageNr,
                      QuestionTypes.MultipleChoice,
                    )}
                    <MultipleChoiceSettingsView
                      questionObject={element as MultipleChoice}
                      onChange={(newQuestion: MultipleChoice) =>
                        onChangeQuestion(index, pageNr, newQuestion)
                      }
                    />
                  </Stack>
                );
              case QuestionTypes.MultiAnswer:
                return (
                  <Stack spacing={1}>
                    {elementHeaderArea(
                      index,
                      pageNr,
                      QuestionTypes.MultiAnswer,
                    )}
                    <MultiAnswerSettingsView
                      questionObject={element as MultiAnswer}
                      onChange={(newQuestion: MultiAnswer) =>
                        onChangeQuestion(index, pageNr, newQuestion)
                      }
                    />
                  </Stack>
                );
              case QuestionTypes.LikertScale:
                return (
                  <Stack spacing={1}>
                    {elementHeaderArea(
                      index,
                      pageNr,
                      QuestionTypes.LikertScale,
                    )}
                    <LikertScaleSettingsView
                      questionObject={element as LikertScale}
                      onChange={(newQuestion: LikertScale) =>
                        onChangeQuestion(index, pageNr, newQuestion)
                      }
                    />
                  </Stack>
                );
              case QuestionTypes.LikertBlock:
                return (
                  <Stack spacing={1}>
                    {elementHeaderArea(
                      index,
                      pageNr,
                      QuestionTypes.LikertBlock,
                    )}
                    <LikertBlockSettingsView
                      questionObject={element as LikertBlock}
                      onChange={(newQuestion: LikertBlock) =>
                        onChangeQuestion(index, pageNr, newQuestion)
                      }
                    />
                  </Stack>
                );
              case QuestionTypes.TableInput:
                return (
                  <Stack spacing={1}>
                    {elementHeaderArea(index, pageNr, QuestionTypes.TableInput)}
                    <TableInputSettingsView
                      questionObject={element as TableInput}
                      onChange={(newQuestion: TableInput) =>
                        onChangeQuestion(index, pageNr, newQuestion)
                      }
                    />
                  </Stack>
                );
              case OtherElementType.Text:
                return (
                  <Stack spacing={1}>
                    {elementHeaderArea(index, pageNr, OtherElementType.Text)}
                    <TextElementSettingsView
                      textElement={element as TextElement}
                      onChange={(newQuestion: TextElement) =>
                        onChangeQuestion(index, pageNr, newQuestion)
                      }
                    />
                  </Stack>
                );
              default:
                return null;
            }
          });
          return (
            <Accordion key={pageNr}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {pageHeaderArea(pageNr)}
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  {sectionContent.map((questionSettingElement, index) => (
                    <Stack key={index}>
                      {questionSettingElement}
                      {index < sectionContent.length - 1 && (
                        <Divider sx={{ marginTop: '20px' }} />
                      )}
                    </Stack>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button
                      variant="contained"
                      onClick={() =>
                        onChange(
                          handleAddNewItem(
                            QuestionTypes.MultipleChoice,
                            pageNr,
                          ),
                        )
                      }
                    >
                      {t('ADD_MC_QUESTION')}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() =>
                        onChange(
                          handleAddNewItem(QuestionTypes.ShortAnswer, pageNr),
                        )
                      }
                    >
                      {t('ADD_SA_QUESTION')}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() =>
                        onChange(
                          handleAddNewItem(QuestionTypes.LongAnswer, pageNr),
                        )
                      }
                    >
                      {t('ADD_LA_QUESTION')}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() =>
                        onChange(
                          handleAddNewItem(QuestionTypes.MultiAnswer, pageNr),
                        )
                      }
                    >
                      {t('ADD_MA_QUESTION')}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() =>
                        onChange(
                          handleAddNewItem(QuestionTypes.LikertScale, pageNr),
                        )
                      }
                    >
                      {t('ADD_LS_QUESTION')}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() =>
                        onChange(
                          handleAddNewItem(QuestionTypes.LikertBlock, pageNr),
                        )
                      }
                    >
                      {t('ADD_LB_QUESTION')}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() =>
                        onChange(
                          handleAddNewItem(QuestionTypes.TableInput, pageNr),
                        )
                      }
                    >
                      Add Table Input
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() =>
                        onChange(
                          handleAddNewItem(OtherElementType.Text, pageNr),
                        )
                      }
                    >
                      {t('ADD_TEXT_ELEMENT')}
                    </Button>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })
      : [];

  return (
    <Stack spacing={2}>
      {getSectionsDisplay()}
      <Button variant="contained" onClick={() => onChange(handleAddNewPage())}>
        {t('ADD_PAGE')}
      </Button>
    </Stack>
  );
};

export default SectionSettingsView;
