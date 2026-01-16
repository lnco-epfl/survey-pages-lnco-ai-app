import FullscreenPlugin from '@jspsych/plugin-fullscreen';
// eslint-disable-next-line import/no-extraneous-dependencies
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
// eslint-disable-next-line import/no-extraneous-dependencies
import jsPsychSurvey from '@jspsych/plugin-survey';
// eslint-disable-next-line import/no-extraneous-dependencies
// import '@jspsych/plugin-survey/css/survey.css';
import { DataCollection, JsPsych, initJsPsych } from 'jspsych';

import { ExperimentResult } from '@/modules/config/AppResults';
import {
  AppSettings,
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
  type: string;
} & Record<string, unknown>;

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
    const lastTrial = result.rawData.trials[result.rawData.trials.length - 1];
    if (lastTrial.response) {
      Object.assign(previousResponses, lastTrial.response);
    }
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

  timeline.push({
    type: jsPsychSurvey,
    survey_function: (survey: {
      onCurrentPageChanged: { add: (arg0: () => void) => void };
    }) => {
      survey.onCurrentPageChanged.add(() => {
        updateData(jsPsych.data.get(), settings);
      });
    },
    survey_json: {
      pages: pageJson,
      showQuestionNumbers: false,
      completeText:
        settings.sectionSettings.pageButtonSettings.finishSurveyText,
      pageNextText: settings.sectionSettings.pageButtonSettings.nextPageText,
      pagePrevText:
        settings.sectionSettings.pageButtonSettings.previousPageText,
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
  choices: ['Start'],
  message:
    '<div style="text-align: center; font-size: 24px;">Begin the Experiment</div>',
  fullscreen_mode: true,
});

/**
 *
 * @returns Returns a simple welcome screen that automatically triggers fullscreen when the start button is pressed
 */
const getEndPage = (
  jspsych: JsPsych,
  title: string,
  description: string,
  link: string,
  linkText: string,
  updateData: (data: DataCollection, settings: AppSettings) => void,
  input: AppSettings,
): Trial => ({
  type: htmlKeyboardResponse,
  choices: 'NO_KEYS',
  stimulus: `<div class='sd-html'><h5>${title}</h5><p>${description}</p><a class='link-to-experiment' target="_parent" href=${link}>${linkText}</a></div>`,
  on_start: (): void => {
    updateData(jspsych.data.get(), input);
  },
});

export async function run({
  input,
  updateData,
}: {
  input: { settings: AppSettings; results?: ExperimentResult };
  updateData: (data: DataCollection, settings: AppSettings) => void;
}): Promise<JsPsych> {
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

  if (input.settings.nextStepSettings.linkToNextPage) {
    jsPsychTimeline.push(
      getEndPage(
        jsPsych,
        input.settings.nextStepSettings.title,
        input.settings.nextStepSettings.description,
        input.settings.nextStepSettings.link,
        input.settings.nextStepSettings.linkText,
        updateData,
        input.settings,
      ),
    );
  }

  await jsPsych.run(jsPsychTimeline);

  return jsPsych;
}
