import FullscreenPlugin from '@jspsych/plugin-fullscreen';
// eslint-disable-next-line import/no-extraneous-dependencies
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
// eslint-disable-next-line import/no-extraneous-dependencies
import jsPsychSurvey from '@jspsych/plugin-survey';
// eslint-disable-next-line import/no-extraneous-dependencies
// import '@jspsych/plugin-survey/css/survey.css';
import { DataCollection, JsPsych, initJsPsych } from 'jspsych';

import i18n from '@/config/i18n';
import { ExperimentResult } from '@/modules/config/AppResults';
import {
  AppSettings,
  ExclusionCriterion,
  ExclusionOperator,
  OtherElementType,
  QuestionTypes,
} from '@/modules/config/AppSettings';

import '../styles/main.scss';

export type Timeline = JsPsych['timeline'];

export type SurveyModel = unknown;

export type Trial = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type?: unknown;
} & Record<string, unknown>;

export type Pages = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & Record<string, unknown>;

const FINAL_CONFIRMATION_NAME = '__final_eligibility_confirmation__';

const getLatestResponse = (
  trials: Array<Record<string, unknown>>,
): Record<string, unknown> => {
  const latestResponseTrial = [...trials]
    .reverse()
    .find(
      (trial) =>
        typeof trial.response === 'object' &&
        trial.response !== null &&
        !Array.isArray(trial.response),
    );

  return (latestResponseTrial?.response as Record<string, unknown>) || {};
};

const normalizeForComparison = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return `${value}`;
  }
  return JSON.stringify(value);
};

const criterionMatches = (
  response: Record<string, unknown>,
  criterion: ExclusionCriterion,
): boolean => {
  const answer = response[criterion.questionName];
  const answerString = normalizeForComparison(answer).toLowerCase();
  const expectedString = criterion.value.toLowerCase();

  switch (criterion.operator) {
    case ExclusionOperator.Equals:
      return answerString === expectedString;
    case ExclusionOperator.NotEquals:
      return answerString !== expectedString;
    case ExclusionOperator.Includes:
      return answerString.includes(expectedString);
    default:
      return false;
  }
};

const isExcludedByCriteria = (
  settings: AppSettings,
  response: Record<string, unknown>,
): boolean => {
  const { exclusionSettings } = settings;
  if (!exclusionSettings.enabled || exclusionSettings.criteria.length === 0) {
    return false;
  }

  const matches = exclusionSettings.criteria.map((criterion) =>
    criterionMatches(response, criterion),
  );

  if (exclusionSettings.matchMode === 'all') {
    return matches.every(Boolean);
  }
  return matches.some(Boolean);
};

const getQuestionLabelByName = (
  settings: AppSettings,
): Record<string, string> => {
  const labels: Record<string, string> = {};

  settings.sectionSettings.sections.flat().forEach((element) => {
    if (element.type === OtherElementType.Text) {
      return;
    }

    if (element.type === QuestionTypes.LikertBlock) {
      labels[element.name] = element.description || element.name;
      return;
    }

    labels[element.name] = element.question || element.name;
  });

  return labels;
};

const getPlayerLanguage = (settings: AppSettings): 'en' | 'fr' =>
  settings.fullScreenSettings.language ?? 'en';

const getFinalConfirmationPage = (settings: AppSettings): Pages | null => {
  const { exclusionSettings } = settings;
  if (
    !exclusionSettings.enabled ||
    !exclusionSettings.requireFinalConfirmation ||
    exclusionSettings.criteria.length === 0
  ) {
    return null;
  }

  const questionLabelByName = getQuestionLabelByName(settings);

  const uniqueQuestionNames = exclusionSettings.criteria.reduce<string[]>(
    (acc, criterion) => {
      if (!acc.includes(criterion.questionName)) {
        acc.push(criterion.questionName);
      }
      return acc;
    },
    [],
  );

  const reviewItems = uniqueQuestionNames
    .map((questionName) => {
      const questionLabel = questionLabelByName[questionName] || questionName;
      return `<li><strong>${questionLabel}</strong>: {${questionName}}</li>`;
    })
    .join('');

  return {
    name: 'final-check-page',
    elements: [
      {
        type: 'html',
        html: `<div><h2>${exclusionSettings.confirmationTitle}</h2><p>${exclusionSettings.confirmationDescription}</p><ul>${reviewItems}</ul></div>`,
      },
      {
        type: 'checkbox',
        name: FINAL_CONFIRMATION_NAME,
        title: '',
        titleLocation: 'hidden',
        choices: [exclusionSettings.confirmationCheckboxLabel],
        isRequired: true,
      },
    ],
  };
};

