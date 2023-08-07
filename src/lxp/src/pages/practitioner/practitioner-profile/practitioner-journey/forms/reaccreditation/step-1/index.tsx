import { Divider, LoadingSpinner, Note, Typography } from '@ecdlink/ui';
import { practitionerVisitIdKey } from '../..';
import { useSelector } from 'react-redux';
import { getVisitDataByVisitIdSelector } from '@/store/pqa/pqa.selectors';
import { DynamicFormProps, Question } from '../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { dateLongMonthOptions } from '../../../timeline/utils';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { PqaActions } from '@/store/pqa/pqa.actions';
import {
  reAccreditationQuestionStep16,
  reAccreditationVisitSectionStep16,
  step10ReAccreditation,
  step11ReAccreditation,
  step12ReAccreditation,
  step8ReAccreditation,
} from '@/pages/coach/coach-practitioner-journey/forms/reaccreditation';
import {
  Rating,
  TableProps,
} from '@/pages/coach/coach-practitioner-journey/forms/reaccreditation/step-16/table';
import { getSectionQuestions } from '../../../utils';

export const ReAccreditationSummaryStep1 = ({
  setEnableButton,
  smartStarter,
}: DynamicFormProps) => {
  const firstName =
    smartStarter?.user?.firstName ||
    smartStarter?.firstName ||
    'the smartStarter';

  const visitId = window.sessionStorage.getItem(practitionerVisitIdKey) || '';

  const { isLoading } = useThunkFetchCall(
    'pqa',
    PqaActions.GET_VISIT_DATA_FOR_VISIT_ID
  );

  const data = useSelector(
    getVisitDataByVisitIdSelector(visitId, 'reAccreditationPreviousFormData')
  );
  const date = data?.[0]?.insertedDate;

  const sectionQuestions = getSectionQuestions(data);

  const summaryNote = sectionQuestions
    ?.find((item) => item.visitSection === reAccreditationVisitSectionStep16)
    ?.questions?.find(
      (item) => item.question === reAccreditationQuestionStep16
    );

  const mapAnswers = (item: Question) => ({
    ...item,
    answer: String(item?.answer)?.split('.,'),
  });

  const section1 = sectionQuestions
    ?.find((item) => item.visitSection === step8ReAccreditation.visitSection)
    ?.questions.map(mapAnswers);

  const section2 = sectionQuestions?.find(
    (item) => item.visitSection === step10ReAccreditation.visitSection
  )?.questions;
  const section3 = sectionQuestions
    ?.find((item) => item.visitSection === step11ReAccreditation.visitSection)
    ?.questions.map(mapAnswers);
  const section4 = sectionQuestions
    ?.find((item) => item.visitSection === step12ReAccreditation.visitSection)
    ?.questions.map(mapAnswers);

  const sections: TableProps['sections'] = useMemo(
    () => ({
      section1: {
        questions: section1,
        total: step8ReAccreditation.totalScore,
      },
      section2: {
        questions: section2,
        total: step10ReAccreditation.totalScore,
      },
      section3: {
        questions: section3,
        total: step11ReAccreditation.totalScore,
      },
      section4: {
        questions: section4,
        total: step12ReAccreditation.totalScore,
      },
    }),
    [section1, section2, section3, section4]
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
      <Typography
        type="h2"
        text="Reaccreditation PQA rating"
        color="textDark"
      />
      <Typography
        type="h4"
        text={new Date(date).toLocaleString('en-ZA', dateLongMonthOptions)}
        color="textMid"
      />
      <Divider dividerType="dashed" className="my-4" />
      <Rating
        name={firstName}
        sections={sections}
        sectionQuestions={sectionQuestions}
      />
      <Note
        title="Summary of discussion"
        body={summaryNote?.answer ? String(summaryNote?.answer) : '---'}
      />
    </div>
  );
};
