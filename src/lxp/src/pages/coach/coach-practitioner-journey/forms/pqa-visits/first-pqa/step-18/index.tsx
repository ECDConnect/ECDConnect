import {
  ButtonGroup,
  ButtonGroupTypes,
  Divider,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { childrenSelectors } from '@/store/children';
import { classroomsSelectors } from '@/store/classroom';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import {
  ClassroomGroupDto,
  UserDto,
  getFormattedDateInYearsMonthsAndDays,
  numberToDayOfWeek,
  usePrevious,
} from '@ecdlink/core';

export const Step18 = ({
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [registeredChildren, setRegisteredChildren] = useState<UserDto[]>();
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
      question: 'Was there an assistant present today?',
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

  const visitSection = 'Step 18';
  const name = smartStarter?.user?.firstName || 'the SmartStarter';

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const children = useSelector(childrenSelectors.getChildren);
  const childUsers = useSelector(childrenSelectors.getChildUsers);
  const allLearners = useSelector(
    classroomsSelectors.getClassroomGroupLearners
  );

  const allClassroomGroups = useSelector(
    classroomsSelectors.getClassroomGroups
  );
  const classProgrammes = useSelector(classroomsSelectors.getClassProgrammes);
  const classroomGroups = allClassroomGroups.filter(
    (x) => x.name !== NoPlaygroupClassroomType.name
  );
  const currentClassroomGroups = classroomGroups.filter(
    (item) => item?.userId === smartStarter?.userId
  );
  const previousClassroomGroups = usePrevious(currentClassroomGroups) as
    | ClassroomGroupDto[]
    | undefined;

  const currentClassProgrammes = classProgrammes.filter((el) => {
    return currentClassroomGroups.some((f) => {
      return f.id === el.classroomGroupId;
    });
  });

  const days = currentClassProgrammes
    .map((item) => item.meetingDay, 'short')
    .sort()
    .map((item) => numberToDayOfWeek(item, 'short'));

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

      const wasAssistant = !!updatedQuestions[2].answer;
      const isAllQuestions =
        updatedQuestions.length === 5 &&
        updatedQuestions.every((item) => item.answer !== '');
      const is3Questions = updatedQuestions
        .filter((item, index) => index < 3)
        .every((item) => item.answer !== '');
      const isAllCompleted = wasAssistant ? isAllQuestions : is3Questions;

      setEnableButton?.(isAllCompleted);
    },
    [questions, setEnableButton, setSectionQuestions]
  );

  const handleChildren = useCallback(() => {
    if (
      currentClassProgrammes[0] &&
      previousClassroomGroups?.length === currentClassroomGroups.length
    )
      return;

    const filteredChildren = [];
    const _allLearners = allLearners.filter(
      (x) => !Boolean(x.stoppedAttendance)
    );

    for (const learner of _allLearners) {
      if (
        learner.classroomGroupId !== currentClassProgrammes[0].classroomGroupId
      )
        continue;

      const child = children?.find(
        (child) => child.userId === learner.userId && child.isActive
      );
      const childUser = childUsers?.find((y) => y.id === learner.userId);

      if (
        child &&
        child?.caregiverId &&
        childUser?.firstName &&
        childUser?.surname
      ) {
        filteredChildren.push(childUser);
      }
    }

    const sortedChildren = filteredChildren
      .filter((child) => {
        if (child.dateOfBirth === undefined) {
          return false;
        }

        const date = new Date(child.dateOfBirth);
        const minDate = new Date('1900-01-01');
        const maxDate = new Date();
        return !isNaN(date.getTime()) && date >= minDate && date <= maxDate;
      })
      .sort(
        (a, b) =>
          new Date(String(a.dateOfBirth)).getTime() -
          new Date(String(b.dateOfBirth)).getTime()
      );

    setRegisteredChildren(sortedChildren);
  }, [
    allLearners,
    childUsers,
    children,
    currentClassProgrammes,
    currentClassroomGroups.length,
    previousClassroomGroups?.length,
  ]);

  useEffect(() => {
    handleChildren();
  }, [handleChildren]);

  return (
    <div className="flex flex-col gap-3 p-4">
      <Typography type="h2" text="Programme details" color="textDark" />
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
            String(
              registeredChildren?.[registeredChildren?.length - 1].dateOfBirth
            )
          )}`}
        />
        <Typography
          color="textMid"
          type="body"
          text={`Oldest child’s age: ${getFormattedDateInYearsMonthsAndDays(
            String(registeredChildren?.[0].dateOfBirth)
          )}`}
        />
      </div>
      <Divider dividerType="dashed" />
      <div className="flex items-center gap-2">
        <span className="bg-primary rounded-15 px-2 text-sm font-semibold text-white">
          {currentClassProgrammes?.length}
        </span>
        <Typography type="h4" text={`classes assigned to ${name}`} />
      </div>
      <div>
        <Typography color="textMid" type="body" text="Class days:" />
        <Typography color="textMid" type="body" text={days.join(', ')} />
      </div>
      <Divider dividerType="dashed" />
      <FormInput
        type="number"
        label={questions[0].question}
        value={questions[0].answer}
        onChange={(e) => onOptionSelected(e.target.value, 0)}
        placeholder={'e.g. 4'}
      />
      <FormInput
        type="number"
        label={questions[1].question}
        value={questions[1].answer}
        onChange={(e) => onOptionSelected(e.target.value, 1)}
        placeholder={'e.g. 3'}
      />
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
          onOptionSelected={(value) => onOptionSelected(value, 2)}
        />
      </div>
      {!!questions[2].answer && (
        <>
          <FormInput
            label={questions[3].question}
            value={questions[3].answer}
            onChange={(e) => onOptionSelected(e.target.value, 3)}
            placeholder={'First name'}
          />
          <FormInput
            label={questions[4].question}
            value={questions[4].answer}
            onChange={(e) => onOptionSelected(e.target.value, 4)}
            placeholder={'Surname/family name'}
          />
        </>
      )}
    </div>
  );
};
