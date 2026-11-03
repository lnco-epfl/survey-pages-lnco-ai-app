import FullscreenPlugin from '@jspsych/plugin-fullscreen';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import jsPsychSurvey from '@jspsych/plugin-survey';
import { DataCollection, JsPsych, initJsPsych } from 'jspsych';
// eslint-disable-next-line import/no-unassigned-import, import/no-extraneous-dependencies
import 'survey-core/i18n/french';

import i18n from '@/config/i18n';
import { ExperimentResult } from '@/modules/config/AppResults';
import {
  AppSettings,
  ExclusionCriterion,
  ExclusionOperator,
  LikertBlock,
  OtherElementType,
  QuestionTypes,
} from '@/modules/config/AppSettings';
import { ScreenCalibration } from '@/utils/screenCalibration';

import '../styles/main.scss';

export type Timeline = JsPsych['timeline'];

export type SurveyModel = unknown;

export type Trial = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type?: unknown;
} & Record<string, unknown>;

export type Pages = Record<string, unknown>;

const FINAL_CONFIRMATION_NAME = '__final_eligibility_confirmation__';
const REPEATED_LIKERT_HEADER_CLASS = 'likert-block__repeated-header';
const REPEATED_LIKERT_HEADER_DATA_ATTRIBUTE = 'data-likert-repeat-header';
const REPEATED_LIKERT_HEADER_INTERVAL = 5;

const repeatLikertBlockHeaders = (): void => {
  const tables = document.querySelectorAll('.sd-matrix__table');

  tables.forEach((table) => {
    const tableElement = table as HTMLTableElement;
    const headerRow = tableElement.tHead?.rows[0];

    tableElement
      .querySelectorAll(
        `tbody tr[${REPEATED_LIKERT_HEADER_DATA_ATTRIBUTE}='true']`,
      )
      .forEach((row) => row.remove());

    const bodyRows = Array.from(tableElement.tBodies[0]?.rows ?? []);

    if (!headerRow || bodyRows.length <= REPEATED_LIKERT_HEADER_INTERVAL) {
      return;
    }

    bodyRows.forEach((row, index) => {
      const shouldRepeatHeader =
        (index + 1) % REPEATED_LIKERT_HEADER_INTERVAL === 0 &&
        index + 1 < bodyRows.length;

      if (!shouldRepeatHeader) {
        return;
      }

      const repeatedHeaderRow = headerRow.cloneNode(
        true,
      ) as HTMLTableRowElement;
      repeatedHeaderRow.classList.add(REPEATED_LIKERT_HEADER_CLASS);
      repeatedHeaderRow.setAttribute(
        REPEATED_LIKERT_HEADER_DATA_ATTRIBUTE,
        'true',
      );
      repeatedHeaderRow.setAttribute('aria-hidden', 'true');
      row.parentElement?.insertBefore(repeatedHeaderRow, row.nextSibling);
    });
  });
};

const LIKERT_FITTING_CLASS = 'likert-block--fitting';
const LIKERT_DEFAULT_ROW_TEXT_WIDTH = 50;
const LIKERT_MIN_ROW_TEXT_WIDTH = 20;
const LIKERT_ROW_TEXT_WIDTH_STEP = 5;
const LIKERT_MIN_HEADER_SCALE = 0.6;
const LIKERT_HEADER_SCALE_STEP = 0.05;
const LIKERT_MIN_COLUMN_CHARACTERS = 12;

// Width in px of `characters` average characters, measured in the cell's own font
const measureCharacterWidth = (
  cell: HTMLTableCellElement,
  characters: number,
): number => {
  const probe = document.createElement('span');
  probe.style.cssText = `display:inline-block;width:${characters}ch;visibility:hidden;`;
  (cell.querySelector('span') ?? cell).appendChild(probe);
  const width = probe.offsetWidth;
  probe.remove();
  return width;
};

const getContentWidth = (cell: HTMLTableCellElement): number => {
  const style = window.getComputedStyle(cell);
  return (
    cell.clientWidth -
    parseFloat(style.paddingLeft) -
    parseFloat(style.paddingRight)
  );
};

/**
 * Prevents Likert column titles from overlapping. A single word wider than its
 * column cannot wrap, so first the question column is narrowed until every
 * answer column fits its longest word and at least 12 characters, then the
 * title font is shrunk. Values set manually in the builder (data attributes on
 * the table) are kept as-is.
 */
