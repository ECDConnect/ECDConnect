import { Alert, Divider, FormInput, Typography } from '@ecdlink/ui';
import { useCallback, useState, ChangeEvent, useEffect, useMemo } from 'react';
import { DynamicFormProps, SectionQuestions } from '../../dynamic-form';
import { useSelector } from 'react-redux';
import {
  CalculateCapacityProps,
  calculateCapacity,
  calculateTotalSquareMeters,
} from './utils/math';
import { classroomsSelectors } from '@/store/classroom';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import { toCamelCase, usePrevious, useSessionStorage } from '@ecdlink/core';
import {
  step5ReAccreditationQuestion,
  step5ReAccreditationVisitSection,
} from '../step-5';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';

interface State {
  question: string;
  answer: string;
}

export const Step6ReAccreditation = ({
  smartStarter,
  sectionQuestions,
  isView,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: 'How many cm is the short side of the room?',
      answer: '',
    },
    {
      question: 'How many cm is the long side of the room?',
      answer: '',
    },
  ]);

  const visitSection = 'Step 6';

  const [visitIdFromPractitionerJourney] = useSessionStorage(
    practitionerVisitIdKey
  );

  const isViewAnswers = isView || !!visitIdFromPractitionerJourney;

  const previousDataStep5 = useSelector(
    getSectionsQuestionsByStep(
      visitIdFromPractitionerJourney ?? '',
      'reAccreditationPreviousFormData',
      step5ReAccreditationVisitSection
    )
  );

  const previousData = useSelector(
    getSectionsQuestionsByStep(
      visitIdFromPractitionerJourney ?? '',
      'reAccreditationPreviousFormData',
      visitSection
    )
  );
  const previousStatePreviousData = usePrevious(previousData) as
    | SectionQuestions
    | undefined;

  const allClassroomGroups = useSelector(
    classroomsSelectors.getClassroomGroups
  );
  const classroomGroups = allClassroomGroups.filter(
    (x) => x.name !== NoPlaygroupClassroomType.name
  );

  const currentClassroomGroups = classroomGroups.filter(
    (item) => item?.userId === smartStarter?.userId
  );
  const numberOfAssistants = (
    isViewAnswers
      ? previousDataStep5?.questions
      : sectionQuestions?.find(
          (item) => item.visitSection === step5ReAccreditationVisitSection
        )?.questions
  )?.find((item) => item.question === step5ReAccreditationQuestion)?.answer;

  const onOptionSelected = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index) => {
      const value = event.target.value;
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question, currentIndex) => {
        if (question.question === currentQuestion.question) {
          return {
            ...question,
            answer: value,
          };
        }
        return question;
      });

      setAnswers(updatedQuestions);
      setSectionQuestions?.([
        {
          visitSection,
          questions: updatedQuestions,
        },
      ]);

      setEnableButton?.(updatedQuestions.every((item) => !!item.answer));
    },
    [questions, setEnableButton, setSectionQuestions]
  );

  const getCapacity = () => {
    const result = calculateCapacity({
      longSide: Number(questions[1].answer),
      shortSide: Number(questions[0].answer),
      numberOfAssistants: Number(numberOfAssistants),
      programType: 'preschool',
    });

    if (result > 0) {
      return `${result} children`;
    }

    return 'It was not possible to calculate the capacity';
  };

  const handleViewMode = useCallback(() => {
    if (
      isViewAnswers &&
      previousData &&
      previousData?.questions.length !==
        previousStatePreviousData?.questions.length
    ) {
      setAnswers(previousData?.questions as State[]);
    }
  }, [
    isViewAnswers,
    previousData,
    previousStatePreviousData?.questions.length,
  ]);

  const renderAlertList = useMemo(() => {
    // const programmeType = 'N/A';

    // if (programmeType === 'playgroup') {
    //   return [
    //     'Playgroups can have a maximum of 12 children at a time.',
    //     'Every child must have at least 1 square metre of free space each to play in.',
    //     'There should be 10 children to every 1 adult in the programme.',
    //   ];
    // }

    // if (programmeType === 'dayMother') {
    //   return [
    //     'Day mothers can have a maximum of 6 children at a time.',
    //     'Every child must have at least 1 square metre of free space each to play in.',
    //     'There should be 10 children to every 1 adult in the programme.',
    //   ];
    // }

    return [
      'Preschools can have a maximum of 20 children at a time.',
      'Every child must have at least 1 square metre of free space each to play in.',
      'There should be 10 children to every 1 adult in the programme.',
    ];
  }, [currentClassroomGroups]);

  useEffect(() => {
    handleViewMode();
  }, [handleViewMode]);

  useEffect(() => {
    if (isViewAnswers) {
      setEnableButton?.(true);
    }
  }, [isViewAnswers, setEnableButton]);

  return (
    <div className="p-4">
      <Typography type="h2" text="Programme details" color="textDark" />
      {isViewAnswers && (
        <Alert
          className="my-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <Typography
        type="h4"
        text="Measure the room in centimetres:"
        color="textDark"
        className="my-4"
      />
      <Typography
        type="h4"
        text="Help the SmartStarter clear the space so that it is laid out as it will be when the programme is running. Now use your measuring tape to measure it."
        color="textMid"
        className="my-4"
      />
      {questions.map((item, index) => (
        <div className="flex items-end gap-2" key={item.question}>
          <FormInput
            type="number"
            className="mt-2"
            label={item.question}
            placeholder="e.g. 410"
            value={item.answer}
            disabled={isViewAnswers}
            onChange={(value) => onOptionSelected(value, index)}
            {...(!!item.answer &&
              Number(item.answer) < 50 && {
                error: {
                  type: 'max',
                  message: 'Please enter a number that is more 49.',
                },
              })}
          />
          <span className="mb-4">cm</span>
        </div>
      ))}
      {questions.every((item) => Number(item.answer) > 49) && (
        <>
          <Divider dividerType="dashed" className="mt-4" />
          <Typography
            type="h4"
            text={`Total metres squared available: ${calculateTotalSquareMeters(
              Number(questions[0].answer),
              Number(questions[1].answer)
            )}`}
            color="textDark"
            className="my-4"
          />
          <Typography
            type="h4"
            text={`Assistants: ${numberOfAssistants}`}
            color="textDark"
            className="my-4"
          />
          <Typography
            type="h4"
            text={`Capacity: ${getCapacity()}`}
            color="textDark"
            className="my-4"
          />
          <Divider dividerType="dashed" className="mb-4" />
        </>
      )}
      <Alert
        className="mt-4"
        type="info"
        title="Check the capacity above before tapping Next. How is programme capacity calculated?"
        list={renderAlertList}
      />
    </div>
  );
};
