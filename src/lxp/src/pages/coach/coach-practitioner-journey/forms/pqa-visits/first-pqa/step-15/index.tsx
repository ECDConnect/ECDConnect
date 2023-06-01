import { Alert, CheckboxChange, CheckboxGroup, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { useCallback, useEffect, useState } from 'react';
import { options } from './options';
import {
  step14CertificateQuestion,
  step14NoteQuestion,
  step14VisitSection,
} from '../step-14';

export const step12VisitSection = 'Step 12';

export const Step15 = ({
  smartStarter,
  sectionQuestions,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [question, setAnswers] = useState({
    question: 'Franchisee agreement',
    answer: [] as (string | number | undefined)[],
  });

  const answers = question.answer as string[];
  const name = smartStarter?.user?.firstName;
  const step14Question1Answer = sectionQuestions
    ?.find((item) => item.visitSection === step14VisitSection)
    ?.questions.find((item) => item.question === step14CertificateQuestion)
    ?.answer as boolean | undefined;
  const step14Question2Answer = sectionQuestions
    ?.find((item) => item.visitSection === step14VisitSection)
    ?.questions.find((item) => item.question === step14NoteQuestion)
    ?.answer as string;
  const currentOptions =
    !!step14Question2Answer && !step14Question1Answer
      ? options.question1FromNotPass
      : options.question1;

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      if (event.checked) {
        const currentAnswers = answers
          ? [...answers, event.value]
          : [event.value];

        const updatedQuestion = { ...question, answer: currentAnswers };

        setAnswers(updatedQuestion);
        return setSectionQuestions?.([
          {
            visitSection: step12VisitSection,
            questions: [updatedQuestion],
          },
        ]);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);
      const updatedQuestion = { ...question, answer: currentAnswers };

      setAnswers(updatedQuestion);
      return setSectionQuestions?.([
        { visitSection: step12VisitSection, questions: [updatedQuestion] },
      ]);
    },
    [answers, question, setSectionQuestions]
  );

  useEffect(() => {
    if (question.answer?.length === currentOptions?.length) {
      return setEnableButton?.(true);
    }

    setEnableButton?.(false);
  }, [currentOptions, question, setEnableButton]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text={`${name} - ${question.question}`}
        color="textDark"
      />
      {!!step14Question2Answer && (
        <div className="bg-uiBg rounded-15 mt-4 p-4">
          <Typography
            type="h3"
            text={`Next steps for ${name}`}
            color="textDark"
          />
          <Typography
            type="body"
            text={step14Question2Answer}
            color="textMid"
          />
        </div>
      )}
      <Typography
        className="my-4"
        type="h4"
        text={`Give the phone to ${name} & ask them to confirm each item by tapping the box:`}
        color="textDark"
      />
      {currentOptions.map((item) => (
        <CheckboxGroup
          className="mb-2"
          id={item}
          key={item}
          title={item}
          titleColours="textMid"
          titleSize="sm"
          titleWeight="normal"
          checked={answers?.some((option) => option === item)}
          value={item}
          onChange={onCheckboxChange}
        />
      ))}
      <Alert
        className="mt-4"
        type="warning"
        title={`Note: by tapping the “Next” button below, you are confirming that ${name} checked the boxes and agrees to all of the steps.`}
        list={[`${name}’s signature will be added.`]}
      />
    </div>
  );
};