const fitLikertBlockColumns = (): void => {
  const tables =
    document.querySelectorAll<HTMLTableElement>('.sd-matrix__table');

  tables.forEach((table) => {
    const headerCells = Array.from(table.tHead?.rows[0]?.cells ?? []).slice(1);
    if (headerCells.length === 0) {
      return;
    }

    const manualWidth = table.dataset.likertRowTextWidth
      ? Number(table.dataset.likertRowTextWidth)
      : undefined;
    const manualScale = table.dataset.likertHeaderScale
      ? Number(table.dataset.likertHeaderScale)
      : undefined;

    let width = manualWidth ?? LIKERT_DEFAULT_ROW_TEXT_WIDTH;
    let scale = manualScale ?? 1;
    const apply = (): void => {
      table.style.setProperty('--likert-row-text-width', `${width}%`);
      table.style.setProperty('--likert-header-scale', `${scale}`);
    };
    const overflows = (): boolean =>
      headerCells.some((cell) => cell.scrollWidth > cell.clientWidth + 1);

    // Disable the mid-word break fallback while measuring
    table.classList.add(LIKERT_FITTING_CLASS);
    apply();

    const minColumnWidth = measureCharacterWidth(
      headerCells[0],
      LIKERT_MIN_COLUMN_CHARACTERS,
    );
    const tooNarrow = (): boolean =>
      overflows() ||
      headerCells.some((cell) => getContentWidth(cell) < minColumnWidth);

    while (
      manualWidth === undefined &&
      width > LIKERT_MIN_ROW_TEXT_WIDTH &&
      tooNarrow()
    ) {
      width -= LIKERT_ROW_TEXT_WIDTH_STEP;
      apply();
    }

    while (
      manualScale === undefined &&
      scale > LIKERT_MIN_HEADER_SCALE &&
      overflows()
    ) {
      scale = Math.max(
        LIKERT_MIN_HEADER_SCALE,
        scale - LIKERT_HEADER_SCALE_STEP,
      );
      apply();
    }

    table.classList.remove(LIKERT_FITTING_CLASS);
  });
};

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