const buildTimelineFromSurvey = (
  jsPsych: JsPsych,
  settings: AppSettings,
  result: ExperimentResult | undefined,
  updateData: (data: DataCollection, settings: AppSettings) => void,
): Timeline => {
  const timeline: Timeline = [];
  const pages: Pages[] = [];

  // Extract previous responses if they exist
  const previousResponses: Record<string, unknown> = {};

  if (result?.rawData?.trials && result.rawData.trials.length > 0) {
    Object.assign(previousResponses, getLatestResponse(result.rawData.trials));
  }

  settings.sectionSettings.sections.forEach((section) => {
    // Initialize an array to hold all questions for this page
    const pageQuestions: Timeline = [];

    section.forEach((element) => {
      switch (element.type) {
        case QuestionTypes.ShortAnswer:
          pageQuestions.push({
            type: 'text',
            title: element.question,
            rows: 1,
            isRequired: element.mandatory,
            inputType: element.answerType,
            placeholder: 'Your Answer',
            name: element.name,
            defaultValue:
              (previousResponses[element.name] as string) || undefined,
          });
          break;

        case QuestionTypes.LongAnswer:
          pageQuestions.push({
            type: 'comment',
            title: element.question,
            isRequired: element.mandatory,
            name: element.name,
            defaultValue:
              (previousResponses[element.name] as string) || undefined,
          });
          break;

        case QuestionTypes.MultipleChoice:
          pageQuestions.push({
            type: 'radiogroup',
            title: element.question,
            choices: element.answers,
            showClearButton: false,
            separateSpecialChoices: false,
            hasOther: element.hasOtherOption ?? false,
            otherText: element.otherOptionText || 'Other (please specify)',
            name: element.name,
            defaultValue:
              (previousResponses[element.name] as string) || undefined,
          });
          break;

        case QuestionTypes.MultiAnswer:
          pageQuestions.push({
            type: 'checkbox',
            title: element.question,
            choices: element.answers,
            isRequired: element.mandatory,
            randomize_question_order: true,
            allow_multiple: true,
            hasOther: element.hasOtherOption ?? false,
            otherText: element.otherOptionText || 'Other (please specify)',
            name: element.name,
            defaultValue:
              (previousResponses[element.name] as string[]) || undefined,
          });
          break;

        case QuestionTypes.LikertScale:
          pageQuestions.push({
            type: 'radiogroup',
            title: element.question,
            choices: element.scale,
            isRequired: element.mandatory,
            showClearButton: false,
            separateSpecialChoices: false,
            name: element.name,
            defaultValue:
              (previousResponses[element.name] as string) || undefined,
          });
          break;
        case QuestionTypes.LikertBlock:
          pageQuestions.push({
            type: 'matrix',
            title: element.description,
            columns: element.scale,
            rows: element.questions.map((q) => ({
              value: q,
              text: q,
            })),
            isRequired: element.mandatory,
            isAllRowRequired: element.requireAll ?? false,
            name: element.name,
            defaultValue:
              (previousResponses[element.name] as Record<string, string>) ||
              undefined,
          });
          break;

        case QuestionTypes.TableInput:
          pageQuestions.push({
            type: 'paneldynamic',
            name: element.name,
            title: element.question,
            description: element.description,
            isRequired: element.mandatory,
            templateElements: element.columns.map((col) => ({
              type: 'text',
              name: col.name,
              title: col.label,
              isRequired: col.required,
              inputType: col.inputType,
            })),
            panelCount: element.minRows,
            minPanelCount: element.minRows,
            maxPanelCount: element.maxRows,
            panelAddText: '+ Add Row',
            panelRemoveText: '×',
            confirmDelete: false,
            panelRemoveButtonLocation: 'right',
            showQuestionNumbers: 'off',
            showRangeInProgress: false,
            renderMode: 'list',
            templateTitle: '',
            defaultValue:
              (previousResponses[element.name] as Array<
                Record<string, unknown>
              >) || undefined,
          });
          break;

        case OtherElementType.Text:
          pageQuestions.push({
            type: 'html',
            html: `<div><h2>${element.title}</h2><p>${element.description}</p></div>`,
          });
          break;

        default:
          console.warn('Unknown question type: ', element);
          break;
      }
    });
    pages.push(pageQuestions);
  });
  const pageJson = pages.map((questions, index) => ({
    name: `page${index + 1}`,
    elements: questions,
  }));

  const totalPages = pages.length;
  const finalConfirmationPage = getFinalConfirmationPage(settings);
  const surveyPages =
    finalConfirmationPage !== null
      ? [...pageJson, finalConfirmationPage]
      : pageJson;

  timeline.push({
    type: jsPsychSurvey,
    survey_function: (survey: {
      onCurrentPageChanged: { add: (arg0: () => void) => void };
      currentPageNo: number;
    }) => {
      survey.onCurrentPageChanged.add(() => {
        // window.scrollTo(0, 0);
        // Update progress bar: currentPageNo is 0-indexed, so add 1
        const progress = survey.currentPageNo / totalPages;
        if (jsPsych.progressBar) {
          // eslint-disable-next-line no-param-reassign
          jsPsych.progressBar.progress = progress;
        }
        updateData(jsPsych.data.get(), settings);
      });
    },
    survey_json: {
      pages: surveyPages,
      showQuestionNumbers: false,
      completeText: i18n.t('SETTINGS.PLAYER.BUTTON_SUBMIT'),
      pageNextText: i18n.t('SETTINGS.PLAYER.BUTTON_CONTINUE'),
      pagePrevText: i18n.t('SETTINGS.PLAYER.BUTTON_PREVIOUS'),
      css: {
        isPanelless: true,
      },
    },
  });
  return timeline;
};

