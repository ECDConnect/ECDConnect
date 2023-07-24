import {
  Rating,
  TableProps,
} from '@/pages/coach/coach-practitioner-journey/forms/pqa-visits/first-pqa/step-17/table';
import { Divider, LoadingSpinner, Note, Typography } from '@ecdlink/ui';
import { practitionerVisitIdKey } from '../..';
import { useSelector } from 'react-redux';
import { getVisitDataByVisitIdSelector } from '@/store/pqa/pqa.selectors';
import { DynamicFormProps } from '../../dynamic-form';
import {
  pqaSummaryQuestionStep17,
  pqaVisitSectionStep17,
  step2TotalScore,
  step2VisitSection,
  step3GetScore,
  step3TotalScore,
  step3VisitSection,
  step4TotalScore,
  step4VisitSection,
  step5TotalScore,
  step5VisitSection,
  step6TotalScore,
  step6VisitSection,
  step7TotalScore,
  step7VisitSection,
  step8TotalScore,
  step8VisitSection,
} from '@/pages/coach/coach-practitioner-journey/forms/pqa-visits/first-pqa';
import { Question } from '@/pages/coach/coach-practitioner-journey/forms/dynamic-form';
import { useEffect, useMemo } from 'react';
import { dateLongMonthOptions } from '../../../timeline/utils';
import { getSectionQuestions } from '../../../utils';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { PqaActions } from '@/store/pqa/pqa.actions';

export const PqaSummaryStep1 = ({
  setEnableButton,
  smartStarter,
}: DynamicFormProps) => {
  const visitId = window.sessionStorage.getItem(practitionerVisitIdKey) || '';

  const { isLoading } = useThunkFetchCall(
    'pqa',
    PqaActions.GET_VISIT_DATA_FOR_VISIT_ID
  );
  const data = useSelector(
    getVisitDataByVisitIdSelector(visitId, 'pqaPreviousFormData')
  );
  const date = data?.[0]?.insertedDate;

  const sectionQuestions = getSectionQuestions(data);

  const summaryNote = sectionQuestions
    ?.find((item) => item.visitSection === pqaVisitSectionStep17)
    ?.questions?.find((item) => item.question === pqaSummaryQuestionStep17);

  const step3 = sectionQuestions?.find(
    (item) => item.visitSection === step3VisitSection
  )?.questions[0];
  const step3answers = String(step3?.answer)?.split(',') as string[];
  const step3Score = step3GetScore(step3answers);

  const section1 = sectionQuestions?.find(
    (item) => item.visitSection === step2VisitSection
  )?.questions;
  const section2 = useMemo(
    () => [
      {
        question: step3?.question,
        answer: `${step3Score.score} - `,
      } as Question,
      ...(sectionQuestions?.find(
        (item) => item.visitSection === step4VisitSection
      )?.questions ?? []),
    ],
    [sectionQuestions, step3?.question, step3Score.score]
  );
  const section3 = sectionQuestions?.find(
    (item) => item.visitSection === step5VisitSection
  )?.questions;
  const section4 = sectionQuestions?.find(
    (item) => item.visitSection === step6VisitSection
  )?.questions;
  const section5 = sectionQuestions?.find(
    (item) => item.visitSection === step7VisitSection
  )?.questions;
  const section6 = sectionQuestions?.find(
    (item) => item.visitSection === step8VisitSection
  )?.questions;

  const sections: TableProps['sections'] = useMemo(
    () => ({
      section1: {
        questions: section1,
        total: step2TotalScore,
      },
      section2: {
        questions: section2,
        total: step3TotalScore + step4TotalScore,
      },
      section3: {
        questions: section3,
        total: step5TotalScore,
      },
      section4: {
        questions: section4,
        total: step6TotalScore,
      },
      section5: {
        questions: section5,
        total: step7TotalScore,
      },
      section6: {
        questions: section6,
        total: step8TotalScore,
      },
    }),
    [section1, section2, section3, section4, section5, section6]
  );

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  if (isLoading) {
    return (
      <LoadingSpinner
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
        className="tex pt-4"
      />
    );
  }

  return (
    <div className="p-4">
      <Typography type="h2" text="PQA rating" color="textDark" />
      <Typography
        type="h4"
        text={new Date(date).toLocaleString('en-ZA', dateLongMonthOptions)}
        color="textMid"
      />
      <Divider dividerType="dashed" className="my-4" />
      <Rating sections={sections} sectionQuestions={sectionQuestions} />
      <Note
        title="Summary of discussion"
        body={summaryNote?.answer ? String(summaryNote?.answer) : '---'}
      />
    </div>
  );
};
