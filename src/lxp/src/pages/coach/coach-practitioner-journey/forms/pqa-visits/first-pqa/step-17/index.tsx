import { Divider, FormInput, Typography } from '@ecdlink/ui';
import { DynamicFormProps, Question } from '../../../dynamic-form';
import { ChangeEvent, useEffect, useState } from 'react';
import { Rating, TableProps } from './table';
import { step2TotalScore, step2VisitSection } from '../step-2';
import { step3GetScore, step3TotalScore, step3VisitSection } from '../step-3';
import { step4TotalScore, step4VisitSection } from '../step-4';
import { step5TotalScore, step5VisitSection } from '../step-5';
import { step6TotalScore, step6VisitSection } from '../step-6';
import { step7TotalScore, step7VisitSection } from '../step-7';
import { step8TotalScore, step8VisitSection } from '../step-8';

export const Step17 = ({
  sectionQuestions,
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const question = 'Summary of discussion';
  const visitSection = 'Step 17';
  const fullName = `${smartStarter?.user?.firstName || 'the smartStarter'} ${
    smartStarter?.user?.surname || ''
  }`;

  const step3 = sectionQuestions?.find(
    (item) => item.visitSection === step3VisitSection
  )?.questions[0];
  const step3answers = step3?.answer as string[];
  const step3Score = step3GetScore(step3answers);

  const section1 = sectionQuestions?.find(
    (item) => item.visitSection === step2VisitSection
  )?.questions;
  const section2 = [
    { question: step3?.question, answer: `${step3Score.score} - ` } as Question,
    ...(sectionQuestions?.find(
      (item) => item.visitSection === step4VisitSection
    )?.questions ?? []),
  ];
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

  const sections: TableProps['sections'] = {
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
  };

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setAnswer(value);
    setSectionQuestions?.([
      { visitSection, questions: [{ answer, question }] },
    ]);
  };

  useEffect(() => {
    setEnableButton?.(true);
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
      <Divider dividerType="dashed" className="my-4" />
      <Rating sectionQuestions={sectionQuestions} sections={sections} />
      <FormInput
        className="mt-4"
        textInputType="textarea"
        label={question}
        subLabel="Discuss next steps and agreed priorities for action or improvement."
        placeholder="e.g. put children’s artwork up on the wall"
        value={answer}
        onChange={onChange}
      />
    </div>
  );
};
