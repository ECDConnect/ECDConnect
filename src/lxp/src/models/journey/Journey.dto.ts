export type AssessmentFormDto = {
  description?: string;
  formPages?: AssessmentPageDto[];
  formPagesIds?: string;
  id?: string;
  isPublished?: string;
  logoUrl?: string;
  name?: string;
  provider?: string;
  roleIds?: string;
};

export type AssessmentPageDto = {
  description: string;
  formQuestions?: AssessmentQuestionDto[];
  formQuestionsIds?: string;
  id: string;
  name: string;
  stepNr: string;
};

export type AssessmentQuestionDto = {
  answerType: 'radioButton' | 'checkBox' | 'text';
  description: string;
  formQuestionOptions?: AssessmentOptionDto[];
  id: string;
  name: string;
  answer?: string;
  answerId?: string;
};

export type AssessmentOptionDto = {
  id: string;
  name: string;
};

export type AssessmentReportDto = {
  name?: string;
  greenQuestions?: string[];
  blueQuestions?: string[];
  amberQuestions?: string[];
  dailyActivities?: string[];
  skippedActivities?: string[];
  generatedAt?: string;
  textQuestion?: string;
  textAnswer?: string;
  visitId?: string;
};
