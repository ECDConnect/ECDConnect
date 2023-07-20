import {
  Alert,
  CheckboxChange,
  CheckboxGroup,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { questions } from './questions';
import { useCallback, useEffect, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { replaceBraces } from '@ecdlink/core';
import { currentActivityKey } from '../..';
import { useSelector } from 'react-redux';
import {
  getCurrentCoachPractitionerVisitByUserId,
  getVisitDataByVisitIdSelector,
} from '@/store/pqa/pqa.selectors';

export const ProgrammeObservations = ({
  isView,
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [question, setAnswers] = useState({
    question: "Think about {client}'s SmartStart programme delivery.",
    answer: [] as (string | number | undefined)[] | string[] | undefined,
  });

  const answers = question.answer as string[];
  const name = smartStarter?.user?.firstName || 'the smartStarter';
  const visitSection = 'Programme observations';
  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';

  const currentVisit = useSelector(
    getCurrentCoachPractitionerVisitByUserId(
      activityName,
      smartStarter?.userId!
    )
  );
  const previousVisitAnswers = useSelector(
    getVisitDataByVisitIdSelector(currentVisit?.id, 'prePqaPreviousFormData')
  );
  const previousSectionAnswers = previousVisitAnswers?.filter(
    (item) => item.visitSection === visitSection
  );

  const question1 = previousSectionAnswers?.find(
    (item) => item.question === question.question
  );

  const setPreviousAnswers = useCallback(() => {
    if (!question.answer?.length) {
      setAnswers((prevState) => ({
        ...prevState,
        answer: question1?.questionAnswer?.split(/,(?=[A-Z])/),
      }));
    }
  }, [question.answer, question1]);

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
            visitSection,
            questions: [updatedQuestion],
          },
        ]);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);
      const updatedQuestion = { ...question, answer: currentAnswers };

      setAnswers(updatedQuestion);
      return setSectionQuestions?.([
        { visitSection, questions: [updatedQuestion] },
      ]);
    },
    [answers, question, setSectionQuestions, visitSection]
  );

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  useEffect(() => {
    if (isView) {
      setPreviousAnswers();
    }
  }, [setPreviousAnswers, isView]);

  return (
    <div className="p-4">
      <Typography type="h2" text={visitSection} color="textDark" />
      <Typography
        type="h4"
        text={replaceBraces(question.question, name)}
        color="textMid"
      />
      {isView && (
        <Alert
          className="mt-4"
          type="warning"
          title="You are viewing this form and cannot edit responses."
        />
      )}
      <Divider dividerType="dashed" className="p-3" />
      <div className="flex flex-col gap-2">
        <Typography
          type="h3"
          text="Select the box below if the statement is true."
          color="textDark"
        />
        {questions.map((item) => (
          <CheckboxGroup
            disabled={isView}
            id={item.title}
            key={item?.title}
            title={`<p className="text-white"><strong>${item?.title}</strong> ${item.subTitle}</p>`}
            titleColours="textMid"
            titleSize="sm"
            titleWeight="normal"
            checked={answers?.some(
              (option) => option === item.title + item.subTitle
            )}
            value={item.title + item.subTitle}
            onChange={onCheckboxChange}
          />
        ))}
      </div>
    </div>
  );
};
