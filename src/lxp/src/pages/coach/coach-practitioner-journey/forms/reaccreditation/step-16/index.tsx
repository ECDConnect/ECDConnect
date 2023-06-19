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

export const Step16ReAccreditation = ({
  sectionQuestions,
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const question = 'Summary of discussion';
  const visitSection = 'Step 16';
  const firstName = smartStarter?.user?.firstName || 'the smartStarter';
  const fullName = `${firstName} ${smartStarter?.user?.surname || ''}`;

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
        { visitSection, questions: [{ answer, question }] },
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
        isToRemoveSmartStarter={isToRemoveSmartStarter}
      />
    );
  }, [firstName, isToRemoveSmartStarter, sectionQuestions, sections]);

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
      <Divider dividerType="dashed" className="my-4" />
      {renderContent}
      <FormInput
        className="mt-4"
        textInputType="textarea"
        label={question}
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
