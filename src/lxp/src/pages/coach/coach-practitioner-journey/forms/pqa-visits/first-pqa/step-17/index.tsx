import { Alert, Divider, FormInput, Typography } from '@ecdlink/ui';
import { DynamicFormProps, Question } from '../../../dynamic-form';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Rating, TableProps } from './table';
import { step2TotalScore, step2VisitSection } from '../step-2';
import { step3GetScore, step3TotalScore, step3VisitSection } from '../step-3';
import { step4TotalScore, step4VisitSection } from '../step-4';
import { step5TotalScore, step5VisitSection } from '../step-5';
import { step6TotalScore, step6VisitSection } from '../step-6';
import { step7TotalScore, step7VisitSection } from '../step-7';
import { step8TotalScore, step8VisitSection } from '../step-8';
import { step16Question1, step16VisitSection } from '../step-16';
import { ReactComponent as RedRating } from '@/assets/red_rating.svg';
import { useParams } from 'react-router';
import {
  PractitionerJourneyParams,
  visitTypes,
} from '@/pages/coach/coach-practitioner-journey/coach-practitioner-journey.types';
import { useSelector } from 'react-redux';
import { getPractitionerTimelineByIdSelector } from '@/store/pqa/pqa.selectors';

export const pqaVisitSectionStep17 = 'Step 17';
export const pqaSummaryQuestionStep17 = 'Summary of discussion';

export const Step17 = ({
  sectionQuestions,
  smartStarter,
  pqaRating,
  setSectionQuestions,
  setEnableButton,
  setPqaRating,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const firstName = smartStarter?.user?.firstName || 'the smartStarter';
  const fullName = `${firstName} ${smartStarter?.user?.surname || ''}`;

  const { practitionerId } = useParams<PractitionerJourneyParams>();

  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );

  const pqaRatings =
    timeline?.pQARatings?.filter(
      (item) => item?.visitTypeName !== visitTypes.pqa.followUp.name
    ) ?? [];

  const pqaRating1 = pqaRatings?.[0];
  const pqaRating2 = pqaRatings?.[1];
  const pqaRating3 = pqaRatings?.[2];

  const pqaRatingColorList = [
    pqaRating1?.overallRatingColor,
    pqaRating2?.overallRatingColor,
    pqaRating3?.overallRatingColor,
    pqaRating?.color,
  ];

  const pqaRatingRedColorCount = pqaRatingColorList.filter(
    (item) => item === 'Error'
  ).length;

  const step3 = sectionQuestions?.find(
    (item) => item.visitSection === step3VisitSection
  )?.questions[0];
  const step3answers = step3?.answer as string[];
  const step3Score = step3GetScore(step3answers);
  const step16Question1Answer = sectionQuestions
    ?.find((item) => item.visitSection === step16VisitSection)
    ?.questions.find((item) => item.question === step16Question1)?.answer;
  const isToRemoveSmartStarter = step16Question1Answer === true;

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

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setAnswer(value);
      setSectionQuestions?.([
        {
          visitSection: pqaVisitSectionStep17,
          questions: [{ answer, question: pqaSummaryQuestionStep17 }],
        },
      ]);

      if (value !== '') {
        setEnableButton?.(true);
      } else {
        setEnableButton?.(false);
      }
    },
    [answer, setEnableButton, setSectionQuestions]
  );

  const renderContent = useMemo(() => {
    if (isToRemoveSmartStarter) {
      return (
        <>
          <div className="rounded-10 bg-errorBg mb-4 flex items-center p-4">
            <RedRating className="mr-2 h-auto w-12" />
            <Typography
              text="Red rating"
              type="h4"
              className="text-errorDark"
            />
          </div>
          <Alert
            type="warning"
            title={`${firstName} must be removed from SmartStart and is no longer allowed to run a SmartStart programme.`}
            list={[
              'An adult was observed hitting or smacking a child at the programme.',
              `Explain to ${firstName} why they will not be able to continue.`,
            ]}
          />
        </>
      );
    }
    return (
      <Rating
        sectionQuestions={sectionQuestions}
        sections={sections}
        setPqaRating={setPqaRating}
      />
    );
  }, [
    firstName,
    isToRemoveSmartStarter,
    sectionQuestions,
    sections,
    setPqaRating,
  ]);

  useEffect(() => {
    setEnableButton?.(false);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography type="h2" text="PQA rating" color="textDark" />
      <Typography
        type="h4"
        text={`${fullName}, ${new Date().toLocaleDateString('en-ZA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`}
        color="textMid"
      />
      {pqaRatingRedColorCount === 2 && (
        <Alert
          className="mt-4"
          type="error"
          title={`${firstName} has received 2 red ratings`}
          list={[
            `This means ${firstName} will not be able to continue in the programme.`,
            `Explain to ${firstName} why they will not be able to continue.`,
          ]}
        />
      )}
      <Divider dividerType="dashed" className="my-4" />
      {renderContent}
      <FormInput
        className="mt-4"
        textInputType="textarea"
        label={pqaSummaryQuestionStep17}
        subLabel={
          isToRemoveSmartStarter
            ? 'Discuss the decision with the SmartStarter.'
            : 'Discuss next steps and agreed priorities for action or improvement.'
        }
        placeholder={
          isToRemoveSmartStarter
            ? 'e.g. discussed alternative career paths'
            : 'e.g. put children’s artwork up on the wall'
        }
        value={answer}
        onChange={onChange}
      />
    </div>
  );
};
