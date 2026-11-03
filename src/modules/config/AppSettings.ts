export type AppSettings = {
  sectionSettings: SectionSettings;
  fullScreenSettings: FullScreenSettings;
  nextStepSettings: NextStepSettings;
  exclusionSettings: ExclusionSettings;
};

export type SectionSettings = {
  sections: Section[];
  pageButtonSettings: PageButtonSettings;
};

export type Section = SurveyElement[];

export enum QuestionTypes {
  ShortAnswer = 'shortAnswer',
  LongAnswer = 'longAnswer',
  MultipleChoice = 'multipleChoice',
  MultiAnswer = 'multiAnswer',
  LikertScale = 'likertScale',
  LikertBlock = 'likertBlock',
  TableInput = 'tableInput',
}

export enum OtherElementType {
  Text = 'text',
}

export type SurveyElementType = QuestionTypes | OtherElementType;

export type ShortAnswer = {
  type: QuestionTypes.ShortAnswer;
  question: string;
  name: string;
  description: string;
  mandatory: boolean;
  answerType: 'number' | 'text' | 'date';
};

export type LongAnswer = {
  type: QuestionTypes.LongAnswer;
  question: string;
  name: string;
  description: string;
  mandatory: boolean;
};

export type MultipleChoice = {
  type: QuestionTypes.MultipleChoice;
  question: string;
  name: string;
  description: string;
  mandatory: boolean;
  answers: string[];
  hasOtherOption?: boolean;
  otherOptionText?: string;
};

export type MultiAnswer = {
  type: QuestionTypes.MultiAnswer;
  question: string;
  name: string;
  description: string;
  mandatory: boolean;
  answers: string[];
  hasOtherOption?: boolean;
  otherOptionText?: string;
};

export type LikertScale = {
  type: QuestionTypes.LikertScale;
  question: string;
  name: string;
  description: string;
  mandatory: boolean;
  scale: string[];
};

export type LikertBlock = {
  type: QuestionTypes.LikertBlock;
  name: string;
  description: string;
  mandatory: boolean;
  requireAll?: boolean; // Require all questions to be answered
  questions: string[]; // rows
  scale: string[];
  rowTextWidth?: number; // % of table width for the question column; auto-fit when unset
  headerFontScale?: number; // multiplier for column title size; auto-fit when unset
};

export type TableColumn = {
  name: string;
  label: string;
  inputType: 'text' | 'number' | 'date';
  required: boolean;
};

export type TableInput = {
  type: QuestionTypes.TableInput;
  question: string;
  name: string;
  description: string;
  mandatory: boolean;
  columns: TableColumn[];
  minRows: number;
  maxRows: number;
};

export type Question =
  | ShortAnswer
  | LongAnswer
  | MultipleChoice
  | MultiAnswer
  | LikertScale
  | LikertBlock
  | TableInput;

export type TextElement = {
  type: OtherElementType.Text;
  name: string;
  title: string;
  description: string;
  continueButtonText: string;
};

export type SurveyElement = Question | TextElement;

export type PageButtonSettings = {
  nextPageText: string;
  previousPageText: string;
  finishSurveyText: string;
};

export type FullScreenSettings = {
  fullScreen: boolean;
  pagePerQuestion: boolean;
  language: 'en' | 'fr';
  fontSize?: 'small' | 'normal' | 'large' | 'extra-large';
  contentWidth?: 'default' | 'wide' | 'full';
};

export type NextStepSettings = {
  linkToNextPage: boolean;
  title: string;
  description: string;
  link: string;
  linkText: string;
};

export enum ExclusionOperator {
  Equals = 'equals',
  NotEquals = 'notEquals',
  Includes = 'includes',
}

export type ExclusionCriterion = {
  questionName: string;
  operator: ExclusionOperator;
  value: string;
};

export type ExclusionSettings = {
  enabled: boolean;
  requireFinalConfirmation: boolean;
  matchMode: 'any' | 'all';
  criteria: ExclusionCriterion[];
  confirmationTitle: string;
  confirmationDescription: string;
  confirmationCheckboxLabel: string;
  exclusionTitle: string;
  exclusionDescription: string;
};