/**
 *
 * @returns Returns a simple welcome screen that automatically triggers fullscreen when the start button is pressed
 */
const getFullScreenTrial = (): Trial => ({
  type: FullscreenPlugin,
  choices: [i18n.t('SETTINGS.PLAYER.BUTTON_START')],
  message: `<div style="text-align: center; font-size: 24px;">${i18n.t(
    'SETTINGS.PLAYER.BEGIN_EXPERIMENT',
  )}</div>`,
  fullscreen_mode: true,
});

/**
 *
 * @returns Returns a simple welcome screen that automatically triggers fullscreen when the start button is pressed
 */
const getCompletionPage = (
  jspsych: JsPsych,
  updateData: (data: DataCollection, settings: AppSettings) => void,
  settings: AppSettings,
): Trial => ({
  type: htmlKeyboardResponse,
  choices: 'NO_KEYS',
  stimulus: (): string => {
    const response = getLatestResponse(jspsych.data.get().values());
    const isExcluded = isExcludedByCriteria(settings, response);

    if (isExcluded) {
      return `<div class='sd-html'><h5>${settings.exclusionSettings.exclusionTitle}</h5><p>${settings.exclusionSettings.exclusionDescription}</p></div>`;
    }

    if (settings.nextStepSettings.linkToNextPage) {
      return `<div class='sd-html'><h5>${settings.nextStepSettings.title}</h5><p>${settings.nextStepSettings.description}</p><a class='link-to-experiment' target="_parent" href=${settings.nextStepSettings.link}>${settings.nextStepSettings.linkText}</a></div>`;
    }

    return `<div class='sd-html'><h5>${i18n.t('SETTINGS.PLAYER.THANK_YOU_TITLE')}</h5><p>${i18n.t('SETTINGS.PLAYER.THANK_YOU_DESCRIPTION')}</p></div>`;
  },
  on_start: (): void => {
    if (jspsych.progressBar) {
      // eslint-disable-next-line no-param-reassign
      jspsych.progressBar.progress = 1;
    }
    updateData(jspsych.data.get(), settings);
  },
});

export async function run({
  input,
  updateData,
}: {
  input: { settings: AppSettings; results?: ExperimentResult };
  updateData: (data: DataCollection, settings: AppSettings) => void;
}): Promise<JsPsych> {
  await i18n.changeLanguage(getPlayerLanguage(input.settings));

  // Initialize jspsych
  const jsPsych: JsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
    display_element: 'jspsych-display-element',
    on_finish: (): void => {
      updateData(jsPsych.data.get(), input.settings);
    },
  });

  const jsPsychTimeline: Timeline = [];

  if (input.settings.fullScreenSettings.fullScreen) {
    jsPsychTimeline.push(getFullScreenTrial());
  }

  jsPsychTimeline.push(
    ...buildTimelineFromSurvey(
      jsPsych,
      input.settings,
      input.results,
      (data: DataCollection, settings: AppSettings) => {
        updateData(data, settings);
      },
    ),
  );

  jsPsychTimeline.push(getCompletionPage(jsPsych, updateData, input.settings));

  await jsPsych.run(jsPsychTimeline);

  return jsPsych;
}
