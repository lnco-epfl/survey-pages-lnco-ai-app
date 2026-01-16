export type AppSettings = {
  sectionSettings: SectionSettings;
  fullScreenSettings: FullScreenSettings;
  nextStepSettings: NextStepSettings;
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
};

export type Question =
  | ShortAnswer
  | LongAnswer
  | MultipleChoice
  | MultiAnswer
  | LikertScale
  | LikertBlock;

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
};

export type NextStepSettings = {
  linkToNextPage: boolean;
  title: string;
  description: string;
  link: string;
  linkText: string;
};