const buildLikertBlockQuestions = (
  element: LikertBlock,
  previousResponses: Record<string, unknown>,
): Timeline => {
  const previousLikertResponse = previousResponses[element.name] as
    | Record<string, string>
    | undefined;

  return [
    {
      type: 'matrix',
      title: element.description || '\u00A0',
      columns: element.scale,
      rows: element.questions.map((question) => ({
        value: question,
        text: question,
      })),
      isRequired: element.mandatory,
      isAllRowRequired: element.requireAll ?? false,
      name: element.name,
      defaultValue: previousLikertResponse,
    },
  ];
};

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
            placeholder: i18n.t('SETTINGS.PLAYER.PLACEHOLDER'),
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
          pageQuestions.push(
            ...buildLikertBlockQuestions(element, previousResponses),
          );
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
            panelAddText: `+ ${i18n.t('SETTINGS.PLAYER.BUTTON_ADD_ROW')}`,
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

  const likertBlocks = new Map<string, LikertBlock>();
  settings.sectionSettings.sections.flat().forEach((element) => {
    if (element.type === QuestionTypes.LikertBlock) {
      likertBlocks.set(element.name, element);
    }
  });

  const totalPages = pages.length;
  const finalConfirmationPage = getFinalConfirmationPage(settings);
  const surveyPages =
    finalConfirmationPage !== null
      ? [...pageJson, finalConfirmationPage]
      : pageJson;

  timeline.push({
    type: jsPsychSurvey,
    survey_function: (survey: {
      onAfterRenderPage: { add: (arg0: () => void) => void };
      onAfterRenderQuestion: {
        add: (
          arg0: (
            sender: unknown,
            options: { question: { name: string }; htmlElement: HTMLElement },
          ) => void,
        ) => void;
      };
      onCurrentPageChanged: { add: (arg0: () => void) => void };
      onCurrentPageChanging: { add: (arg0: () => void) => void };
      currentPageNo: number;
    }) => {
      survey.onAfterRenderQuestion.add((_, { question, htmlElement }) => {
        const likertBlock = likertBlocks.get(question.name);
        const table =
          htmlElement.querySelector<HTMLTableElement>('.sd-matrix__table');
        if (!likertBlock || !table) {
          return;
        }
        if (likertBlock.rowTextWidth !== undefined) {
          table.dataset.likertRowTextWidth = `${likertBlock.rowTextWidth}`;
        }
        if (likertBlock.headerFontScale !== undefined) {
          table.dataset.likertHeaderScale = `${likertBlock.headerFontScale}`;
        }
      });
      survey.onAfterRenderPage.add(() => {
        window.setTimeout(() => {
          repeatLikertBlockHeaders();
          fitLikertBlockColumns();
        }, 0);
      });
      survey.onCurrentPageChanging.add(() => {
        window.setTimeout(() => {
          const container = document.getElementById('jspsych-display-element');
          const firstError = container?.querySelector('.sd-question--error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50);
      });
      survey.onCurrentPageChanged.add(() => {
        // window.scrollTo(0, 0);
        // Update progress bar: currentPageNo is 0-indexed, so add 1
        const progress = survey.currentPageNo / totalPages;
        if (jsPsych.progressBar) {
          // eslint-disable-next-line no-param-reassign
          jsPsych.progressBar.progress = progress;
        }
        updateData(jsPsych.data.get(), settings);
        window.setTimeout(() => {
          repeatLikertBlockHeaders();
          fitLikertBlockColumns();
        }, 0);
      });
    },
    survey_json: {
      pages: surveyPages,
      showQuestionNumbers: false,
      locale: settings.fullScreenSettings.language === 'fr' ? 'fr' : 'en',
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
  button_label: i18n.t('SETTINGS.PLAYER.BUTTON_START'),
  message: `<div style="text-align: center; font-size: 24px;">${i18n.t('SETTINGS.PLAYER.BEGIN_EXPERIMENT')}</div>`,
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
  input: {
    settings: AppSettings;
    results?: ExperimentResult;
    screenCalibration?: ScreenCalibration;
  };
  updateData: (data: DataCollection, settings: AppSettings) => void;
}): Promise<JsPsych> {
  const playerLanguage =
    input.settings.fullScreenSettings.language === 'fr' ? 'fr' : 'en';

  await i18n.changeLanguage(playerLanguage);

  // Determine applied font size: calibration takes precedence, then builder setting, then default
  const appliedFontSize =
    input.screenCalibration?.fontSize ??
    input.settings.fullScreenSettings.fontSize ??
    'normal';

  const addFontSizeMenu = (): void => {
    const progressBar = document.getElementById(
      'jspsych-progressbar-container',
    );
    if (!progressBar || progressBar.querySelector('.custom-dropdown')) {
      return;
    }

    const dropdown = document.createElement('select');
    dropdown.className = 'custom-dropdown';
    const currentFontSize =
      document
        .getElementById('jspsych-display-element')
        ?.getAttribute('data-font-size') ?? appliedFontSize;
    dropdown.innerHTML = `
      <option value="small" ${currentFontSize === 'small' ? 'selected' : ''}>${i18n.t('SETTINGS.FULL_SCREEN.FONT_SIZE_SMALL')}</option>
      <option value="normal" ${currentFontSize === 'normal' ? 'selected' : ''}>${i18n.t('SETTINGS.FULL_SCREEN.FONT_SIZE_NORMAL')}</option>
      <option value="large" ${currentFontSize === 'large' ? 'selected' : ''}>${i18n.t('SETTINGS.FULL_SCREEN.FONT_SIZE_LARGE')}</option>
      <option value="extra-large" ${currentFontSize === 'extra-large' ? 'selected' : ''}>${i18n.t('SETTINGS.FULL_SCREEN.FONT_SIZE_EXTRA_LARGE')}</option>
    `;

    const fontSizeTitle = document.createElement('span');
    fontSizeTitle.className = 'jspsych-progress-label';
    fontSizeTitle.textContent = i18n.t('SETTINGS.PLAYER.FONT_SIZE_LABEL');

    progressBar.appendChild(fontSizeTitle);
    progressBar.appendChild(dropdown);

    dropdown.addEventListener('change', (event) => {
      const { target } = event;
      const jspsychDisplayElement = document.getElementById(
        'jspsych-display-element',
      );
      if (jspsychDisplayElement && target instanceof HTMLSelectElement) {
        jspsychDisplayElement.setAttribute('data-font-size', target.value);
        fitLikertBlockColumns();
      }
    });
  };

  const addFullscreenButton = (): void => {
    if (!input.settings.fullScreenSettings.fullScreen) {
      return;
    }

    const progressBarContainer = document.getElementById(
      'jspsych-progressbar-container',
    );

    if (
      !progressBarContainer ||
      progressBarContainer.querySelector('.jspsych-btn-progress-bar')
    ) {
      return;
    }

    const fullscreenButton = document.createElement('button');
    fullscreenButton.type = 'button';
    fullscreenButton.textContent = i18n.t('SETTINGS.PLAYER.BUTTON_FULLSCREEN');
    fullscreenButton.className = 'jspsych-btn-progress-bar';

    fullscreenButton.addEventListener('click', () => {
      const docEl = document.documentElement as HTMLElement & {
        mozRequestFullScreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => undefined);
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen().catch(() => undefined);
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen().catch(() => undefined);
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen().catch(() => undefined);
      }
    });

    progressBarContainer.appendChild(fullscreenButton);
  };

  const addProgressBarControls = (): void => {
    addFontSizeMenu();
    addFullscreenButton();
  };

  // Initialize jspsych
  const jsPsych: JsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
    display_element: 'jspsych-display-element',
    message_progress_bar: i18n.t('SETTINGS.PLAYER.PROGRESS_BAR_MESSAGE'),
    on_trial_start: (): void => {
      addProgressBarControls();
    },
    on_finish: (): void => {
      updateData(jsPsych.data.get(), input.settings);
    },
  });

  // Stamp participant identity onto every trial so it appears in exported data
  const participantId = input.screenCalibration?.participantId;
  const participantCode = input.screenCalibration?.participantCode;
  if (participantId !== undefined || participantCode !== undefined) {
    jsPsych.data.addProperties({
      ...(participantId !== undefined && { participantId }),
      ...(participantCode !== undefined && { participantCode }),
    });
  }

  // Apply font size from calibration or builder setting
  const displayElement = document.getElementById('jspsych-display-element');
  if (displayElement) {
    displayElement.setAttribute('data-font-size', appliedFontSize);
    displayElement.setAttribute(
      'data-content-width',
      input.settings.fullScreenSettings.contentWidth ?? 'default',
    );
  }

  window.addEventListener('resize', () =>
    window.requestAnimationFrame(fitLikertBlockColumns),
  );

  addProgressBarControls();

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
