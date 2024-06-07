import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  Divider,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { childrenSelectors } from '@/store/children';
import { classroomsSelectors } from '@/store/classroom';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import {
  ChildDto,
  ClassroomGroupDto,
  UserDto,
  getFormattedDateInYearsMonthsAndDays,
  numberToDayOfWeek,
  parseBool,
  usePrevious,
  useSessionStorage,
} from '@ecdlink/core';
import { DynamicFormProps, SectionQuestions } from '../../dynamic-form';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';

interface State {
  question: string;
  answer: string;
}

const question3 = 'Was there an assistant present today?';

export const Step17ReAccreditation = ({
  isView,
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [registeredChildren, setRegisteredChildren] = useState<ChildDto[]>();
  const [questions, setAnswers] = useState([
    {
      question: 'How many children are present today?',
      answer: '',
    },
    {
      question: 'How long did the programme run today?',
      answer: '',
    },
    {
      question: question3,
      answer: '',
    },
    {
      question: 'Assistant first name',
      answer: '',
    },
    {
      question: 'Assistant surname',
      answer: '',
    },
  ]);

  const visitSection = 'Step 17';
  const name =
    smartStarter?.user?.firstName ||
    smartStarter?.firstName ||
    'the SmartStarter';
  const userId = smartStarter?.user?.id || smartStarter?.id || '';

  const [visitIdFromPractitionerJourney] = useSessionStorage(
    practitionerVisitIdKey
  );

  const isViewAnswers = isView || !!visitIdFromPractitionerJourney;
  const isPrincipal = !!visitIdFromPractitionerJourney
    ? (smartStarter as UserDto)?.principalObjectData?.isPrincipal
    : smartStarter?.isPrincipal === true;

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

  const options = [
    { text: 'Yes', value: true, disabled: isViewAnswers },
    { text: 'No', value: false, disabled: isViewAnswers },
  ];

  const children = useSelector(childrenSelectors.getChildren);
  const allLearners = useSelector(
    classroomsSelectors.getClassroomGroupLearners
  );

  const classroom = useSelector(classroomsSelectors.getClassroom);
  const allClassroomGroups = useSelector(
    classroomsSelectors.getClassroomGroups
  );
  const classroomGroups = allClassroomGroups?.filter(
    (x) => x?.name !== NoPlaygroupClassroomType?.name
  );
  const classroomId = classroomGroups.find(
    (item) => item.userId === userId
  )?.classroomId;

  const currentClassroomGroups = isPrincipal
    ? classroomGroups.filter((item) => item.classroomId === classroomId)
    : classroomGroups.filter((item) => item?.userId === userId);
  const previousClassroomGroups = usePrevious(currentClassroomGroups) as
    | ClassroomGroupDto[]
    | undefined;

  const currentClassProgrammes = currentClassroomGroups
    ?.flatMap((x) => x.classProgrammes)
    .filter((x) => x.isActive);

  const days = currentClassProgrammes?.map((item) => item?.meetingDay).sort();

  const stringDays = days
    // remove duplicates
    ?.filter((element, index) => days.indexOf(element) === index)
    ?.map((item) => numberToDayOfWeek(item, 'short'));

  const wasAssistant = !!questions[2].answer;
  const isAllQuestions =
    questions.length === 5 && questions?.every((item) => item.answer !== '');
  const is3Questions = questions
    .slice(0, 3)
    .every((item) => item?.answer !== '');
  const isAllCompleted = wasAssistant ? isAllQuestions : is3Questions;

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question) => {
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
    },
    [questions, setSectionQuestions]
  );

  const handleChildren = useCallback(() => {
    if (previousClassroomGroups?.length === currentClassroomGroups?.length)
      return;

    const filteredChildren = [];

    for (const learner of currentClassroomGroups.flatMap((cg) => cg.learners)) {
      if (!learner.isActive || learner.stoppedAttendance) continue;

      const childUser = children?.find(
        (y) => y?.userId === learner?.childUserId
      );

      if (childUser) {
        filteredChildren.push(childUser);
      }
    }

    // sort by date of birth to get youngest and oldest child
    const sortedChildren = filteredChildren
      .filter((child) => {
        if (child?.user?.dateOfBirth === undefined) {
          return false;
        }

        const date = new Date(child?.user?.dateOfBirth);
        const minDate = new Date('1900-01-01');
        const maxDate = new Date();
        return !isNaN(date.getTime()) && date >= minDate && date <= maxDate;
      })
      .sort(
        (a, b) =>
          new Date(String(a?.user?.dateOfBirth)).getTime() -
          new Date(String(b?.user?.dateOfBirth)).getTime()
      );

    setRegisteredChildren(sortedChildren);
  }, [
    allLearners,
    children,
    currentClassroomGroups,
    previousClassroomGroups?.length,
  ]);

  const handleViewMode = useCallback(() => {
    if (
      isViewAnswers &&
      previousData?.questions?.length !==
        previousStatePreviousData?.questions?.length
    ) {
      const updatedQuestions = questions.map((question) => {
        const correspondingQuestion = previousData?.questions?.find(
          (secondQuestion) => secondQuestion?.question === question.question
        );

        if (correspondingQuestion) {
          const isQuestion3 =
            correspondingQuestion.question.includes(question3);

          return {
            ...question,
            answer:
              isQuestion3 && correspondingQuestion.answer
                ? parseBool(String(correspondingQuestion.answer))
                : correspondingQuestion.answer,
          };
        }

        return question;
      });

      setAnswers(updatedQuestions as State[]);
    }
  }, [
    isViewAnswers,
    previousData?.questions,
    previousStatePreviousData?.questions.length,
    questions,
  ]);

  useEffect(() => {
    handleViewMode();
  }, [handleViewMode]);

  useEffect(() => {
    if (isViewAnswers) {
      setEnableButton?.(true);
    } else {
      setEnableButton?.(isAllCompleted);
    }
  }, [isAllCompleted, isViewAnswers, setEnableButton]);

  useEffect(() => {
    handleChildren();
  }, [handleChildren]);

  return (
    <div className="flex flex-col gap-3 p-4">
      <Typography type="h2" text="Programme details" color="textDark" />
      {isViewAnswers && (
        <Alert
          className="my-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <Divider dividerType="dashed" />
      <div className="flex items-center gap-2">
        <span className="bg-primary rounded-15 px-2 text-sm font-semibold text-white">
          {registeredChildren?.length}
        </span>
        <Typography
          type="h4"
          text="Children are registered at this programme (on Funda App)"
        />
      </div>
      <div>
        <Typography
          color="textMid"
          type="body"
          text={`Youngest child’s age: ${getFormattedDateInYearsMonthsAndDays(
            String(registeredChildren?.[0]?.user?.dateOfBirth)
          )}`}
        />
        <Typography
          color="textMid"
          type="body"
          text={`Oldest child’s age: ${getFormattedDateInYearsMonthsAndDays(
            String(
              registeredChildren?.[registeredChildren?.length - 1]?.user
                ?.dateOfBirth
            )
          )}`}
        />
      </div>
      <Divider dividerType="dashed" />
      <div className="flex items-center gap-2">
        <span className="bg-primary rounded-15 px-2 text-sm font-semibold text-white">
          {currentClassroomGroups?.length}
        </span>
        <Typography
          type="h4"
          text={
            isPrincipal
              ? `classes at ${classroom?.name}`
              : `classes assigned to ${name}`
          }
        />
      </div>
      <div>
        <Typography
          color="textMid"
          type="body"
          text={isPrincipal ? 'Programme days' : 'Class days:'}
        />
        <Typography color="textMid" type="body" text={stringDays.join(', ')} />
      </div>
      <Divider dividerType="dashed" />
      <FormInput
        type="number"
        label={questions[0].question}
        value={questions[0].answer}
        disabled={isViewAnswers}
        onChange={(e) => onOptionSelected(e.target.value, 0)}
        placeholder={'e.g. 4'}
      />
      <div>
        <Typography type="h4" text={questions[1].question} color="textDark" />
        <div className="flex">
          <FormInput
            type="number"
            className="w-1/2"
            value={questions[1].answer}
            disabled={isViewAnswers}
            onChange={(e) => onOptionSelected(e.target.value, 1)}
            placeholder={'e.g. 3'}
          />
          <Typography
            type="body"
            text="hours"
            color="textDark"
            className="mt-4 ml-1"
          />
        </div>
      </div>
      <div>
        <Typography
          type="h4"
          text={questions[2].question}
          color="textDark"
          className="mb-2"
        />
        <ButtonGroup<boolean>
          color="secondary"
          type={ButtonGroupTypes.Button}
          options={options}
          selectedOptions={
            questions[2].answer !== ''
              ? Boolean(questions[2].answer)
              : undefined
          }
          onOptionSelected={(value) => onOptionSelected(value, 2)}
        />
      </div>
      {!!questions[2].answer && (
        <>
          <FormInput
            label={questions[3].question}
            value={questions[3].answer}
            onChange={(e) => onOptionSelected(e.target.value, 3)}
            disabled={isViewAnswers}
            placeholder={'First name'}
          />
          <FormInput
            label={questions[4].question}
            value={questions[4].answer}
            disabled={isViewAnswers}
            onChange={(e) => onOptionSelected(e.target.value, 4)}
            placeholder={'Surname/family name'}
          />
        </>
      )}
      {isAllCompleted && (
        <Alert
          className="mt-2"
          type="success"
          title={`All steps complete - your signature and ${name}’s signature have been added.`}
          list={[
            `Please let ${name} know that their signature has been attached.`,
          ]}
        />
      )}
    </div>
  );
};
