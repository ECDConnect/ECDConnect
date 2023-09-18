import { Alert, Divider, FormInput, Typography } from '@ecdlink/ui';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Rating, TableProps } from './table';
import { ReactComponent as RedRating } from '@/assets/red_rating.svg';
import { DynamicFormProps } from '../../dynamic-form';
import {
  step15ReAccreditationQuestions,
  step15ReAccreditationVisitSection,
} from '../step-15';
import { step8ReAccreditation } from '../step-8';
import { step10ReAccreditation } from '../step-10';
import { step11ReAccreditation } from '../step-11';
import { step12ReAccreditation } from '../step-12';
import { useParams } from 'react-router';
import {
  PractitionerJourneyParams,
  maxNumberOfVisits,
  visitTypes,
} from '../../../coach-practitioner-journey.types';
import { useSelector } from 'react-redux';
import { getPractitionerTimelineByIdSelector } from '@/store/pqa/pqa.selectors';
import { chunkArray } from '@ecdlink/core';
import { Maybe, PqaRating } from '@ecdlink/graphql';

export const reAccreditationVisitSectionStep16 = 'Step 16';
export const reAccreditationQuestionStep16 = 'Summary of discussion';

export const Step16ReAccreditation = ({
  sectionQuestions,
  smartStarter,
  reAccreditationRating,
  setSectionQuestions,
  setReAccreditationRating,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const firstName =
    smartStarter?.user?.firstName ||
    smartStarter?.firstName ||
    'the smartStarter';
  const fullName = `${firstName} ${smartStarter?.user?.surname || ''}`;

  const { practitionerId } = useParams<PractitionerJourneyParams>();

  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );

  // All years
  const filteredReAccreditationRatings =
    timeline?.reAccreditationRatings?.filter(
      (item) => item?.visitTypeName !== visitTypes.reaccreditation.followUp.name
    ) ?? [];
  const subdividedReAccreditationRatings = chunkArray<Maybe<PqaRating>>(
    filteredReAccreditationRatings,
    maxNumberOfVisits
  );
  const reAccreditationRatingsFromCurrentYear =
    subdividedReAccreditationRatings?.[
      subdividedReAccreditationRatings.length - 1
    ];

  const reAccreditationRating1 = reAccreditationRatingsFromCurrentYear?.[0];
  const reAccreditationRating2 = reAccreditationRatingsFromCurrentYear?.[1];
  const reAccreditationRating3 = reAccreditationRatingsFromCurrentYear?.[2];

  const reAccreditationRatingColorList = [
    reAccreditationRating1?.overallRatingColor,
    reAccreditationRating2?.overallRatingColor,
    reAccreditationRating3?.overallRatingColor,
    reAccreditationRating?.color,
  ];

  const reAccreditationRatingOrangeColorCount =
    reAccreditationRatingColorList.filter((item) => item === 'Warning').length;

  const reAccreditationRatingRedColorCount =
    reAccreditationRatingColorList.filter((item) => item === 'Error').length;

  const step15Question1Answer = sectionQuestions
    ?.find((item) => item.visitSection === step15ReAccreditationVisitSection)
    ?.questions.find(
      (item) => item.question === step15ReAccreditationQuestions.question1
    )?.answer;
  const isToRemoveSmartStarter = step15Question1Answer === true;

  const section1 = sectionQuestions?.find(
    (item) => item.visitSection === step8ReAccreditation.visitSection
  )?.questions;

  const section2 = sectionQuestions?.find(
    (item) => item.visitSection === step10ReAccreditation.visitSection
  )?.questions;
  const section3 = sectionQuestions?.find(
    (item) => item.visitSection === step11ReAccreditation.visitSection
  )?.questions;
  const section4 = sectionQuestions?.find(
    (item) => item.visitSection === step12ReAccreditation.visitSection
  )?.questions;

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

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setAnswer(value);
      setSectionQuestions?.([
        {
          visitSection: reAccreditationVisitSectionStep16,
          questions: [
            { answer: value, question: reAccreditationQuestionStep16 },
          ],
        },
      ]);

      if (value !== '') {
        setEnableButton?.(true);
      } else {
        setEnableButton?.(false);
      }
    },
    [setEnableButton, setSectionQuestions]
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
        name={firstName}
        sectionQuestions={sectionQuestions}
        sections={sections}
        isToRemoveSmartStarter={isToRemoveSmartStarter}
        isTwoOrangeRatings={reAccreditationRatingOrangeColorCount === 2}
        setReAccreditationRating={setReAccreditationRating}
      />
    );
  }, [
    reAccreditationRatingOrangeColorCount,
    firstName,
    isToRemoveSmartStarter,
    sectionQuestions,
    sections,
    setReAccreditationRating,
  ]);

  useEffect(() => {
    setEnableButton?.(false);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text="Reaccreditation PQA rating"
        color="textDark"
      />
      <Typography
        type="h4"
        text={`${fullName}, ${new Date().toLocaleDateString('en-ZA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`}
        color="textMid"
      />
      {reAccreditationRatingOrangeColorCount === 2 && (
        <Alert
          className="mt-4"
          type="error"
          title={`${firstName} has received 2 orange ratings`}
          list={[
            `This means ${firstName} must go through a full PQA visit again.`,
          ]}
        />
      )}
      {reAccreditationRatingRedColorCount === 2 && (
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
        label={reAccreditationQuestionStep16}
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
